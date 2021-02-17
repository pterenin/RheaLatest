import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ta-data-flow-collapse-view',
  templateUrl: './data-flow-collapse-view.component.html',
  styleUrls: ['./data-flow-collapse-view.component.scss']
})
export class DataFlowCollapseComponent implements OnInit {
  @Input() isStandardView: boolean;
  @Output() toggleStandard = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}
