import { Component, Input } from '@angular/core';

@Component({
  selector: 'ta-risk-field-indicator',
  templateUrl: './risk-field-indicator.component.html',
  styleUrls: ['./risk-field-indicator.component.scss']
})
export class RiskFieldIndicatorComponent {
  @Input() public showIndicator: boolean;

  public get show(): boolean {
    return this.showIndicator === true ? true : false;
  }

  constructor() {
    this.showIndicator = true;
  }
}
