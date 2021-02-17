import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ta-page-footer-nav',
  templateUrl: './page-footer-nav.component.html',
  styleUrls: ['./page-footer-nav.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PageFooterNavComponent implements OnInit {
  constructor() {}

  @Input() public currentFormValidity = false;

  ngOnInit() {}
}
