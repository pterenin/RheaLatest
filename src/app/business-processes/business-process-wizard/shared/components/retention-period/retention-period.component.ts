import {
  Component,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { RETENTION_PERIOD_CONSTANTS } from 'src/app/shared/_constant';
import { RetentionPeriodValues } from 'src/app/shared/_interfaces';

@Component({
  selector: 'ta-retention-period',
  templateUrl: './retention-period.component.html',
  styleUrls: ['./retention-period.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RetentionPeriodComponent implements OnInit, OnChanges {
  @Input() public retentionPeriodData = null;
  @Output() public retentionPeriodChanges: EventEmitter<RetentionPeriodValues>;

  public retentionPeriodUnitsOptions = [
    RETENTION_PERIOD_CONSTANTS.days,
    RETENTION_PERIOD_CONSTANTS.weeks,
    RETENTION_PERIOD_CONSTANTS.months,
    RETENTION_PERIOD_CONSTANTS.years,
    RETENTION_PERIOD_CONSTANTS.other
  ];

  public retentionPeriodForm: FormGroup;
  public get retentionPeriodValue(): FormControl {
    return this.retentionPeriodForm.get(
      RETENTION_PERIOD_CONSTANTS.retentionPeriodValue
    ) as FormControl;
  }
  public get retentionPeriodUnits(): FormControl {
    return this.retentionPeriodForm.get(
      RETENTION_PERIOD_CONSTANTS.retentionPeriodUnits
    ) as FormControl;
  }
  public get retentionPeriodUnitsOther(): FormControl {
    return this.retentionPeriodForm.get(
      RETENTION_PERIOD_CONSTANTS.retentionPeriodUnitsOther
    ) as FormControl;
  }

  constructor(private formBuilder: FormBuilder) {
    this.retentionPeriodChanges = new EventEmitter<RetentionPeriodValues>();
    this.retentionPeriodForm = this.formBuilder.group({
      retentionPeriodValue: new FormControl(null, [
        Validators.maxLength(20),
        Validators.pattern('^[0-9]*$')
      ]),
      retentionPeriodUnits: new FormControl(''),
      retentionPeriodUnitsOther: new FormControl('', [
        Validators.maxLength(1024)
      ])
    });
  }

  public ngOnInit(): void {
    this.initRetentionPeriodForm();
    this.patchRetentionPeriodForm();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.hasOwnProperty(RETENTION_PERIOD_CONSTANTS.retentionPeriodData)
    ) {
      if (changes.retentionPeriodData.currentValue) {
        this.patchRetentionPeriodForm();
      }
    }
  }

  public initRetentionPeriodForm() {
    this.retentionPeriodUnits.valueChanges.subscribe(value => {
      if (value === RETENTION_PERIOD_CONSTANTS.other) {
        this.retentionPeriodValue.setValue(null);
        this.retentionPeriodValue.disable();
      } else {
        this.retentionPeriodValue.enable();
      }
    });

    this.retentionPeriodForm.valueChanges.subscribe(() => {
      this.retentionPeriodChanges.emit(this.retentionPeriodForm.value);
    });
  }

  public patchRetentionPeriodForm() {
    if (this.retentionPeriodData) {
      this.retentionPeriodUnits.setValue(this.retentionPeriodData.type);
      if (this.retentionPeriodData.type === RETENTION_PERIOD_CONSTANTS.other) {
        this.retentionPeriodUnitsOther.setValue(
          this.retentionPeriodData.description
        );
        this.retentionPeriodValue.setValue(null);
        this.retentionPeriodValue.disable();
      } else {
        this.retentionPeriodValue.setValue(this.retentionPeriodData.value);
      }
    }
  }

  public resetRetentionPeriodForm() {
    this.retentionPeriodValue.setValue(null);
    this.retentionPeriodUnits.setValue('');
    this.retentionPeriodUnitsOther.setValue('');
    this.retentionPeriodForm.markAsUntouched();
    this.retentionPeriodForm.markAsPristine();
  }
}
