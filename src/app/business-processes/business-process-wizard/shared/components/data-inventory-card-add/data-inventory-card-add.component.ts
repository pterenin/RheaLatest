import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import { TaDropdown } from '@trustarc/ui-toolkit';

@Component({
  selector: 'ta-data-inventory-card-add',
  templateUrl: './data-inventory-card-add.component.html',
  styleUrls: ['./data-inventory-card-add.component.scss']
})
export class DataInventoryCardAddComponent implements OnInit {
  @ViewChild('categoryDropdown') public categoryDropdown: TaDropdown;

  @Input() public contentWidth: string;
  @Input() public searchPlaceholder = 'Search';
  @Output() public searchUpdated: EventEmitter<void>;

  constructor() {
    this.contentWidth = '350px';
    this.searchUpdated = new EventEmitter();
  }

  ngOnInit() {}

  public onSearch(event) {
    this.searchUpdated.emit(event);
  }

  public openDropdown(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.categoryDropdown.open();
  }
}
