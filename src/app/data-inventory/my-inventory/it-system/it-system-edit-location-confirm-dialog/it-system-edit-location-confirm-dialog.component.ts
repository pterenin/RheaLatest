import { Component, ViewEncapsulation } from '@angular/core';
import { TaActiveModal } from '@trustarc/ui-toolkit';

@Component({
  selector: 'ta-it-system-edit-location-confirm-dialog',
  templateUrl: './it-system-edit-location-confirm-dialog.component.html',
  styleUrls: ['./it-system-edit-location-confirm-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ItSystemEditLocationConfirmDialogComponent {
  public countryId: String;
  public bpRecords: any;

  constructor(public activeModal: TaActiveModal) {}

  public closeModal() {
    this.activeModal.dismiss(false);
  }

  public onSubmit() {
    this.activeModal.close(true);
  }
}
