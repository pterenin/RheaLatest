import {
  Component,
  OnInit,
  HostBinding,
  Output,
  EventEmitter,
  Input
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ta-business-process-wizard-footer',
  templateUrl: './business-process-wizard-footer.component.html',
  styleUrls: ['./business-process-wizard-footer.component.scss']
})
export class BusinessProcessWizardFooterComponent implements OnInit {
  @HostBinding('class') public readonly classes =
    'bg-white pt-2 pb-2 pl-3 pr-3 d-block';

  @Output() isClickCancelButton: EventEmitter<boolean>;
  @Output() isClickPreviousButton: EventEmitter<boolean>;
  @Output() isClickNextButton: EventEmitter<boolean>;

  @Input() disableCancelButton: boolean;
  @Input() disablePreviousButton: boolean;
  @Input() disableNextButton: boolean;

  @Input() showCancelButton: boolean;
  @Input() showPreviousButton: boolean;
  @Input() showNextButton: boolean;

  @Input() textCancelButton = 'Cancel';
  @Input() textPreviousButton = 'Previous';
  @Input() textNextButton = 'Next';

  constructor(private router: Router) {
    this.isClickCancelButton = new EventEmitter();
    this.isClickPreviousButton = new EventEmitter();
    this.isClickNextButton = new EventEmitter();
    this.showCancelButton = true;
    this.showPreviousButton = true;
    this.showNextButton = true;
  }

  ngOnInit() {}

  public clickCancel() {
    this.isClickCancelButton.emit(true);
  }

  public clickPrevious() {
    this.isClickPreviousButton.emit(true);
  }

  public clickNext() {
    this.isClickNextButton.emit(true);
  }
}
