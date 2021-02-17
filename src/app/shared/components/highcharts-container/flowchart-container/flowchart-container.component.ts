import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import * as Highcharts from 'highcharts';
import { Entity } from '../highcharts-container.component';
import { forkJoin, Subscription, throwError, timer } from 'rxjs';
import { AutoUnsubscribe } from 'src/app/shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import * as svgPanZoom from 'svg-pan-zoom';
import { TaPopover } from '@trustarc/ui-toolkit';
import { FlowchartUtilityService } from './flowchart-utility.service';
import { FlowChartService } from 'src/app/business-processes/create-bp/build-data-flow/flow-chart.service';
import {
  GlobalRegionInterface,
  LocationInterface
} from 'src/app/shared/models/location.model';
import { LocationService } from 'src/app/shared/services/location/location.service';
import { CreateBusinessProcessesService } from 'src/app/business-processes/create-bp/create-business-processes.service';
import { DataElementsInterface } from 'src/app/business-processes/create-bp/step-3/step-3.model';

declare const _: any;

export interface InventoryEntity {
  [hash: string]: InventoryEntityContents;
}

export type FlowPopoverSelectedTab = 'Sending' | 'Receiving';

export interface InventoryEntityContents {
  displayId: string;
  version: number;
  type: string;
  name: string;
  location: string;
  comment?: string;
  description?: string;
  role?: string; // controller, processor, joint-controller - Values: (C, P, JC)
  legalEntityType?: string; // Vendor, Partner, etc?
}

interface RenderedNode {
  [hash: string]: boolean;
}

