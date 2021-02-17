import {
  Component,
  OnInit,
  ViewEncapsulation,
  Output,
  EventEmitter,
  Input
} from '@angular/core';

@Component({
  selector: 'ta-data-flow-chart-controls',
  templateUrl: './data-flow-chart-controls.component.html',
  styleUrls: ['./data-flow-chart-controls.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DataFlowChartControlsComponent implements OnInit {
  @Input() showMultipleEntities = false;
  @Input() public hideControls: boolean;
  @Output() zoom = new EventEmitter<string>();
  @Output() fit = new EventEmitter<null>();
  @Output() pan = new EventEmitter<boolean>();
  @Output() full = new EventEmitter<boolean>();

  private isPanActive: boolean;
  constructor() {}

  public ngOnInit(): void {
    this.isPanActive = false;
  }

  public makeZoom(type: string): void {
    this.zoom.emit(type);
  }

  public reset(): void {
    this.fit.emit();
  }

  public fullscreen(): void {
    this.full.emit();
  }

  public makePan(): void {
    this.isPanActive = !this.isPanActive;
    this.pan.emit(this.isPanActive);
  }
}
