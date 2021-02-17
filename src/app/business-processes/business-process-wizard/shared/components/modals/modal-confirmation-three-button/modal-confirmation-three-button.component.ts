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
  selector: 'ta-modal-confirmation-three-button',
  templateUrl: './modal-confirmation-three-button.component.html',
  styleUrls: ['./modal-confirmation-three-button.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalConfirmationThreeButtonComponent implements OnInit {
  @Input() public type: string;
  @Input() public icon: string;
  @Input() public title: string;
  @Input() public description: string;
  @Input() public btnLabelCancel: string;
  @Input() public btnLabelDiscard: string;
  @Input() public btnLabelConfirm: string;
  @Input() public btnDisableDiscard: boolean;
  @Input() public btnDisableConfirm: boolean;
  @Input() public showSpinner: boolean;

  @Input() public items: string[];

  @Output() public cancel: EventEmitter<void>;
  @Output() public discard: EventEmitter<string>;
  @Output() public confirm: EventEmitter<string>;

  constructor(private activeModal: TaActiveModal) {
    this.type = 'question';
    this.icon = 'help';
    this.title = 'Are you sure?';
    this.btnLabelCancel = 'Cancel';
    this.btnLabelDiscard = 'Discard';
    this.btnLabelConfirm = 'Confirm';
    this.showSpinner = false;

    this.cancel = new EventEmitter<void>();
    this.discard = new EventEmitter<string>();
    this.confirm = new EventEmitter<string>();
  }

  ngOnInit() {}

  public submit() {
    if (!this.showSpinner) {
      this.activeModal.close('CONFIRM');
      this.confirm.emit();
    }
  }

  public discardChanges() {
    this.activeModal.close('DISCARD');
    this.discard.emit();
  }

  public dismiss() {
    this.activeModal.dismiss();
    this.cancel.emit();
  }
}
