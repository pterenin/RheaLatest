import {
  Component,
  ComponentFactoryResolver,
  ElementRef,
  Injector,
  AfterViewInit,
  ViewChild,
  ViewEncapsulation,
  OnDestroy,
  Output,
  EventEmitter,
  HostListener,
  Input
} from '@angular/core';

import { DataFlowChartNodeComponent } from '../data-flow-chart-node/data-flow-chart-node.component';

import { LayoutSettingsConstant } from '../../constants/layout-settings.constant';
import { DataFlowColors } from '../../constants/data-flow-colors.constant';
import { DataTransferTypes } from '../../constants/data-flow.constants';

import {
  DataFlowChartInterface,
  DataFlowShowDetailsInterface,
  DataFlowChartPaperInterface,
  SvgPanZoomInterface
} from '../../interfaces';

declare const svgPanZoom: any;
declare const joint: any;
declare const _: any;

const isIE = () => {
  const ua = window.navigator.userAgent; // Check the userAgent property of the window.navigator object
  const msie = ua.indexOf('MSIE '); // IE 10 or older
  const trident = ua.indexOf('Trident/'); // IE 11

  return msie > 0 || trident > 0;
};

@Component({
  selector: 'ta-data-flow-chart',
  templateUrl: './data-flow-chart.component.html',
  styleUrls: ['./data-flow-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DataFlowChartComponent implements AfterViewInit, OnDestroy {
  @ViewChild('paper') public paperElement: ElementRef;

  @Input() public data: DataFlowChartInterface;
  @Input() public hideControls: boolean;

  @Output() renderComplete = new EventEmitter();
  @Output() public showDetails: EventEmitter<DataFlowShowDetailsInterface>;

  private graph: { [key: string]: any };
  private paper: DataFlowChartPaperInterface;

  private pannedInstance: SvgPanZoomInterface;
  private pannedInstanceZoom: number;
  private isPanEnabled: boolean;

  public preloader: number;
  public hidePreloader: boolean;
  public totalNodes: string;

  @HostListener('window:resize')
  public onResize() {
    this.resizeHandler();
  }

  constructor(
    private elementRef: ElementRef,
    private resolver: ComponentFactoryResolver,
    private injector: Injector
  ) {
    this.pannedInstanceZoom = 1;
    this.hidePreloader = false;
    this.showDetails = new EventEmitter();
  }

  public ngAfterViewInit() {
    if (this.data) {
      setTimeout(() => {
        this.initGraph();
      });
    }
  }

  private initGraph() {
    const HEIGHT = this.elementRef.nativeElement.offsetHeight;
    const WIDTH = this.elementRef.nativeElement.offsetWidth;

    this.graph = new joint.dia.Graph();
    this.paper = new joint.dia.Paper({
      el: this.paperElement.nativeElement,
      width: WIDTH,
      height: HEIGHT,
      model: this.graph,
      ...LayoutSettingsConstant.Chart
    });

    this.buildGraphData();

    this.paper.unfreeze({
      batchSize: 50,
      progress: (done: number, current: number, total: number) => {
        const progress = current / total;

        this.preloader = Math.round(progress * 100);
        this.totalNodes = `(${current} of ${total})`;

        if (done) {
          this.defineHighlightEvents(
            this.getCellInBoundsOutBounds,
            this.applyOpacity,
            this.paper
          );
          this.defineDetailsEvents(this.graph);
          this.paper.unfreeze();
          this.makeElementComponent();
          this.initSvgPanZoom();

          this.hidePreloader = true;
          this.renderComplete.emit();

          // FUTURE REFERENCE FOR SAVING GRAPH
          // console.log(this.graph.toJSON());
        }
      }
    });
  }

  private buildGraphData() {
    const DATA_SUBJECT = this.makeDataSubjects().map(this.makeElement);
    const IT_SYSTEMS = this.makeItSystems().map(this.makeElement);
    const DATA_RECIPIENT = this.makeDataRecipients().map(this.makeElement);

    const DS_DUMMY = this.makeDummyElement({ id: 'DS_DUMMY' }); // ACT AS EQUILIBRIUM DS FOR IT
    const DR_DUMMY = this.makeDummyElement({ id: 'DR_DUMMY' }); // ACT AS EQUILIBRIUM DR FOR IT

    const DATA_FLOW = _.cloneDeep(this.data);

    const DATA_SUBJECT_CONNECTED_TO_IT_SYSTEM = {};
    const IT_SYSTEM_CONNECTED_TO_DATA_RECIPIENT = {};

    DATA_FLOW.dataTransfers.forEach(data => {
      const dataSubject = DATA_FLOW.dataSubjects.some(
        block => block.blockId === data.sourceBlockId
      );

      const dataRecipient = DATA_FLOW.dataRecipients.some(
        block => block.blockId === data.targetBlockId
      );

      if (dataSubject) {
        DATA_SUBJECT_CONNECTED_TO_IT_SYSTEM[data.targetBlockId] = data;
      }

      if (dataRecipient) {
        IT_SYSTEM_CONNECTED_TO_DATA_RECIPIENT[data.sourceBlockId] = data;
      }
    });

    const LOOKUP_IT_SYSTEMS = {
      all: DATA_FLOW.itSystems.map(block => block.blockId),
      dataSubject: Object.keys(DATA_SUBJECT_CONNECTED_TO_IT_SYSTEM),
      dataRecipient: Object.keys(IT_SYSTEM_CONNECTED_TO_DATA_RECIPIENT)
    };

    const CONNECT_TO_DS = _.differenceWith(
      LOOKUP_IT_SYSTEMS.all,
      LOOKUP_IT_SYSTEMS.dataSubject,
      _.isEqual
    );

    const CONNECT_TO_DR = _.differenceWith(
      LOOKUP_IT_SYSTEMS.all,
      LOOKUP_IT_SYSTEMS.dataRecipient,
      _.isEqual
    );

    const EDGES = [
      ...CONNECT_TO_DS.map(data =>
        this.makeDummyLink({
          source: 'DS_DUMMY',
          target: data
        })
      ),
      ..._.cloneDeep(this.data.dataTransfers).map(dataTransfer =>
        this.makeLink({
          source: dataTransfer.sourceBlockId,
          target: dataTransfer.targetBlockId,
          edgeId: dataTransfer.edgeId
        })
      ),
      ...CONNECT_TO_DR.map(data =>
        this.makeDummyLink({
          source: data,
          target: 'DR_DUMMY'
        })
      )
    ];

    const DATA_SUBJECT_GROUP = this.makeGroup();
    const IT_SYSTEM_GROUP = this.makeGroup();
    const DATA_RECIPIENT_GROUP = this.makeGroup();

    if (LayoutSettingsConstant.Dagre.showGroups) {
      [...[DS_DUMMY], ...DATA_SUBJECT].forEach(data =>
        DATA_SUBJECT_GROUP.embed(data)
      );

      IT_SYSTEMS.forEach(data => IT_SYSTEM_GROUP.embed(data));

      [...[DR_DUMMY], ...DATA_RECIPIENT].forEach(data =>
        DATA_RECIPIENT_GROUP.embed(data)
      );
    }

    this.graph.resetCells([
      ...[DATA_SUBJECT_GROUP, DS_DUMMY, ...DATA_SUBJECT],
      ...[DATA_RECIPIENT_GROUP, DR_DUMMY, ...DATA_RECIPIENT],
      ...[IT_SYSTEM_GROUP, ...IT_SYSTEMS],
      ...EDGES
    ]);

    joint.layout.DirectedGraph.layout(this.graph, LayoutSettingsConstant.Dagre);
  }

  private makeElement(node: any) {
    const nodeColor = data => {
      return data.type === 'dataSubject'
        ? DataFlowColors.dataSubject
        : data.type === 'itSystem' &&
          (data.legalEntityType === 'PRIMARY_ENTITY' ||
            data.legalEntityType === 'COMPANY_AFFILIATE')
        ? DataFlowColors.itSystem
        : data.type === 'itSystem'
        ? DataFlowColors.thirdParty
        : data.type === 'dataRecipient'
        ? DataFlowColors.dataRecipient
        : DataFlowColors.default;
    };

    const nodeDimension = type => {
      return type === 'itSystem'
        ? LayoutSettingsConstant.ItSystems
        : LayoutSettingsConstant.NonItSystems;
    };

    const configuration = {
      id: node.id,
      size: nodeDimension(node.data.type),
      attrs: {
        entityId: node.data.entityId,
        label: {
          class: 'd-flex w-100 h-100 pt-2 px-2',
          style: null,
          // IE11 does not accept foreignObject
          text: isIE()
            ? node.label && node.label.length > 10
              ? node.label.slice(0, 10) + '...'
              : node.label
            : null
        },
        body: {
          strokeWidth: 1,
          stroke: nodeColor(node.data),
          rx: 5,
          ry: 5,
          filter: {
            name: 'dropShadow',
            args: {
              dx: 1,
              dy: 2,
              blur: 1,
              opacity: 0.2
            }
          }
        }
      }
    };

    return new joint.shapes.standard.TextBlock(configuration);
  }

  private makeDummyElement(node: any) {
    return new joint.shapes.standard.TextBlock({
      markup: [],
      id: node.id
    });
  }

  private makeElementComponent() {
    const DATA = [
      ...this.makeDataSubjects(),
      ...this.makeItSystems(),
      ...this.makeDataRecipients()
    ];

    DATA.forEach(element => {
      const factory = this.resolver.resolveComponentFactory(
        DataFlowChartNodeComponent
      );

      const componentRef = factory.create(this.injector);
      componentRef.instance.node = element;
      componentRef.hostView.detectChanges();

      const { nativeElement } = componentRef.location;

      document
        .querySelector(`[model-id="${element.id}"] [joint-selector="label"]`)
        .appendChild(nativeElement);
    });
  }

  private makeMapElement(collection, type) {
    return _.cloneDeep(collection).map(item => {
      return {
        id: item.blockId,
        label: item.name,
        data: {
          type: type,
          ...item
        }
      };
    });
  }

  private makeDataSubjects() {
    return this.makeMapElement(this.data.dataSubjects, 'dataSubject');
  }

  private makeItSystems() {
    return this.makeMapElement(this.data.itSystems, 'itSystem');
  }

  private makeDataRecipients() {
    return this.makeMapElement(this.data.dataRecipients, 'dataRecipient');
  }

  private makeLink(node: any) {
    const configuration = {
      edge: {
        edgeId: node.edgeId
      },
      source: {
        id: node.source,
        connectionPoint: {
          name: 'rectangle',
          args: {
            offset: -1.5
          }
        }
      },
      target: {
        id: node.target,
        connectionPoint: {
          name: 'rectangle',
          args: {
            offset: 1
          }
        }
      },
      router: {
        name: 'manhattan',
        args: {
          padding: LayoutSettingsConstant.BlockElement.padding,
          step:
            this.data.dataRecipients.length > 50
              ? this.data.dataRecipients.length
              : 20,
          startDirections: ['left', 'top', 'bottom', 'right'],
          endDirections: ['right', 'top', 'bottom', 'left']
        }
      },
      connector: {
        name: 'rounded',
        args: {
          radius: 20
        }
      },
      attrs: {
        line: {
          connection: true,
          stroke: DataFlowColors.link,
          strokeWidth: 1,
          targetMarker: {
            type: 'path',
            fill: DataFlowColors.link,
            stroke: 'none',
            d: 'M 4 -4 -1 0 4 4 z'
          },
          sourceMarker: {
            type: 'circle',
            r: 1.5,
            fill: DataFlowColors.white,
            stroke: DataFlowColors.link
          }
        }
      }
    };

    return new joint.shapes.standard.Link(configuration);
  }

  private makeDummyLink(node: any) {
    const configuration = {
      markup: [],
      source: {
        id: node.source
      },
      target: {
        id: node.target
      }
    };
    return new joint.shapes.standard.Link(configuration);
  }

  private makeGroup() {
    const configuration = {
      markup: [], // Comment this line to display group
      attrs: {
        body: {
          fill: DataFlowColors.default,
          stroke: DataFlowColors.itSystem
        }
      }
    };

    return new joint.shapes.standard.Rectangle(configuration);
  }

  private initSvgPanZoom() {
    this.pannedInstance = svgPanZoom(
      document.querySelector('[joint-selector="svg"]'),
      {
        center: true,
        dblClickZoomEnabled: false,
        fit: false,
        maxZoom: 50,
        minZoom: 0.01,
        mouseWheelZoomEnabled: false,
        preventMouseEventsDefault: true,
        refreshRate: 'auto',
        resize: true,
        viewportSelector: '.joint-layers',
        zoomEnabled: true,
        zoomScaleSensitivity: 0.5
      }
    );
    const panZoomSelector: SVGGraphicsElement = <SVGGraphicsElement>(
      document.querySelector('.joint-layers')
    );
    const heightRatio =
      (this.pannedInstance.getSizes().height - 150) /
      panZoomSelector.getBoundingClientRect().height;
    const widthRatio =
      (this.pannedInstance.getSizes().width - 80) /
      panZoomSelector.getBoundingClientRect().width;
    if (heightRatio < 1 || widthRatio < 1) {
      this.pannedInstanceZoom = Math.min(heightRatio, widthRatio);
    }
    this.pannedInstance.zoom(this.pannedInstanceZoom);
    this.pannedInstance.disablePan();
  }

  public handleChartZoom(type: string): void {
    if (type === 'In') {
      this.pannedInstance.zoomIn();
    } else {
      this.pannedInstance.zoomOut();
    }
  }

  public resetZoomChart() {
    this.pannedInstance.zoom(this.pannedInstanceZoom);
    const panZoomTiger = svgPanZoom(
      document.querySelector('[joint-selector="svg"]')
    );
    panZoomTiger.center();
  }

  public fullscreenChart() {
    const element = this.paperElement.nativeElement.parentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  }

  public togglePanChart() {
    this.isPanEnabled = !this.isPanEnabled;
    if (this.isPanEnabled) {
      document.querySelector('.joint-paper svg').classList.add('panning');
      this.pannedInstance.enablePan();
    } else {
      document.querySelector('.joint-paper svg').classList.remove('panning');
      this.pannedInstance.disablePan();
    }
  }

  private resizeHandler() {
    const HEIGHT = this.elementRef.nativeElement.offsetHeight;
    const WIDTH = this.elementRef.nativeElement.offsetWidth;
    this.paper.setDimensions(WIDTH, HEIGHT);
  }

  private getCellInBoundsOutBounds(graph, cell): any {
    return [cell].concat(
      graph.getNeighbors(cell, {
        inbound: true,
        outbound: true,
        indirect: true
      }),
      graph.getConnectedLinks(cell, {
        inbound: true,
        outbound: true,
        indirect: true
      })
    );
  }

  private applyOpacity(nonOpacityCells, model, opacity, paper): void {
    model
      .getCells()
      .filter(unhighlighted => !nonOpacityCells.includes(unhighlighted))
      .forEach(element => {
        if (opacity) {
          paper.findViewByModel(element).vel.addClass('unhighlightedCell');
        } else {
          paper.findViewByModel(element).vel.removeClass('unhighlightedCell');
        }
      });
  }

  private defineHighlightEvents(
    getInboundsOutBounds,
    applyOpacity,
    paper
  ): void {
    paper.on('cell:mouseenter', function(cellView) {
      const highlightedCells = getInboundsOutBounds(this.model, cellView.model);
      applyOpacity(highlightedCells, this.model, true, paper);
      highlightedCells.forEach(function(cell) {
        cell.findView(this).highlight();
      }, this);
    });

    paper.on('cell:mouseleave', function(cellView) {
      const highlightedCells = getInboundsOutBounds(this.model, cellView.model);
      applyOpacity(highlightedCells, this.model, false, paper);
      highlightedCells.forEach(function(cell) {
        cell.findView(this).unhighlight();
      }, this);
    });
  }

  private defineDetailsEvents(model): void {
    this.paper.on('cell:pointerdown ', cell => {
      if (cell.model.attributes.type === 'standard.TextBlock') {
        const node = this.getNodeFromData(cell);
        const systemId = this.getNodeSystem(cell.model, model, node.type);
        this.showDetails.emit({
          bpId: window.location.pathname.split('/')[2],
          edgeBlockId: node.blockId,
          type: node.type,
          systemId
        });
      } else if (cell.model.attributes.type === 'standard.Link') {
        this.showDetails.emit({
          bpId: window.location.pathname.split('/')[2],
          edgeBlockId: cell.model.attributes.edge.edgeId,
          type: DataTransferTypes.DATA_TRANSFER
        });
      }
    });
  }

  private getNodeFromData(cell): any {
    const data = [
      ...this.data.dataRecipients.map(dataRecipient => {
        return {
          ...dataRecipient,
          type: DataTransferTypes.DATA_RECIPIENT
        };
      }),
      ...this.data.dataSubjects.map(dataRecipient => {
        return {
          ...dataRecipient,
          type: DataTransferTypes.DATA_SUBJECT
        };
      }),
      ...this.data.itSystems.map(dataRecipient => {
        return {
          ...dataRecipient,
          type: DataTransferTypes.IT_SYSTEM
        };
      })
    ];
    return data.find(dataItem => dataItem.blockId === cell.model.id);
  }

  private getNodeSystem(cell, graph, type): string {
    if (type === DataTransferTypes.IT_SYSTEM) {
      return cell.attributes.attrs.entityId;
    } else {
      const connectedLinks = graph.getConnectedLinks(cell);
      const direction = type === 'DATA_RECIPIENT' ? 'source' : 'target';
      const systemNode = graph.getCell(
        connectedLinks[0].attributes[direction].id
      );
      return systemNode.attributes.attrs.entityId;
    }
  }

  public ngOnDestroy() {
    if (this.graph) {
      this.graph.clear();
    }

    if (this.paper) {
      this.paper.removeTools();
    }

    if (this.pannedInstance) {
      this.pannedInstance.destroy();
    }
  }
}
