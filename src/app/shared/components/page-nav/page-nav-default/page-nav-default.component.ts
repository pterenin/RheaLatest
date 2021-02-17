import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ta-page-nav-default',
  templateUrl: './page-nav-default.component.html',
  styleUrls: ['./page-nav-default.component.scss']
})
export class PageNavDefaultComponent implements OnInit {
  constructor() {}

  @Input() selectedStep: number;
  @Input() step: number;
  @Input() isReview: boolean;

  ngOnInit() {}

  isSelected() {
    return this.step === this.selectedStep;
  }

  isCompleted() {
    return this.step < this.selectedStep;
  }

  showStep() {
    return this.step >= this.selectedStep && !this.isReview;
  }
}
