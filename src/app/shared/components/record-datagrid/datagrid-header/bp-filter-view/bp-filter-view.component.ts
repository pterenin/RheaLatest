import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ta-bp-filter-view',
  templateUrl: './bp-filter-view.component.html',
  styleUrls: ['./bp-filter-view.component.scss']
})
export class BpFilterViewComponent implements OnInit {
  public expandFilterView = false;

  constructor() {}

  ngOnInit() {}

  expandFilterViewToggle() {
    this.expandFilterView = !this.expandFilterView;
  }

  closeFilterView() {
    this.expandFilterView = false;
  }
}
