import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ta-audit-accordion',
  templateUrl: './audit-accordion.component.html',
  styleUrls: ['./audit-accordion.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AuditAccordionComponent implements OnInit {
  @Input() totalAudit = 0;

  constructor() {}

  ngOnInit() {}

  public finishedLoadAudit(total) {
    this.totalAudit = total;
  }
}
