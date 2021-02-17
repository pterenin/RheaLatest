import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'ta-system-record-item-component',
  templateUrl: './system-record-item.component.html',
  styleUrls: ['./system-record-item.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SystemRecordItemComponent implements OnInit {
  @Output() public selected = new EventEmitter();
  @Input() public selectedItem: any;
  @Input() public fieldId = 'id';
  @Input() public fieldName = 'name';
  @Input() public fieldEntityName: string;
  @Input() public fieldEntityType: string;
  @Input() public fieldLocationName: string;
  @Input() public fieldMapped: string;
  @Input() public withLocation = true;
  @Input() public withIcon = false;
  @Input() public iconType = 'check-circle-filled';
  @Input() public colorIconOne = '#5FC323';
  @Input() public colorIconTwo = '#FFF';

  private _item: any;
  @Input() set item(value: any) {
    if (value) {
      this._item = value;
    }
  }
  get item(): any {
    return this._item;
  }

  constructor() {}

  ngOnInit() {}

  public onClick(item) {
    this.selected.emit(item);
  }

  public isSelected(item) {
    if (this.selectedItem) {
      return this.selectedItem[this.fieldId] === item[this.fieldId];
    }

    return false;
  }
}
