import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation
} from '@angular/core';
import { TaActiveModal } from '@trustarc/ui-toolkit';

@Component({
  selector: 'ta-modal-confirmation-basic',
  templateUrl: './modal-confirmation-basic.component.html',
  styleUrls: ['./modal-confirmation-basic.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalConfirmationBasicComponent implements OnInit {
  @Input() public type: string;
  @Input() public icon: string;
  @Input() public title: string;
  @Input() public description: string;
  @Input() public btnLabelCancel: string;
  @Input() public btnLabelConfirm: string;
  @Input() public btnDisableConfirm: boolean;
  @Input() public showSpinner: boolean;

  @Input() public items: string[];

  @Output() public cancel: EventEmitter<void>;
  @Output() public confirm: EventEmitter<void>;

  constructor(private activeModal: TaActiveModal) {
    this.type = 'question';
    this.icon = 'help';
    this.title = 'Are you sure?';
    this.btnLabelCancel = 'Cancel';
    this.btnLabelConfirm = 'Confirm';
    this.showSpinner = false;

    this.cancel = new EventEmitter<void>();
    this.confirm = new EventEmitter<void>();
  }

  ngOnInit() {}

  public submit() {
    if (!this.showSpinner) {
      this.activeModal.close();
      this.confirm.emit();
    }
  }

  public dismiss() {
    this.activeModal.dismiss();
    this.cancel.emit();
  }
}
