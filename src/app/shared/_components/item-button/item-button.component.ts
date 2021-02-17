import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { DataFlowView } from 'src/app/app.constants';

@Component({
  selector: 'ta-item-button-component',
  templateUrl: './item-button.component.html',
  styleUrls: ['./item-button.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ItemButtonComponent implements OnInit {
  @Output() public selected = new EventEmitter();
  @Input() public selectedItem: any;
  @Input() public fieldId = 'id';

  public iconType: 'initial' | 'svg' = 'initial';

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

  ngOnInit() {
    this.iconType = this.getIconType();
  }

  public getIconType() {
    if (this.item) {
      const { type } = this.item;
      return type === DataFlowView.MAP || type === DataFlowView.FLOWCHART
        ? 'svg'
        : 'initial';
    }
  }

  public onClick(item) {
    if (item.disabled) {
      return;
    }

    this.selected.emit(item);
  }

  public isSelected(item) {
    if (this.selectedItem) {
      return this.selectedItem[this.fieldId] === item[this.fieldId];
    }

    return false;
  }

  public isDisabled(item) {
    if (item) {
      return item.disabled;
    }

    return false;
  }
}
