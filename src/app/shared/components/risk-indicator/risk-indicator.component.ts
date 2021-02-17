import { Component, Input, OnInit } from '@angular/core';
import { RISK_TYPE_LABELS, RiskType } from './risk-indicator.model';

@Component({
  selector: 'ta-risk-indicator',
  templateUrl: './risk-indicator.component.html',
  styleUrls: ['./risk-indicator.component.scss']
})
export class RiskIndicatorComponent implements OnInit {
  @Input() risk: RiskType;
  public imgPath = '';
  public riskLabel = '--';

  constructor() {}

  ngOnInit() {
    switch (this.risk) {
      case 'LIKELY_HIGH_RISK': {
        this.imgPath = 'assets/images/risk-high.svg';
        this.riskLabel = RISK_TYPE_LABELS.LIKELY_HIGH_RISK;
        break;
      }
      case 'POSSIBLY_HIGH_RISK': {
        this.imgPath = 'assets/images/risk-low.svg';
        this.riskLabel = RISK_TYPE_LABELS.POSSIBLY_HIGH_RISK;
        break;
      }
      case 'RISK_UNLIKELY': {
        this.imgPath = 'assets/images/risk-no.svg';
        this.riskLabel = RISK_TYPE_LABELS.RISK_UNLIKELY;
        break;
      }
      case 'INCOMPLETE_FIELDS': {
        this.imgPath = 'assets/images/risk-inc.svg';
        this.riskLabel = RISK_TYPE_LABELS.INCOMPLETE_FIELDS;
        break;
      }
      case 'USER_DETERMINED_NO_INDICATOR': {
        this.imgPath = '';
        this.riskLabel = RISK_TYPE_LABELS.USER_DETERMINED_NO_INDICATOR;
        break;
      }
      default:
        this.imgPath = '';
        this.riskLabel = RISK_TYPE_LABELS.USER_DETERMINED_NO_INDICATOR;
    }
  }
}
