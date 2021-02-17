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
  selector: 'ta-selected-system-record-filter',
  templateUrl: './selected-system-record-filter.component.html',
  styleUrls: ['./selected-system-record-filter.component.scss']
})
export class SelectedSystemRecordFilterComponent implements OnInit {
  @ViewChild('filterDropdown') public dropdown: TaDropdown;

  @Input() public contentWidth: string;
  @Input() public headerTitle: string;

  @Input() public clearLabel: string;
  @Input() public closeOnClear: boolean;
  @Output() public clearClick: EventEmitter<void>;

  @Input() public applyLabel: string;
  @Input() public closeOnApply: boolean;
  @Output() public applyClick: EventEmitter<void>;

  @Input() public isDirty: boolean;

  constructor() {
    this.contentWidth = '350px';

    this.clearLabel = 'Clear';
    this.closeOnClear = true;
    this.clearClick = new EventEmitter();

    this.applyLabel = 'Apply';
    this.closeOnApply = true;
    this.applyClick = new EventEmitter();
  }

  ngOnInit() {}

  public onClear() {
    this.clearClick.emit();

    if (this.closeOnClear) {
      this.dropdown.close();
    }
  }

  public onApply() {
    this.applyClick.emit();

    if (this.closeOnApply) {
      this.dropdown.close();
    }
  }
}
