import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef
} from '@angular/core';
import * as d3 from 'd3';
import { DataFlowChartModelObject } from './shared/models/chart.model';
import { CHART_CONFIG } from './shared/config/chart-config';

@Component({
  selector: 'ta-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChartComponent implements OnInit {
  @ViewChild('taChartContainer') private chartContainer: ElementRef;
  @Input() chartData: DataFlowChartModelObject;
  private container: HTMLElement;
  private zoom: any;
  private svg: any;
  private g: any;
  private isPanActive: boolean;

  constructor() {}

  public ngOnInit(): void {
    this.initializeContainer();
    this.defineZoomFunction();
  }

  public makeZoom(type: string): void {
    const scale = type === CHART_CONFIG.zoomType.in ? 2 : 0.5;
    this.zoom.scaleBy(this.svg.transition().duration(750), scale);
  }

  public reset(): void {
    this.g
      .transition()
      .duration(20)
      .call(this.zoom.transform, d3.zoomIdentity);
  }

  public makePan(): void {
    this.isPanActive = !this.isPanActive;
    const element = document.querySelector(CHART_CONFIG.chartContainerId);
    if (this.isPanActive) {
      element.classList.add(CHART_CONFIG.panClass);
      this.svg.call(this.zoom);
    } else {
      element.classList.remove(CHART_CONFIG.panClass);
      this.svg.call(d3.zoom().on('zoom', null));
    }
  }

  private initializeContainer(): void {
    this.container = this.chartContainer.nativeElement;
    this.svg = d3
      .select(this.container)
      .append('svg')
      .attr('viewbox', '0 0 100 100');
    this.g = this.svg.append('g').attr('transform', 'translate(0,0) scale(1)');

    // This is just mock element to test the zoon IN / zoon OUT / Pan / Fit
    // Will be removed as soon real shapes renderization takes place
    this.g
      .append('circle')
      .attr('cx', 50)
      .attr('cy', 50)
      .attr('r', 20)
      .style('fill', '#68b2a1');
  }

  private defineZoomFunction(): void {
    this.zoom = d3
      .zoom()
      .scaleExtent([1, 40])
      .on('zoom', (event: any) => {
        this.g.attr('transform', event.transform);
      });
  }
}
