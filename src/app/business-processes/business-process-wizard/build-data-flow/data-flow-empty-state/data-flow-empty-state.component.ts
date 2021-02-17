import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'ta-data-flow-empty-state',
  templateUrl: './data-flow-empty-state.component.html',
  styleUrls: ['./data-flow-empty-state.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DataFlowEmptyStateComponent implements OnInit {
  @Output() public navigate: EventEmitter<string> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  public navigateDataflow(url) {
    this.navigate.emit(url);
  }
}
