import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';

@Component({
  selector: 'ta-view-rows-dropdown',
  templateUrl: './view-rows-dropdown.component.html',
  styleUrls: ['./view-rows-dropdown.component.scss']
})
export class ViewRowsDropdownComponent implements OnInit, OnDestroy, OnChanges {
  @Input() numRows: number;
  @Output() selectionChanged = new EventEmitter<any>();

  private data = [
    { value: 1, text: '25' },
    { value: 2, text: '50' },
    { value: 3, text: '75' },
    { value: 4, text: '100' },
    { value: 5, text: '200' }
  ];

  public options = [];

  public numRowsSelected = 25;

  constructor() {
    this.options = [...this.data];
  }

  ngOnInit() {
    this.numRowsSelected = this.numRows;
  }

  ngOnChanges() {
    this.numRowsSelected = this.numRows;
  }

  ngOnDestroy() {}

  public updateNumberOfRows(numRows: number) {
    this.numRowsSelected = numRows;
    this.selectionChanged.emit(numRows);
  }
}
