import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'ta-system-record-item-list-component',
  templateUrl: './system-record-item-list.component.html',
  styleUrls: ['./system-record-item-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SystemRecordItemListComponent implements OnInit {
  @Input() public type: 'record' | 'button' = 'record';
  @Input() public selectedItem: any;
  @Output() public selected = new EventEmitter();

  private _data: any;
  @Input() set data(value: any) {
    if (value) {
      this._data = value;
    }
  }
  get data(): any {
    return this._data;
  }

  constructor() {}

  ngOnInit() {}

  public onSelect(event) {
    this.selected.emit(event);
  }
}
