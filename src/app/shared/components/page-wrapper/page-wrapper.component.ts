import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ta-page-wrapper',
  templateUrl: './page-wrapper.component.html',
  styleUrls: ['./page-wrapper.component.scss']
})
export class PageWrapperComponent implements OnInit {
  @HostBinding('class') classes: string;
  @Input() full: boolean;

  constructor() {}

  ngOnInit() {
    this.classes = this.full
      ? 'container-fluid container-full'
      : 'container-fluid';
  }
}
