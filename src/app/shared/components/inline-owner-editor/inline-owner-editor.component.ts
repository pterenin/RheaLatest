import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewEncapsulation
} from '@angular/core';
import { TaDropdown, TaPopover } from '@trustarc/ui-toolkit';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusinessProcessControllerService } from '../../_services/rest-api';
import { Subscription } from 'rxjs';
import { UtilsClass } from '../../_classes';
import { AutoUnsubscribe } from '../../decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { BusinessProcessOverviewInterface } from '../../_interfaces';
import { tap } from 'rxjs/operators';
import { noWhitespaceValidator } from '../../utils/form-utils';

declare const _: any;

@AutoUnsubscribe(['_inlineRecordFetch$', '_inlineRecordUpdate$'])
@Component({
  selector: 'ta-inline-owner-editor',
  templateUrl: './inline-owner-editor.component.html',
  styleUrls: ['./inline-owner-editor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InlineOwnerEditorComponent implements OnInit, OnDestroy {
  @ViewChild('displayPopOver') popoverRef;
  @ViewChild('editingDropdown') editingDropdown;

  // Subscriptions
  private _inlineRecordFetch$: Subscription;
  private _inlineRecordUpdate$: Subscription;

  private inlineRecord: BusinessProcessOverviewInterface;
  private isProcessing = false;
  public initialFormData = null;

  @ViewChildren(TaPopover) popover: QueryList<TaPopover>;
  @ViewChildren(TaDropdown) dropdown: QueryList<TaPopover>;

  @Output() activePopover: EventEmitter<any>;
  @Output() editModeChanges: EventEmitter<any>;
  @Output() selectionChanges: EventEmitter<any>;
  @Output() openDropdown: EventEmitter<TaDropdown>;

  @Input() businessProcessId = '';
  @Input() flatNames = [];
  @Input() public data: any[] = [];

  public editMode = false;
  public form: FormGroup;

  private cachedOpenPopovers = [];

  //#region constructor, OnInit, OnDestroy

  constructor(
    private formBuilder: FormBuilder,
    private businessProcessControllerService: BusinessProcessControllerService
  ) {
    this.activePopover = new EventEmitter();
    this.editModeChanges = new EventEmitter();
    this.selectionChanges = new EventEmitter();
    this.openDropdown = new EventEmitter();
    this.initializeBlankForm();
  }

  ngOnInit() {
    this.flatNames = Array.isArray(this.flatNames)
      ? this.flatNames.map(name => name || '')
      : [];

    if (Array.isArray(this.data) && this.data.length > 0) {
      this.data = this.data.map(item => {
        // inline edit only for records having valid id, name (non-empty)
        if (
          item &&
          item.id &&
          item.name &&
          UtilsClass.isNullOrUndefinedOrEmpty(item.id) === false &&
          UtilsClass.isNullOrUndefinedOrEmpty(item.name) === false
        ) {
          return item;
        }
      });
      this.initializeForm();
    } else {
      this.initializeBlankForm();
    }
    this.saveFormState();
  }

  ngOnDestroy() {}

  //#endregion

  //#region Inline Record (Fetch, Change Payload, Update)

  /**
   * transform business object to {id, name}
   * @param record inline record from API
   */
  mapToIdName(record: BusinessProcessOverviewInterface) {
    if (record && record.contacts && record.contacts.length > 0) {
      return record.contacts.map(contact => {
        return {
          id: contact.id,
          name: contact.fullName
        };
      });
    } else {
      return [];
    }
  }

  public getInlineRecord() {
    UtilsClass.unSubscribe(this._inlineRecordFetch$);

    this.isProcessing = true;
    this._inlineRecordFetch$ = this.businessProcessControllerService
      .findOverviewById(this.businessProcessId)
      .pipe(
        tap(response => {
          this.inlineRecord = response;
        })
      )
      .subscribe(() => {
        this.isProcessing = false;
      });
  }

  public updateInlineRecord() {
    UtilsClass.unSubscribe(this._inlineRecordUpdate$);
    const recordsChanged = this.form.get('formGroupsArray').value;

    // updates full name for update payload
    this.inlineRecord.contacts.map(contact => {
      const matchingRecord = recordsChanged.find(recordChanged => {
        return (
          recordChanged.id === contact.id &&
          recordChanged.id !== null &&
          contact.id !== null
        );
      });
      if (matchingRecord) {
        contact.fullName = matchingRecord.name.trim();
      }
      return contact;
    });

    // filter out the records(contacts) from Overview GET response
    // contact id are empty , null or undefined;
    this.inlineRecord.contacts = this.inlineRecord.contacts.filter(contact => {
      return (
        contact.id !== null || contact.id !== undefined || contact.id.length > 0
      );
    });

    this._inlineRecordUpdate$ = this.businessProcessControllerService
      .updateOverview(this.inlineRecord)
      .pipe(
        tap(response => {
          this.inlineRecord = response;
        })
      )
      .subscribe(() => {
        this.selectionChanges.emit({
          id: this.businessProcessControllerService
        });
        this.closePopovers();
        this.isProcessing = false;
      });
  }

  //#endregion

  //#region Inline Form UX

  initializeBlankForm() {
    this.form = this.formBuilder.group({
      formGroupsArray: this.formBuilder.array([])
    });
  }

  buildForm(dataItem) {
    return this.formBuilder.group({
      id: [dataItem.id],
      name: [
        dataItem.name,
        [Validators.required, noWhitespaceValidator, Validators.maxLength(255)]
      ]
    });
  }

  saveFormState() {
    this.initialFormData = this.form.getRawValue();
  }

  restoreFormInitialState() {
    this.form.patchValue(this.initialFormData);
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  clearFormArray = (formArray: FormArray) => {
    while (formArray.length > 0) {
      formArray.removeAt(0);
    }
  };

  initializeForm() {
    this.clearFormArray(this.inlineFormsArray);
    const formArray = this.inlineFormsArray;
    this.data.forEach(item => {
      // include records only have valid id and full name (including blank full name)
      if (
        item &&
        item.id &&
        item.name &&
        UtilsClass.isNullOrUndefinedOrEmpty(item.id) === false &&
        UtilsClass.isNullOrUndefinedOrEmpty(item.name) === false
      ) {
        formArray.push(this.buildForm(item));
      }
    });

    // FOR ADD if there is no Owner Defined Yet
    if (formArray.length === 0) {
      formArray.push(this.buildForm({ id: '0000', name: '--' }));
    }

    this.form = this.formBuilder.group({
      formGroupsArray: formArray
    });
  }

  get inlineFormsArray(): FormArray {
    const formArray = <FormArray>this.form.get('formGroupsArray');
    if (formArray) {
      return formArray;
    } else {
      return this.formBuilder.array([]);
    }
  }

  //#endregion

  //#region  EDIT UX

  public toggleEditMode(bool) {
    this.editModeChanges.emit(true);
    this.cleanUp();
    this.editMode = bool;
    if (bool === true) {
      this.getInlineRecord();
    }
  }

  //#endregion

  //#region Inline Owner Updated

  public onSave() {
    this.updateInlineRecord();
  }

  //#endregion

  //#region Popover

  public cleanUp() {
    this.restoreFormInitialState();
    this.editMode = false;
    this.cachedOpenPopovers = [];
  }

  public prevent(event) {
    if (this.dropdown.first) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  public onCancel() {
    this.editMode = false;
    this.cleanUp();
  }

  public triggerPopover(popover) {
    if (this.editMode) {
      return;
    }
    this.cachedOpenPopovers.push(popover);
    this.activePopover.emit(popover);
    popover.open();
  }

  public closePopovers() {
    if (this.cachedOpenPopovers.length) {
      this.cachedOpenPopovers.forEach(pop => {
        if (pop) {
          pop.close();
        }
      });
      this.cleanUp();
    }
  }

  public closeEditingDropdown() {
    this.toggleEditMode(false);
    this.editingDropdown.close();
  }

  //#endregion
}
