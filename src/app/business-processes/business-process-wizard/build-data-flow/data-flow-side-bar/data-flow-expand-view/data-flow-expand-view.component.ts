import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ta-data-flow-expand-view',
  templateUrl: './data-flow-expand-view.component.html',
  styleUrls: ['./data-flow-expand-view.component.scss']
})
export class DataFlowExpandViewComponent implements OnInit {
  @Input() public isExpandedView: boolean;
  @Output() toggleExpandedView = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}