@AutoUnsubscribe(['_flowchartDataSubscription$'])
@Component({
  selector: 'ta-flowchart-container',
  templateUrl: './flowchart-container.component.html',
  styleUrls: ['./flowchart-container.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FlowchartContainerComponent
  implements OnInit, OnDestroy, AfterViewInit {
  public highcharts: any = Highcharts;

  @ViewChild(TaPopover) popover: TaPopover;

  private popIsOpen = false;
  private selectedPopover;
  public popoverTitleFromContent = '';
  public popoverTitleFromLocation = '';
  public popoverTitleToContent = '';
  public popoverTitleToLocation = '';
  public popoverTitleLineDirection: 'left' | 'right' = 'right';
  public popoverSelectedTab: FlowPopoverSelectedTab = 'Sending';
  public popoverBodyContentDataElements = [];
  public popoverSaleOfData = false;
  public isLinePopover = false;
  public viewPopoverReceiving = false;
  public popoverSendingElements = [];
  public popoverReceivingElements = [];
  public popoverSelectedLocations: LocationInterface[] = [];
  public popoverSelectedRegions: GlobalRegionInterface[] = [];
  public currentPopoverEntity;
  public reversePopoverBodyContent;
  public tooltipPlacement = ['left', 'right'];
  public isPopoverContentSwapped = false;
  public Entities = Object.keys(Entity).map(key => ({
    type: key,
    value: Entity[key]
  }));
  public locationData: LocationInterface[];
  public fullCountryList: GlobalRegionInterface[];
  public dataElements: DataElementsInterface[];

  public isMouseInPopoverTitle = false;
  public isMouseInPopoverBody = false;
  public isPanEnabled = false;
  public panIconColor = '#666666';
  public panIconDisableColor = '#aaaaaa';

  public toggleSwitchModelValue;

  /** toggleSwitchInitState is used to prevent toggling of the sale-of-data,. Initially set to toggleSwitchModelValue
   * when the toggleSwitchModelValue is set. Based off of an entity's sending attribute. */
  private toggleSwitchInitState;

  public reverseSaleOfDataToggleValue;

  private hoverInfo: {
    fromId: string;
    toId: string;
  };

  private dataFlow = [];
  private connectedDataNodes = [];
  private noConnectionDataNodes = {
    DATA_SUBJECT: {
      data: []
    },
    IT_SYSTEM_3RD_PARTY: {
      data: []
    },
    IT_SYSTEM_1ST_PARTY: {
      data: []
    },
    DATA_RECIPIENT: {
      data: []
    }
  };
  private chart;
  private renderer;
  private svgGroup;
  private flowchartSvg;
  private flowChartData;
  private pannedInstance: any;
  private pannedInstanceZoom = 1;

  private lineColor = '#666';
  private nodeWidth = 96;
  private nodeHeight = 64;
  private nodeStrokeWidth = 32;

  // used to keep track of where nodes are in the dataflow grid for quick lookups.
  private nodeLocations: { [hash: string]: { col: number; row: number } } = {};
  private colFirstNodeGrid = [[]];
  private rowFirstNodeGrid = [[]];
  private nodesToBeRendered: Array<{
    col: number;
    row: number;
    entity: any;
    entityObjectId: string;
  }>;

  private _flowchartDataSubscription$: Subscription;
  private _panZoom$: Subscription;
  private _init$: Subscription;

  private renderedObjects: { nodes: RenderedNode };
  private isFetching = false;

  private isFirstItSystemDefined: boolean;

  constructor(
    private flowChartService: FlowChartService,
    private createBusinessProcess: CreateBusinessProcessesService,
    private flowchartUtilityService: FlowchartUtilityService,
    private eRef: ElementRef,
    private locationService: LocationService
  ) {}

  ngOnDestroy() {
    this._init$.unsubscribe();
  }

  ngOnInit() {
    this.initChart();
    this.isFetching = true;
    this.locationService.getFullCountryList().subscribe(locationsRaw => {
      const _locationData = [];
      locationsRaw.forEach(region => {
        region.countries.forEach(country => {
          _locationData.push(country);
        });
      });
      this.locationData = _locationData;
    });
    this._init$ = forkJoin([
      this.locationService.getFullCountryList(),
      this.createBusinessProcess.getDataElements()
    ]).subscribe(([fullCountryList, dataElements]) => {
      this.isFetching = false;

      this.fullCountryList = fullCountryList;
      this.dataElements = dataElements;
    });
  }

  public ngAfterViewInit() {
    if (this._flowchartDataSubscription$) {
      this._flowchartDataSubscription$.unsubscribe();
    }
    setTimeout(() => {
      this._flowchartDataSubscription$ = this.flowChartService._flowChartDataObservable$.subscribe(
        data => {
          // check if there is an open popover and close it
          this.closePopover();
          this.chart.destroy();
          this.initChart();
          this.resetChart();
          this.flowchartUtilityService.resetDefaultState();

          if (data) {
            data.forEach(chartData => {
              if (
                chartData.dataTransfers.sending.length > 0 ||
                chartData.dataTransfers.receiving.length > 0
              ) {
                this.connectedDataNodes.push(chartData);
              } else {
                this.noConnectionDataNodes[chartData.type].data.push(chartData);
              }
            });

            this.flowChartData = this.connectedDataNodes;

            this.renderDataFlow(this.connectedDataNodes, () => {
              setTimeout(() => {
                this.centerZoomChart();
                this.flowchartSvg[0].style.opacity = '1';
              }, 500);
            });
          }
        },
        err => throwError(err)
      );
    });
  }

  private initChart() {
    this.renderedObjects = { nodes: {} };
    this.highcharts = Highcharts;
    this.chart = this.highcharts.chart('flowChart', {
      credits: {
        enabled: false
      },
      title: {
        text: null
      },
      subtitle: {
        text: null
      },
      yAxis: {
        title: {
          enabled: false
        }
      },
      xAxis: {
        title: {
          endabled: false
        },
        showEmpty: false,
        visible: false
      },
      legend: {
        enabled: true,
        squareSymbol: true,
        symbolPadding: 2,
        itemDistance: 2,
        symbolHeight: 7,
        backgroundColor: '#FFF',
        verticalAlign: 'bottom'
      }
    });
    this.flowchartUtilityService.chartState.linePadding = 0.00001;
    this.nodesToBeRendered = [];
    this.renderer = this.chart.renderer;
    this.svgGroup = this.renderer.g('svg-pan-zoom_viewport').add();
    this.flowchartSvg = document.getElementsByClassName('highcharts-root');
    this.addPanZoom();
  }

  private resetChart() {
    this.pannedInstanceZoom = 1;
    this.lineColor = '#666';
    this.nodeWidth = 96;
    this.nodeHeight = 64;
    this.nodeStrokeWidth = 32;

    this.dataFlow = [];

    this.popIsOpen = false;
    this.popoverTitleFromContent = '';
    this.popoverTitleFromLocation = '';
    this.popoverTitleToLocation = '';
    this.popoverTitleToContent = '';
    this.popoverSelectedTab = 'Sending';
    this.popoverBodyContentDataElements = [];
    this.isLinePopover = false;
    this.viewPopoverReceiving = false;
    this.popoverSendingElements = [];
    this.popoverReceivingElements = [];
    this.tooltipPlacement = ['left', 'right'];
    this.isPopoverContentSwapped = false;
    this.isMouseInPopoverTitle = false;
    this.isMouseInPopoverBody = false;
    this.nodeLocations = {};
    this.colFirstNodeGrid = [[]];
    this.rowFirstNodeGrid = [[]];
    this.connectedDataNodes = [];
    this.noConnectionDataNodes = {
      DATA_SUBJECT: {
        data: []
      },
      IT_SYSTEM_3RD_PARTY: {
        data: []
      },
      IT_SYSTEM_1ST_PARTY: {
        data: []
      },
      DATA_RECIPIENT: {
        data: []
      }
    };
  }

  public mouseEnteredPopoverBody() {
    this.isMouseInPopoverBody = true;
  }

  public mouseEnteredPopoverTitle() {
    this.isMouseInPopoverTitle = true;
  }

  public mouseLeftPopoverBody() {
    this.isMouseInPopoverBody = false;
    setTimeout(() => {
      if (!this.isMouseInPopoverTitle) {
        this.closePopover();
      }
    }, 200);
  }

  public mouseLeftPopoverTitle() {
    this.isMouseInPopoverTitle = false;
    setTimeout(() => {
      if (!this.isMouseInPopoverBody) {
        this.closePopover();
      }
    }, 200);
  }

  private addPanZoom() {
    if (this._panZoom$) {
      this._panZoom$.unsubscribe();
    }
    this.flowchartSvg[0].style.opacity = '0';
    this._panZoom$ = timer(1).subscribe(() => {
      this.pannedInstance = svgPanZoom(this.flowchartSvg[0], {
        viewportSelector: '.highcharts-svg-pan-zoom_viewport',
        zoomEnabled: true,
        fit: true,
        center: true,
        minZoom: 0.1,
        dblClickZoomEnabled: false
      });
      const panzoomSelector: SVGGraphicsElement = <SVGGraphicsElement>(
        document.querySelector('#flowChart .svg-pan-zoom_viewport')
      );
      const heightRatio =
        (this.pannedInstance.getSizes().height - 20) /
        panzoomSelector.getBoundingClientRect().height;
      const widthRatio =
        (this.pannedInstance.getSizes().width - 20) /
        panzoomSelector.getBoundingClientRect().width;
      if (heightRatio < 1 || widthRatio < 1) {
        this.pannedInstanceZoom = Math.min(heightRatio, widthRatio);
      }
      this.pannedInstance.zoom(this.pannedInstanceZoom);
      this.pannedInstance.disablePan();
    });
  }

  private renderNodeOutline(
    col: number,
    row: number,
    color: string,
    entityId: string
  ): void {
    this.renderer
      .rect(
        // x, y, width, height, strokeWidth
        this.flowchartUtilityService.calculateNodeLeftSideXCoordinate(col),
        this.flowchartUtilityService.calculateYNodeCoordinate(row),
        this.nodeWidth,
        this.nodeHeight,
        this.nodeStrokeWidth
      )
      .attr({
        'stroke-width': 3,
        stroke: color,
        fill: '#ffffff',
        val: entityId,
        id: entityId.split(' ').join('_'),
        class: entityId.split(' ').join('_')
      })
      .on('click', $event => {
        const entity = this.flowChartData.find(
          _entity => _entity.id === entityId
        );
        this.tooltipPlacement = ['top', 'bottom'];
        this.togglePopover($event, entity, false, null, null);
      })
      .on('mouseenter', $event => {
        this.chart.setClassName('dimmed');
        $event.target.classList.add('chartHover');
        const currentNodeId = $event.target.getAttribute('id');
        this.addChartHover(currentNodeId);
        const relativePaths = document.getElementsByClassName(currentNodeId);
        for (let i = 0; i < relativePaths.length; i++) {
          const pathNodeIdList = relativePaths[i].classList;
          pathNodeIdList.forEach(pathNodeId => {
            if (
              pathNodeId !== '' &&
              pathNodeId !== 'chartHover' &&
              pathNodeId !== currentNodeId
            ) {
              this.addChartHover(pathNodeId);
              if (document.getElementById(pathNodeId)) {
                document.getElementById(pathNodeId).classList.add('chartHover');
              }
            }
          });
          relativePaths[i].classList.add('chartHover');
        }
      })
      .on('mouseleave', $event => {
        this.removeChartHover();
      })
      .add(this.svgGroup);
  }

  public closePopover() {
    if (this.popIsOpen) {
      this.popIsOpen = false;
      this.popover.toggle();
    }
  }

  /**
   * Toggles a popover. The popover can be a line-popover or a node popover.
   * This is the first method that is called when showing popovers.
   * @param $event - The event triggering the popover, which is determined by an svg element where the event was triggered.
   * @param fromEntity - The from-entity that is represented by the svg element that triggered the event. If the svg element is a node,
   * the from element is the node. If the svg element that triggered the event is a line, it is the node where the line is coming from.
   * @param toEntity - For a line, Similar to the fromEntity, but where the line is going-to. For a node this should be set to falsy.
   * @param fromId - Used for lines (null for nodes). The id of the 'fromEntity'
   * @param toId - Used for lines (null for nodes). The id of the 'toEntity'
   */
  private togglePopover($event, fromEntity, toEntity, fromId, toId) {
    this.viewPopoverReceiving = false;
    this.popoverSelectedTab = 'Sending';
    if (this.popIsOpen) {
      this.popover.toggle();
      this.popIsOpen = false;
    }
    if (!this.popIsOpen || fromEntity !== this.selectedPopover) {
      this.popIsOpen = true;

      if (fromEntity !== this.selectedPopover) {
        this.popover.close();
        this.selectedPopover = fromEntity;
      }

      const path =
        $event.path || ($event.composedPath && $event.composedPath());
      this.popover['_elementRef'] = new ElementRef(path[0]);

      this.hoverInfo = null;

      if (toEntity) {
        this.hoverInfo = { fromId: fromId, toId: toId };
        this.setLinePopoverContent(fromEntity, toEntity, fromId, toId);
      } else {
        this.setNodePopoverContent(fromEntity);
      }

      this.popover.toggle();
    }
  }

  /**
   * Sets line popover content
   * When rendering a line-popover, this method is called from the 'togglePopover' method.
   * It is assumed that we have a from-id/entity and to-id/entity since by definition a line typically connects two points.
   * @param fromEntity The etity where data is flowing from.
   * @param toEntity The entity where data is flowing to.
   * @param fromId - The id of the fromEntity (not included in the fromEntity)
   * @param toId - The id of the toEntity (not included in the toEntity)
   */
  private setLinePopoverContent(fromEntity, toEntity, fromId, toId) {
    this.popoverTitleFromContent = fromEntity.name;
    this.popoverTitleFromLocation = fromEntity.location;
    this.popoverTitleToContent = toEntity.name;
    this.popoverTitleToLocation = toEntity.location;
    this.isLinePopover = true;
    this.popoverBodyContentDataElements = [];
    this.reversePopoverBodyContent = null;
    this.isPopoverContentSwapped = false;
    this.hoverInfo = { fromId: fromId, toId: toId };
    this.setSaleOfDataValues();

    const fromEntityDataTransfers = fromEntity.dataTransfers.sending.filter(
      transfer => transfer.id === toId
    );
    this.popoverBodyContentDataElements = fromEntityDataTransfers
      .map(transfer => transfer.dataElementIds)
      .flat()
      .map(dataElementId =>
        this.flowChartService.getDataElementNameFromId(dataElementId)
      );

    const fromRow = this.nodeLocations[fromId].row;
    const toRow = this.nodeLocations[toId].row;
    const fromCol = this.nodeLocations[fromId].col;
    const toCol = this.nodeLocations[toId].col;

    if (fromRow === toRow && Math.abs(fromCol - toCol) <= 1) {
      const entityReceives =
        fromEntity.dataTransfers.receiving &&
        fromEntity.dataTransfers.receiving.length > 0;
      const otherEntitySends =
        toEntity.dataTransfers.sending &&
        fromEntity.dataTransfers.sending.length > 0;

      if (entityReceives && otherEntitySends) {
        let contentSet = false;
        toEntity.dataTransfers.sending.map(sending => {
          if (sending.id === fromId) {
            contentSet = true;
            this.reversePopoverBodyContent = sending.dataElements;
          }
        });
        if (!contentSet) {
          this.reversePopoverBodyContent = null;
        }
      }
    }
  }

  /**
   * Prevents toggle switch, and is used in the template.
   */
  public preventToggleSwitch($event) {
    $event.preventDefault();
    $event.stopPropagation();
    this.toggleSwitchModelValue = this.toggleSwitchInitState;
  }

  /**
   * Swaps popover path.
   * This is used in the case of a bi-directional line, so that we can view each direction of the line in a popover.
   * This means swapping all content within the popover so that we can view the content of each line.
   */
  public swapPopoverPath() {
    this.isPopoverContentSwapped = !this.isPopoverContentSwapped;

    this.hoverInfo = {
      fromId: this.hoverInfo.toId,
      toId: this.hoverInfo.fromId
    };

    [this.toggleSwitchModelValue, this.reverseSaleOfDataToggleValue] = [
      this.reverseSaleOfDataToggleValue,
      this.toggleSwitchModelValue
    ];

    this.toggleSwitchInitState = this.toggleSwitchModelValue;

    [this.popoverBodyContentDataElements, this.reversePopoverBodyContent] = [
      this.reversePopoverBodyContent,
      this.popoverBodyContentDataElements
    ];

    [this.popoverTitleFromContent, this.popoverTitleToContent] = [
      this.popoverTitleToContent,
      this.popoverTitleFromContent
    ];

    [this.popoverTitleFromLocation, this.popoverTitleToLocation] = [
      this.popoverTitleToLocation,
      this.popoverTitleFromLocation
    ];
  }

  private setSaleOfDataValues() {
    this.reverseSaleOfDataToggleValue = null;
    const fromEntity = this.flowChartData.find(
      entity => entity.id === this.hoverInfo.fromId
    );

    fromEntity.dataTransfers.sending.forEach(fromElement => {
      if (fromElement.id === this.hoverInfo.toId) {
        this.toggleSwitchModelValue = this.toggleSwitchInitState =
          fromElement.saleOfData;
      }
    });

    if (this.hoverInfo.toId) {
      const toEntity = this.flowChartData.find(
        entity => entity.id === this.hoverInfo.toId
      );
      toEntity.dataTransfers.sending.forEach(toElement => {
        if (toElement.id === this.hoverInfo.fromId) {
          this.reverseSaleOfDataToggleValue = toElement.saleOfData;
        }
      });
    }
  }

  private setNodePopoverContent(entity) {
    const run = () => {
      this.isLinePopover = true;
      this.popoverSelectedLocations = [];
      this.popoverTitleFromContent = entity.name;
      this.popoverTitleFromLocation = entity.location;
      this.currentPopoverEntity = entity;
      this.reversePopoverBodyContent = null;

      this.reverseSaleOfDataToggleValue = null;
      this.popoverBodyContentDataElements =
        this.popoverBodyContentDataElements || [];
      if (entity.locationIds.length) {
        entity.locationIds.forEach(id => {
          this.locationData.forEach(location => {
            if (location.id === id) {
              this.popoverSelectedLocations.push(location);
            }
          });
        });

        this.fullCountryList.forEach(region => {
          region.countriesSelected = 0;
          region.selected = false;
          region.countries.forEach(country => (country.selected = false));
        });

        this.fullCountryList.forEach(region => {
          this.popoverSelectedLocations.forEach(location => {
            region.countries.forEach(country => {
              if (country.threeLetterCode === location.threeLetterCode) {
                region.countriesSelected++;
                region.selected = true;
                country.selected = true;
              }
            });
          });
        });
      }

      if (entity.dataTransfers) {
        this.updatePopoverTitleIfMultipleToEntities(entity);
        const getDataTransfers = (type: FlowPopoverSelectedTab) => {
          return entity.dataTransfers[type.toLocaleLowerCase()]
            .map(transfer => {
              this.popoverSaleOfData = transfer.saleOfData;
              return transfer.dataElementIds;
            })
            .flat()
            .map(dataElementId => {
              return this.flowChartService.getDataElementNameFromId(
                dataElementId
              );
            });
        };

        this.popoverBodyContentDataElements = [
          ...getDataTransfers('Sending'),
          ...getDataTransfers('Receiving')
        ];

        // show only unique data elements
        this.popoverBodyContentDataElements = _.uniq(
          this.popoverBodyContentDataElements
        );
      }
    };
    this.isFetching
      ? _.debounce(this.setNodePopoverContent.bind(this, entity), 3)
      : run();
  }

  /**
   * Updates popover title if multiple to entities
   * In the case that the entity is not sending to any other entities the title will contain the entity it is receiving data from.
   * @param entity the entity where data is flowing from.
   */
  private updatePopoverTitleIfMultipleToEntities(entity) {
    // [i18n-tobeinternationalized]
    const multipleEntitites = 'Multiple Entities';

    if (
      // handle no sending and receiving case.
      !entity.dataTransfers ||
      (entity.dataTransfers.sending &&
        entity.dataTransfers.receiving &&
        entity.dataTransfers.sending.length === 0 &&
        entity.dataTransfers.receiving.length === 0)
    ) {
      this.popoverTitleFromContent = '';
      this.popoverTitleFromLocation = '';
      this.popoverTitleToContent = '';
      this.popoverTitleToLocation = '';
      this.popoverTitleLineDirection = 'right';
    } else {
      const sending = entity.dataTransfers.sending;
      const receiving = entity.dataTransfers.receiving;

      const sendingAndReceivingToOneOrLess =
        sending.length <= 1 && receiving.length <= 1;

      const sendingToReceiverAndReceivingFromReceiver =
        sending.length === 1 &&
        receiving.length === 1 &&
        sending[0].id === receiving[0].id;

      const receivingButNotSending =
        receiving.length > 0 && sending.length === 0;

      const sendingButNotReceiving =
        sending.length > 0 && receiving.length === 0;

      const sendingToOneOrLess = sending.length === 1;

      this.popoverTitleLineDirection = 'right';
      this.isLinePopover = true;

      if (sendingAndReceivingToOneOrLess) {
        if (sendingToReceiverAndReceivingFromReceiver) {
          const sendingEntity = this.flowChartData.find(
            _entity => _entity.id === sending[0].id
          );
          this.popoverTitleToContent = sendingEntity.name;
          this.popoverTitleToLocation = sendingEntity.location;
          this.isLinePopover = false;
        } else if (receivingButNotSending) {
          const recieveingEntity = this.flowChartData.find(
            _entity => _entity.id === receiving[0].id
          );
          this.popoverTitleToContent = recieveingEntity.name;
          this.popoverTitleToLocation = recieveingEntity.location;
          this.popoverTitleLineDirection = 'left';
        } else if (sendingButNotReceiving) {
          const sendingEntity = this.flowChartData.find(
            _entity => _entity.id === sending[0].id
          );
          this.popoverTitleToContent = sendingEntity.name;
          this.popoverTitleToLocation = sendingEntity.location;
        } else if (sendingToOneOrLess) {
          const sendingEntity = this.flowChartData.find(
            _entity => _entity.id === sending[0].id
          );
          this.popoverTitleToContent = sendingEntity.name;
          this.popoverTitleToLocation = sendingEntity.location;
        } else {
          this.popoverTitleToContent = multipleEntitites;
        }
      } else if (!sendingAndReceivingToOneOrLess && receivingButNotSending) {
        this.popoverTitleLineDirection = 'left';
        this.popoverTitleToContent = multipleEntitites;
      } else {
        this.popoverTitleToContent = multipleEntitites;
      }
    }
  }

  private renderNodeText(
    col: number,
    row: number,
    type: string,
    locations: string[],
    topLine?: string,
    middleLine?: string,
    bottomLine?: string,
    nodeId?: string
  ): void {
    const x =
      this.flowchartUtilityService.calculateNodeLeftSideXCoordinate(col) +
      this.nodeWidth / 2;
    let y =
      this.flowchartUtilityService.calculateYNodeCoordinate(row) +
      this.nodeHeight / 4 +
      5;

    const totalLines =
      (topLine && topLine.length > 0 ? 1 : 0) +
      (middleLine && middleLine.length > 0 ? 1 : 0) +
      (bottomLine && bottomLine.length > 0 ? 1 : 0) +
      (type === 'DATA_SUBJECT' || type === 'DATA_RECIPIENT' ? 1 : 0);
    y = y + 6 * (3 - totalLines);

    let nodeTextAvailableWidth = 22;
    if (topLine) {
      this.renderTextLineToNode(topLine, x, y, nodeId, nodeTextAvailableWidth);
      y = y + 13;
    }
    if (middleLine) {
      if (topLine && totalLines === 3) {
        nodeTextAvailableWidth = 12;
      }
      this.renderTextLineToNode(
        middleLine,
        x,
        y,
        nodeId,
        nodeTextAvailableWidth
      );
      y = y + 13;
    }
    if (type === 'DATA_SUBJECT' || type === 'DATA_RECIPIENT') {
      this.renderTextLineToNode(
        'Locations: ' + locations.length,
        x,
        y,
        nodeId,
        nodeTextAvailableWidth
      );
    }
    if (bottomLine) {
      nodeTextAvailableWidth = 22;
      this.renderTextLineToNode(
        bottomLine,
        x,
        y,
        nodeId,
        nodeTextAvailableWidth
      );
    }
  }

  private renderTextLineToNode(text, x, y, nodeId, nodeTextAvailableWidth) {
    setTimeout(() => {
      const nodeText = this.renderer
        .text(text, x, y)
        .attr({
          class: 'text_' + nodeId.split(' ').join('_')
        })
        .css({
          color: '#333',
          fontSize: '9px',
          fontFamily: 'Arial',
          'pointer-events': 'none',
          textOverflow: 'ellipsis',
          position: 'static',
          'text-anchor': 'middle',
          width: this.nodeWidth - nodeTextAvailableWidth + 'px'
        })
        .add(this.svgGroup);
    });
  }

  private renderNodeLegalEntityTypes(
    colLevel,
    rowLevel,
    legalEntityType,
    nodeId
  ) {
    const [
      x,
      y
    ] = this.flowchartUtilityService.calculateLegalEntityLabelLocation(
      colLevel,
      rowLevel
    );
    this.renderer
      .label(legalEntityType, x, y)
      .attr({
        r: 3,
        padding: 3,
        width: 42,
        fill: '#EF7603',
        class: 'nodeEntity entity_' + nodeId.split(' ').join('_')
      })
      .css({
        color: 'white',
        fontSize: '9px',
        textOverflow: 'ellipsis'
      })
      .add(this.svgGroup);
  }

  private drawFlowPath(pathInfo) {
    const path = this.flowchartUtilityService.createFlowPath(
      pathInfo.x1,
      pathInfo.y1,
      pathInfo.x2,
      pathInfo.y2,
      pathInfo.from,
      pathInfo.to
    );
    this.renderPath(path, pathInfo.from, pathInfo.to, ['left', 'right']);
  }

  private drawStraightFlowPath(pathInfo) {
    const path = this.flowchartUtilityService.createStraightFlowPath(
      pathInfo.x1,
      pathInfo.y1,
      pathInfo.x2,
      pathInfo.y2,
      pathInfo.from,
      pathInfo.to,
      pathInfo.type
    );
    this.renderPath(path, pathInfo.from, pathInfo.to, ['left', 'right']);
  }

  private drawStraightPath(pathInfo) {
    const path = this.flowchartUtilityService.createStraightPath(
      pathInfo.x1,
      pathInfo.y1,
      pathInfo.x2,
      pathInfo.y2
    );
    this.renderPath(path, pathInfo.from, pathInfo.to, ['top', 'bottom']);
  }

  private renderPath(path, from, to, tooltipPlacement) {
    const entity = this.flowChartData.find(_entity => _entity.id === from.id);
    const toEntity = this.flowChartData.find(_entity => _entity.id === to.id);
    const fromClass = from.id.split(' ').join('_');
    const toClass = to.id.split(' ').join('_');
    const strokeClass = fromClass + ' ' + toClass;
    this.renderer
      .path(path)
      .attr({
        'stroke-width': 0.75,
        stroke: this.lineColor,
        class: strokeClass
      })
      .on('click', $event => {
        this.tooltipPlacement = tooltipPlacement;
        this.togglePopover($event, entity, toEntity, from.id, to.id);
      })
      .on('mouseenter', $event => {
        this.chart.setClassName('dimmed');
        const relativeNodeIdList = $event.target.classList;
        $event.target.classList.add('chartHover');
        const currentNodeId = $event.target.getAttribute('id');
        for (let i = 0; i < relativeNodeIdList.length; i++) {
          if (
            relativeNodeIdList[i] !== '' &&
            relativeNodeIdList[i] !== 'chartHover'
          ) {
            this.addChartHover(relativeNodeIdList[i]);
            document
              .getElementById(relativeNodeIdList[i])
              .classList.add('chartHover');
          }
        }
      })
      .on('mouseleave', $event => {
        this.removeChartHover();
      })
      .add(this.svgGroup);
  }
  private drawLeftArrowHead(arrow) {
    this.renderer
      .path(
        this.flowchartUtilityService.createLeftArrowheadPath(arrow.x, arrow.y)
      )
      .attr({
        'stroke-width': 0.001,
        fill: this.lineColor,
        stroke: this.lineColor,
        class: arrow.arrowClass + ' leftArrow'
      })
      .add(this.svgGroup);
  }

  private drawRightArrowHead(arrow) {
    this.renderer
      .path(
        this.flowchartUtilityService.createRightArrowheadPath(arrow.x, arrow.y)
      )
      .attr({
        'stroke-width': 0.001,
        fill: this.lineColor,
        stroke: this.lineColor,
        class: arrow.arrowClass + ' rightArrow'
      })
      .add(this.svgGroup);
  }

  private entityIsAlreadyRedered(entityId): boolean {
    return (
      !entityId ||
      !this.renderedObjects ||
      !this.renderedObjects.nodes ||
      (Object.entries(this.renderedObjects.nodes).length > 0 &&
        this.renderedObjects.nodes[entityId])
    );
  }

  private getEntityType(entityObject): string {
    const type = entityObject.type.split('_')[1];
    if (['SUBJECT', 'SYSTEM', 'RECIPIENT'].includes(type)) {
      return type;
    } else {
      return 'SYSTEM';
    }
  }

  private getRowForColumn(column, entities) {
    const allRows = entities
      .filter(entity => entity.renderCol === column)
      .map(entity => entity.renderRow)
      .filter(row => _.isInteger(row));
    return allRows.length ? Math.max(...allRows) + 1 : 0;
  }

  private setColumnAndRow(entity, initialColumn, entities, diff = 0) {
    if (!_.isInteger(entity.renderCol)) {
      const renderCol = initialColumn + diff;
      entity.renderCol = renderCol;
      entity.renderRow = entity.renderRow
        ? entity.renderRow
        : this.getRowForColumn(renderCol, entities);
    }
  }

  private isFirstItSystem(entityObject, type, entities): boolean {
    if (type === 'SYSTEM') {
      return !entityObject.dataTransfers.receiving.some(receivingObj => {
        const recrivingEntity = entities.find(
          entity => entity.id === receivingObj.id
        );
        const recrivingEntityType = this.getEntityType(recrivingEntity);
        return recrivingEntityType === 'SYSTEM';
      });
    }
    return false;
  }

  private findEntity(entities, entytyObj) {
    const foundEtity = entities.find(
      entity =>
        entity.id.includes(entytyObj.id) &&
        (!entity.edgeId ||
          entity.edgeId === entytyObj.edgeId ||
          this.getEntityType(entity) === 'SYSTEM')
    );
    foundEtity.edgeId = foundEtity.edgeId
      ? foundEtity.edgeId
      : entytyObj.edgeId;
    return foundEtity;
  }

  private setColumnAndRowRecoursively(entityObject, entities) {
    const type = this.getEntityType(entityObject);
    if (type !== 'SYSTEM' || entityObject.done) {
      return;
    }
    if (
      !this.isFirstItSystemDefined ||
      this.isFirstItSystem(entityObject, type, entities)
    ) {
      this.isFirstItSystemDefined = true;
      this.setColumnAndRow(
        entityObject,
        _.isInteger(entityObject.renderCol) ? entityObject.renderCol : 1,
        entities
      );
    }
    entityObject.done = _.isInteger(entityObject.renderCol);
    entityObject.dataTransfers.receiving.forEach(receivingObj => {
      const receivingEntity = this.findEntity(entities, receivingObj);
      this.setColumnAndRow(
        receivingEntity,
        entityObject.renderCol,
        entities,
        -1
      );
      this.setColumnAndRowRecoursively(receivingEntity, entities);
    });

    entityObject.dataTransfers.sending.forEach(sendingObj => {
      const sendingEntity = this.findEntity(entities, sendingObj);

      this.setColumnAndRow(sendingEntity, entityObject.renderCol, entities, 1);
      this.setColumnAndRowRecoursively(sendingEntity, entities);
    });
  }

  private createRecursiveNodeRelationships(entities): void {
    if (entities.length === 0) {
      return;
    }

    entities.forEach(entityObject => {
      const entityObjectId = entityObject.id;
      if (this.entityIsAlreadyRedered(entityObjectId)) {
        return;
      }
      this.renderedObjects.nodes[entityObjectId] = true;
      this.setColumnAndRowRecoursively(entityObject, entities);
    });

    this.isFirstItSystemDefined = false;

    // to avoid negative numbers for columns
    this.resetColumnsToStartWithZero(entities);

    // If We decide to use DS on the left, DR on the right approach
    // const placing = {
    //   SUBJECT: { column: -1, row: 0 },
    //   SYSTEM: { column: 1, row: 0 },
    //   RECIPIENT: { column: 4, row: 0 }
    // };
    // entities.forEach(entityObject => {
    //   const type = this.getEntityType(entityObject);
    //   if (type === 'SYSTEM') {
    //     return;
    //   }
    //   entityObject.renderCol = placing[type].column;
    //   entityObject.renderRow = placing[type].row++;
    // });

    entities.forEach(entityObject => {
      this.nodesToBeRendered.push({
        col: entityObject.renderCol,
        row: entityObject.renderRow,
        entity: entityObject,
        entityObjectId: entityObject.id
      });
      // add entity, row, and column information to our global information.
      // for use in calculating arrow coordinates.
      this.addNodeToGridAndLocations(
        entityObject.renderCol,
        entityObject.renderRow,
        entityObject.id
      );
    });
  }

  private resetColumnsToStartWithZero(enteties) {
    const columnNumbers = enteties.map(entity => entity.renderCol);
    const diff = Math.min(...columnNumbers);
    if (diff < 0) {
      enteties.forEach(entity => {
        entity.renderCol = entity.renderCol - diff;
      });
    }
  }

  private createFlowRelationships(entities) {
    if (entities) {
      entities.map(entityObject => {
        const fromEntityId = entityObject.id;
        const entity = entityObject;

        if (this.hasSendingData(entity)) {
          entity['dataTransfers']['sending'].map(toEntity => {
            if (toEntity.id) {
              const toEntityId = toEntity.id;
              if (toEntityId !== fromEntityId) {
                this.addFlowRelationship(
                  this.nodeLocations[fromEntityId].col,
                  this.nodeLocations[fromEntityId].row,
                  this.nodeLocations[toEntityId].col,
                  this.nodeLocations[toEntityId].row,
                  this.nodeLocations[toEntityId].col <=
                    this.nodeLocations[fromEntityId].col,
                  fromEntityId,
                  toEntityId
                );
              }
            }
          });
        }
      });
    }
  }

  private hasSendingData(entity) {
    return (
      entity &&
      entity['dataTransfers'] &&
      entity['dataTransfers']['sending'] &&
      entity['dataTransfers']['sending'].length > 0
    );
  }

  private getNextRowCoordinateForNodeRendering(nextColumn: number): number {
    if (Array.isArray(this.colFirstNodeGrid[nextColumn])) {
      return this.colFirstNodeGrid[nextColumn].length;
    } else {
      return 0;
    }
  }

  private addNodeToGridAndLocations(col, row, entityId) {
    if (!this.nodeLocations[entityId]) {
      this.nodeLocations[entityId] = { col: col, row: row };
    }
    this.setGridCoordinate(col, row, entityId, this.colFirstNodeGrid);
    this.setGridCoordinate(row, col, entityId, this.rowFirstNodeGrid);
  }

  private setGridCoordinate(x, y, entityId, coordinateSystem) {
    if (!coordinateSystem[x]) {
      coordinateSystem[x] = [];
      coordinateSystem[x][y] = entityId;
    } else if (!coordinateSystem[x][y]) {
      coordinateSystem[x][y] = entityId;
    }
  }

  private addFlowRelationship(
    fromCol,
    fromRow,
    toCol,
    toRow,
    isUpstream,
    fromId,
    toId
  ) {
    this.dataFlow.push({
      from: { col: fromCol, row: fromRow, id: fromId },
      to: { col: toCol, row: toRow, id: toId },
      isUpstream: isUpstream
    });
  }

  private renderStaticNodeInformation(col, row, entity, nodeId) {
    if (entity['type'] === 'IT_SYSTEM_3RD_PARTY') {
      this.renderNodeLegalEntityTypes(col, row, entity['category'], nodeId);
    }
    this.renderNodeText(
      col,
      row,
      entity.type,
      entity.locationIds,
      entity.name,
      entity.location,
      entity.role,
      nodeId
    );
  }

  private renderDataFlow(data, callback): void {
    if (data && data.length) {
      this.dataFlow = [];
      this.createRecursiveNodeRelationships(data);
      this.createFlowRelationships(data);

      this.setGridGapSize();

      this.dataFlow.map(flowRelationship => {
        // Draw path
        this.flowchartUtilityService.drawPath(
          flowRelationship,
          this.nodeLocations,
          path => {
            if (path.pathType === 'straightPath') {
              this.drawStraightPath(path);
            }
            if (path.pathType === 'flowPath') {
              this.drawFlowPath(path);
            }
            if (path.pathType === 'straightFlowPath') {
              this.drawStraightFlowPath(path);
            }
          }
        );

        // Draw arrow head
        this.flowchartUtilityService.drawArrowHeadDirection(
          flowRelationship,
          this.nodeWidth,
          arrow => {
            if (arrow.direction === 'left') {
              this.drawLeftArrowHead(arrow);
            } else {
              this.drawRightArrowHead(arrow);
            }
          }
        );
      });

      this.nodesToBeRendered.map(node =>
        this.renderNodeOutline(
          node.col,
          node.row,
          Entity[node.entity['type']].color,
          node.entityObjectId
        )
      );

      this.nodesToBeRendered.map(node =>
        this.renderStaticNodeInformation(
          node.col,
          node.row,
          node.entity,
          node.entityObjectId
        )
      );
      callback();
    }
  }

  private setGridGapSize() {
    const numRelationships = this.dataFlow.length;
    const paddingIncrement = this.flowchartUtilityService.chartState
      .linePaddingIncrement;
  }

  /**
   * Remove chartHover class
   */

  private removeChartHover() {
    this.chart.setClassName('');
    const chartHoverList = document.getElementsByClassName('chartHover');
    while (chartHoverList.length) {
      chartHoverList[0].classList.remove('chartHover');
    }
  }

  private addChartHover(nodeId) {
    const textList = document.getElementsByClassName('text_' + nodeId);
    for (let i = 0; i < textList.length; i++) {
      textList[i].classList.add('chartHover');
    }
    const entityList = document.getElementsByClassName('entity_' + nodeId);
    for (let i = 0; i < entityList.length; i++) {
      entityList[i].classList.add('chartHover');
    }
  }

  /**
   * Panzoom functions
   */

  public zoomInChart() {
    this.pannedInstance.zoomIn();
  }

  public zoomOutChart() {
    this.pannedInstance.zoomOut();
  }

  public resetZoomChart() {
    this.flowchartSvg[0].style.opacity = '0';
    this.pannedInstance.zoom(this.pannedInstanceZoom);
    setTimeout(() => {
      this.centerZoomChart();
      this.flowchartSvg[0].style.opacity = '1';
    }, 200);
  }

  public centerZoomChart() {
    const panzoomSelector: SVGGraphicsElement = <SVGGraphicsElement>(
      document.querySelector('#flowChart .svg-pan-zoom_viewport')
    );
    if (panzoomSelector) {
      const panX =
        (this.pannedInstance.getSizes().width -
          panzoomSelector.getBoundingClientRect().width) /
        2;
      const panY =
        (this.pannedInstance.getSizes().height -
          panzoomSelector.getBoundingClientRect().height) /
        2;
      this.pannedInstance.pan({ x: panX, y: panY });
    }
  }

  public tooglePanChart() {
    this.isPanEnabled = !this.isPanEnabled;
    if (this.isPanEnabled) {
      this.pannedInstance.enablePan();
    } else {
      this.pannedInstance.disablePan();
    }
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    // Do hide popover when click outside flow charts and popover
    // Detect clicked outside flow charts
    if (!this.eRef.nativeElement.contains(event.target)) {
      // Detect clicked outside popover
      const popovers = Array.from(
        document.querySelectorAll('ta-popover-window')
      );
      const insidePopover = popovers.some(element =>
        element.contains(event.target)
      );
      // TODO RHEA-3109: Temporary  workaround solution, the Accordion click on "chevron svg icon" is not being detected inside Popover
      if (
        !insidePopover &&
        event.target.nodeName !== 'svg' &&
        event.target.nodeName !== 'path' &&
        event.target.nodeName !== 'TA-ICON'
      ) {
        this.closePopover();
      }
    }
  }
}
