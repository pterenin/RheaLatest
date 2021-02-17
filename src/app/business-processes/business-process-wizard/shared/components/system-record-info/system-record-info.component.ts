import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ta-system-record-info-component',
  templateUrl: './system-record-info.component.html',
  styleUrls: ['./system-record-info.component.scss']
})
export class SystemRecordInfoComponent implements OnInit {
  @Input() section: 'header' | 'content';
  @Input() type: 'itSystemInventoryInfo' | 'itSystemDataFlowInfo';
  @Input() data: any;
  @Input() allDataElements: any;
  @Input() allProcessingPurposes: any;

  constructor() {}

  ngOnInit() {}
}
