import { Component, Input, OnInit } from '@angular/core';

import { TaActiveModal } from '@trustarc/ui-toolkit';

import { FormControl, FormGroup } from '@angular/forms';

declare const _: any;
@Component({
  selector: 'ta-clone-record-modal',
  templateUrl: './clone-record-modal.component.html',
  styleUrls: ['./clone-record-modal.component.scss']
})
export class CloneRecordModalComponent implements OnInit {
  @Input() public record = {
    name: ''
  };

  public formInputs = new FormGroup({
    businessProcessName: new FormControl(''),
    allTags: new FormControl(false),
    allAttachments: new FormControl(false)
  });
  constructor(public activeModal: TaActiveModal) {}

  ngOnInit() {
    this.formInputs.patchValue({
      businessProcessName: `Clone - ${this.record.name}`
    });
  }
  public onCheck(event, propName) {
    this.formInputs.value[propName] = event.target.checked;
  }

  public onCancel() {
    this.activeModal.dismiss('Cancel');
  }

  public onSubmit() {
    this.activeModal.close(this.formInputs.value);
  }
}
