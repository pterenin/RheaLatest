import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';

import { DataElements, InfoToolTipData, Position } from './info-modal.model';

@Component({
  selector: 'ta-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InfoModalComponent implements OnInit {
  @Input() public data: InfoToolTipData;

  // the default placement of the tooltip is top.
  // pass any other string to change it to bottom.
  @Input() public location: Position[];

  // this event is emitted when the transfer of sale toggle button is toggled
  @Output() saleOfDataChanged = new EventEmitter<Boolean>();

  constructor() {}

  ngOnInit() {}

  changeSaleOfData(event: Event) {
    this.saleOfDataChanged.emit(this.data.isSaleOfData);
  }

  // this method is added to guarantee order.
  // As looping over object keys do not guarantee order, we convert to an array.
  public dataElementsObjectToArray(data: DataElements) {
    return [
      data.name,
      data.jobTitle,
      data.emailAddress,
      data.telephoneNumber,
      data.salary,
      data.homeAddress
    ];
  }
}
