import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataInventoryService } from 'src/app/data-inventory/data-inventory.service';

@Component({
  selector: 'ta-data-inventory-footer',
  templateUrl: './data-inventory-footer.component.html',
  styleUrls: ['./data-inventory-footer.component.scss']
})
export class DataInventoryFooterComponent implements OnInit {
  public _isUploading: boolean;
  public _isFormValid: boolean;

  @Output() entitySaved = new EventEmitter<Boolean>();

  @Output() saveAndAddAnother = new EventEmitter<any>();

  @Input() allowAddAnother = false;
  @Input() isSaving: boolean;

  @Input()
  set isFormValid(isFormValid: boolean) {
    this._isFormValid = isFormValid;
  }

  @Input()
  set isUploading(isUploading: boolean) {
    this._isUploading = isUploading;
  }

  constructor(private dataInventoryService: DataInventoryService) {
    this.isSaving = false;
  }

  ngOnInit() {}

  public onSaveClicked() {
    this.entitySaved.emit(true);
  }

  public onSaveAndAddAnotherClicked() {
    this.saveAndAddAnother.emit();
  }

  public onCancelChanges() {
    this.dataInventoryService.setCancelFormChanges = true;
  }
}
