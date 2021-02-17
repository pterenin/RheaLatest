import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ta-system-record-tab-table',
  templateUrl: './system-record-tab-table.component.html',
  styleUrls: ['./system-record-tab-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SystemRecordTabTableComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() gridId: string;
  @Input() col1Name: string;
  @Input() col2Name: string;
  @Input() col1Field: string;
  @Input() col2Field: string;

  constructor() {}

  ngOnInit() {}

  public isAllSelected(): boolean {
    if (!this.data || !this.data.length) {
      return false;
    }
    return this.data.every(transfer => transfer.isSelected);
  }

  public isSomeSelected(): boolean {
    if (!this.data || !this.data.length) {
      return false;
    }
    return this.data.some(transfer => transfer.isSelected);
  }

  public isIndeterminate(): boolean {
    if (!this.data || !this.data.length) {
      return false;
    }
    return !this.isAllSelected() && this.isSomeSelected();
  }

  public allFiltersClick($event) {
    $event.preventDefault();
    if (this.isSomeSelected()) {
      this.deselectAll();
    } else {
      this.selectAll();
    }
  }

  public selectAll() {
    this.data.forEach(transfer => (transfer.isSelected = true));
  }

  public deselectAll() {
    this.data.forEach(transfer => (transfer.isSelected = false));
  }
}
