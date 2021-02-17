import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { RISK_TYPE, RISK_TYPE_LABELS } from './traffic-risk-indicator.model';

@Component({
  selector: 'ta-traffic-risk-indicator',
  templateUrl: './traffic-risk-indicator.component.html',
  styleUrls: ['./traffic-risk-indicator.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TrafficRiskIndicatorComponent implements OnInit {
  @Input() riskItem: any;
  constructor() {}

  ngOnInit() {}

  public getLabel() {
    const key =
      this.riskItem.residualRiskIndicator ||
      this.riskItem.inherentRiskIndicator ||
      this.riskItem.algorithmRiskIndicator;
    const label = RISK_TYPE_LABELS[key];
    return label || '';
  }

  public isIncompletFields() {
    return this.riskItem.algorithmRiskIndicator === RISK_TYPE.INCOMPLETE_FIELDS;
  }

  public isLink(riskItem) {
    if (riskItem) {
      const { algorithmRiskIndicator } = riskItem;

      if (algorithmRiskIndicator === RISK_TYPE.INCOMPLETE_FIELDS) {
        return false;
      }
    }

    return true;
  }
}
