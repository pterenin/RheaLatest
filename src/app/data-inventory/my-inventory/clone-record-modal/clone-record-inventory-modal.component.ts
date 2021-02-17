import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TaActiveModal } from '@trustarc/ui-toolkit';

declare const _: any;
@Component({
  selector: 'ta-clone-record-inventory-modal',
  templateUrl: './clone-record-inventory-modal.component.html',
  styleUrls: ['./clone-record-inventory-modal.component.scss']
})
export class CloneRecordInventoryModalComponent implements OnInit {
  @Input() public record = {
    name: ''
  };

  public formInputs = new FormGroup({
    businessProcessName: new FormControl('', {
      validators: [Validators.required]
    }),
    allTags: new FormControl(false),
    allAttachments: new FormControl(false)
  });

  constructor(public activeModal: TaActiveModal) {}

  ngOnInit() {
    // [i18n-tobeinternationalized]
    this.formInputs.patchValue({
      businessProcessName: `Clone - ${this.record.name}`
    });
  }

  public onCancel() {
    this.activeModal.dismiss('Cancel');
  }

  public onSubmit() {
    this.activeModal.close({
      inputs: this.formInputs.value,
      record: this.record
    });
  }
}
