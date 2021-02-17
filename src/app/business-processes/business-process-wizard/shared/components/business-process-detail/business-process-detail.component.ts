import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';

import {
  BusinessProcessDetailsInterface,
  DataSubjectVolumeInterface
} from 'src/app/shared/_interfaces';

@Component({
  selector: 'ta-business-process-detail',
  templateUrl: './business-process-detail.component.html',
  styleUrls: ['./business-process-detail.component.scss']
})
export class BusinessProcessDetailComponent implements OnInit {
  private data: BusinessProcessDetailsInterface;

  @Input() public dataSubjectVolumes: DataSubjectVolumeInterface[];
  @Input() public sourceData: Observable<BusinessProcessDetailsInterface>;

  @Output() public dataChanged: EventEmitter<
    BusinessProcessDetailsInterface
  > = new EventEmitter();
  @Output() public formGroupValueChanges: EventEmitter<
    FormGroup
  > = new EventEmitter();

  public detailsForm: FormGroup;
  public name: FormControl;
  public dataSubjectVolume: FormControl;
  public description: FormControl;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.dataSubjectVolumes = [];
    this.initForm();
    this.sourceData.subscribe(datum => {
      if (datum) {
        this.data = datum;
        this.initForm();
      }
    });
  }

  initForm() {
    this.detailsForm = this.formBuilder.group({
      name: this.name = new FormControl(
        this.data && this.data.name ? this.data.name : '',
        [Validators.required, Validators.maxLength(255)]
      ),
      dataSubjectVolume: this.dataSubjectVolume = new FormControl(
        this.data && this.data.dataSubjectVolumeId
          ? this.getDataSubjectVolume(this.data.dataSubjectVolumeId)
          : ''
      ),
      description: this.description = new FormControl(
        this.data && this.data.description ? this.data.description : '',
        Validators.maxLength(1024)
      )
    });

    this.detailsForm.valueChanges.subscribe(() => {
      this.formGroupValueChanges.emit(this.detailsForm);
      if (this.detailsForm.valid) {
        this.dataChanged.emit(this.mappedObject());
      }
    });
    this.detailsForm.updateValueAndValidity({
      onlySelf: true,
      emitEvent: true
    });
  }

  private getDataSubjectVolume(id: string) {
    return this.dataSubjectVolumes && this.dataSubjectVolumes.length > 0
      ? this.dataSubjectVolumes.find(v => v.id === id)
      : '';
  }

  onSubmit() {
    if (this.detailsForm.touched || this.detailsForm.dirty) {
      this.dataChanged.emit(this.mappedObject());
    }
  }

  private mappedObject() {
    if (!this.data) {
      throwError('Data is not initialized');
    }
    const mapped = this.data;

    mapped.description = this.description.value;
    mapped.name = this.name.value;
    mapped.dataSubjectVolumeId = this.dataSubjectVolume.value.id;
    return mapped;
  }
}
