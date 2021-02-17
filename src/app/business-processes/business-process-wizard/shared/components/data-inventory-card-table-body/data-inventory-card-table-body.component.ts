import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'ta-data-inventory-card-table-body',
  templateUrl: './data-inventory-card-table-body.component.html',
  styleUrls: ['./data-inventory-card-table-body.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DataInventoryCardTableBodyComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() col1Field: string;
  @Input() col2Field: string;

  @Output() public rowDeleted = new EventEmitter();
  @Output() public rowChecked = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  public handleDeleteRow(event, row) {
    event.preventDefault();
    this.rowDeleted.emit({ row });
  }

  public handleChange(event, row) {
    event.preventDefault();
    this.rowChecked.emit({ event, row });
  }
}
