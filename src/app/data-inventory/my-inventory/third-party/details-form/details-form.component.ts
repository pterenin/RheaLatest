import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  Input
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  FormArray,
  ValidatorFn
} from '@angular/forms';
import { noWhitespaceValidator } from 'src/app/shared/utils/form-utils';
import {
  SelectBoxInterface,
  CountrySelectBoxInterface,
  ContactInterface,
  CCPAQuestionInterface
} from './details-form.model';
import { Subscription, Observable, of, forkJoin } from 'rxjs';
import { TaModal } from '@trustarc/ui-toolkit';
import { ContactComponent } from 'src/app/shared/components/contact/contact.component';
import { flatMap, tap, map, catchError } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { ThirdPartyService } from '../third-party.service';
import { exists, isNullOrUndefined } from 'src/app/shared/utils/basic-utils';
import { AutoUnsubscribe } from 'src/app/shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { ToastService } from '@trustarc/ui-toolkit';
import { ContactService } from 'src/app/shared/components/contact/contact.service';
import { Contact } from 'src/app/shared/components/contact/contact.model';
import {
  DATA_CONTROLLER_PROCESSOR_OPTIONS,
  DATA_CONTROLLER_PROCESSOR_MAP
} from 'src/app/shared/models/controller-process.model';
import { BaseDomainInterface } from 'src/app/shared/models/base-domain-model';
import { CompletionStateService } from 'src/app/shared/services/completion-state/completion-state.service';
import { categorize } from 'src/app/shared/components/categorical-view/base-category.model';
import { DataInventoryService } from 'src/app/data-inventory/data-inventory.service';
import {
  CanDeactivateTabInterface,
  DeactivationType
} from 'src/app/shared/components/tabset-guarded/can-deactivate-tab.model';
import { ThirdPartyType } from '../../../../app.constants';
import { getErrorMessageNoPermissionsToViewRecord } from '../../../../shared/utils/error-utils';
declare const _: any;

const DATA_INVENTORY_OPTIONS = [
  { id: ThirdPartyType.PARTNER, name: 'Partner' },
  { id: ThirdPartyType.VENDOR, name: 'Vendor' },
  { id: ThirdPartyType.CUSTOMER, name: 'Customer' },
  { id: ThirdPartyType.SERVICE_PROVIDER, name: 'Service Provider' },
  { id: ThirdPartyType.BUSINESS_ASSOCIATE, name: 'Business Associate' }
];

@AutoUnsubscribe([
  '_formChangeSubscription$',
  '_thirdPartyData$',
  '_formAutoSave$',
  '_locationsData$',
  '_industrySectorsData$',
  '_saveThirdParty$',
  '_addContactData$',
  '_getContactData$',
  '_updateContactData$',
  '_contactDetails$'
])
@Component({
  selector: 'ta-third-party-details-form',
  templateUrl: './details-form.component.html',
  styleUrls: ['./details-form.component.scss']
})
export class ThirdPartyDetailsFormComponent
  implements OnInit, OnDestroy, CanDeactivateTabInterface {
  @Input() public showRiskFields: boolean;
  @Input() public iconRequiredColor: 'default' | 'red' = 'default';
  @Input() public iconTypeTooltip: 'information-circle' | 'help' =
    'information-circle';

  @Output() updatedFormValue = new EventEmitter();
  @Output() updatedContactValue = new EventEmitter<ContactInterface>();

  public contactInfoAdded = false;
  public isNextButtonDisabled = false;

  public contact: ContactInterface;

  public thirdPartyDetailsForm: FormGroup;
  public vendorOrPartner = new FormControl(
    '',
    this.selectBoxSelectedValidator()
  );
  public notes = new FormControl('', Validators.maxLength(1024));
  public vendorName = new FormControl(
    '',
    Validators.compose([
      Validators.required,
      noWhitespaceValidator,
      Validators.maxLength(255)
    ])
  );

  public customEntityType = new FormControl(
    '',
    Validators.compose([Validators.minLength(0), Validators.maxLength(20)])
  );

  public locationForms = new FormControl(null, [
    Validators.required,
    Validators.minLength(1)
  ]);

  public selectedStartDate: Date;
  public selectedExpirationDate: Date;

  public industrySectors: any[];
  public vendorOrPartners: SelectBoxInterface[];
  public thirdPartyType = ThirdPartyType;
  public thirdPartyResponseType: string;
  public dataControllerOrProcessors: SelectBoxInterface[];
  public allCountries: CountrySelectBoxInterface[];
  public selectableCountries;
  public stateOrProvinces: SelectBoxInterface[];
  public ccpaQuestions: CCPAQuestionInterface[];
  public thirdPartyDataLoaded: boolean;
  public selectedLocations: any[] = [];
  public companyEntitiesDropdownList: any[] = [];

  private _formChangeSubscription$: Subscription[] = [];
  private _ccpaQuestionsData$: Subscription;
  private _thirdPartyData$: Subscription;
  private _formAutoSave$: Subscription;
  private _locationsData$: Subscription;
  private _industrySectorsData$: Subscription;
  private _saveThirdParty$: Subscription;
  private _addContactData$: Subscription;
  private _getContactData$: Subscription;
  private _updateContactData$: Subscription;
  private _contactDetails$: Subscription;
  private _companyEntities$: Subscription;

  private _onCancelSubscription$: Subscription;
  private _validitySubscription$: Subscription;

  @Output() updateValidity = new EventEmitter<boolean>(false);

  private defaultSelectBoxValue = { name: 'Select', id: null };
  private cancelChanges: boolean;

  private thirdPartyId: string;
  private thirdPartyVersion: number;
  public isDataControllerOrProcessorDisabled: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private thirdPartyService: ThirdPartyService,
    private toastService: ToastService,
    private modalService: TaModal,
    private contactService: ContactService,
    private completionStateService: CompletionStateService,
    private dataInventoryService: DataInventoryService,
    private router: Router
  ) {
    this.thirdPartyDataLoaded = false;
    this.allCountries = [];
    this.initializeThirdPartyForm();
    this.isDataControllerOrProcessorDisabled = true;
  }

  get form() {
    return this.thirdPartyDetailsForm.controls;
  }

  ngOnInit() {
    this.thirdPartyId = this.route.snapshot.params.id || 'new';
    this.getCCPAQuestionsData();
    this.getThirdPartyData();

    // this.setupFormAutoSave()

    this.createValidityUpdateSubscriber();

    this._contactDetails$ = this.contactService.contactSubject.subscribe(
      response => {
        this.contact = response;
      }
    );

    this.onCancelChanges();

    this.thirdPartyDetailsForm.valueChanges.subscribe(value => {
      this.updatedFormValue.emit({
        dirty: this.thirdPartyDetailsForm.dirty,
        valid: this.thirdPartyDetailsForm.valid,
        value
      });
    });
  }

  private onCancelChanges() {
    this.onCancelChangesSubscriber();
    this._onCancelSubscription$ = this.dataInventoryService.getCancelFormChanges.subscribe(
      (value: boolean) => {
        if (value) {
          this.cancelChanges = true;
          this.dataInventoryService.goBackDataInventoryListPage();
        }
      }
    );
  }

  private onCancelChangesSubscriber() {
    if (this._onCancelSubscription$) {
      this._onCancelSubscription$.unsubscribe();
    }
  }

  private createValidityUpdateSubscriber() {
    if (this._validitySubscription$) {
      this._validitySubscription$.unsubscribe();
    }
    this._validitySubscription$ = this.thirdPartyDetailsForm.statusChanges.subscribe(
      status => {
        this.createValidityUpdate();
      }
    );
  }

  private createValidityUpdate() {
    const isValid = this.thirdPartyDetailsForm.valid;
    this.updateValidity.emit(isValid && this.thirdPartyDataLoaded);
  }

  ngOnDestroy() {
    if (
      this._formChangeSubscription$ &&
      this._formChangeSubscription$.length > 0
    ) {
      this._formChangeSubscription$.forEach(sub => sub.unsubscribe);
    }

    this.onCancelChangesSubscriber();
  }

  private initializeThirdPartyForm() {
    this.thirdPartyDetailsForm = this.formBuilder.group({
      id: '',
      version: -1,
      vendorName: this.vendorName,
      vendorOrPartner: '',
      dataControllerOrProcessor: '',
      industrySectors: new FormControl([]),
      locationForms: this.locationForms,
      startDate: [new Date()],
      expirationDate: [new Date()],
      notes: this.notes,
      customEntityType: this.customEntityType,
      ccpaQuestionIds: this.formBuilder.array([]),
      companyEntityResponses: new FormControl([])
    });

    this.thirdPartyDetailsForm
      .get('vendorOrPartner')
      .setValidators(this.selectBoxSelectedValidator());
  }

  public showCustomEntityInput() {
    const { value } = this.thirdPartyDetailsForm.controls.vendorOrPartner;
    const reset = () => {
      if (this.thirdPartyDetailsForm.controls.customEntityType.value) {
        this.thirdPartyDetailsForm.patchValue({ customEntityType: '' });
      }
      return false;
    };

    return _.isObject(value) && value.id === 'OTHER' ? true : reset();
  }

  public customEntityTypeHasErrors() {
    const {
      vendorOrPartner,
      customEntityType
    } = this.thirdPartyDetailsForm.controls;

    if (
      _.isObject(vendorOrPartner.value) &&
      vendorOrPartner.value.id === 'OTHER' &&
      customEntityType.errors
    ) {
      return true;
    } else {
      return false;
    }
  }

  private getCompanyEntities() {
    return this.thirdPartyService
      .getCompanyEntities()
      .pipe(flatMap(data => of(data.content)));
  }

  private createManagingThirdpartyDropdownData(
    selected: any[] = [],
    allEntities: any[]
  ) {
    allEntities = allEntities.map(item => ({
      selected: false,
      value: item.id,
      text: item.name,
      type: item.type
    }));

    if (selected.length) {
      selected.forEach(selection => {
        allEntities.forEach(listItem => {
          if (selection.id === listItem.value) {
            listItem.selected = true;
          }
        });
      });
    }

    let parentTypes = allEntities.map(entity => entity.type);
    parentTypes.sort();
    parentTypes = parentTypes.filter(
      (groupName, i, arr) => groupName !== arr[i - 1]
    );

    const groups = parentTypes.map(parentType => {
      const items = allEntities.filter(entity => entity.type === parentType);
      let title = parentType.toLowerCase();
      title = parentType
        .split('_')
        .map(c => _.capitalize(c))
        .join(' ');

      return {
        group: title,
        items
      };
    });

    return groups;
  }

  private getThirdPartyData() {
    this._thirdPartyData$ = this.thirdPartyService
      .getThirdParty(this.thirdPartyId)
      .pipe(
        flatMap(thirdPartyData =>
          forkJoin([of(thirdPartyData), this.getCompanyEntities()])
        )
      )
      .subscribe(
        ([thirdPartyData, companyEntities]) => {
          this.thirdPartyResponseType = thirdPartyData.type;

          const mappedManagingThirdPartyDropdownData = this.createManagingThirdpartyDropdownData(
            thirdPartyData.companyEntityResponses,
            companyEntities
          );

          const vendor = DATA_INVENTORY_OPTIONS.find(
            item => item.id === thirdPartyData.type
          );
          const dataController =
            DATA_CONTROLLER_PROCESSOR_MAP[thirdPartyData.entityRole];

          this.thirdPartyDetailsForm.patchValue({
            id: thirdPartyData.id,
            version: thirdPartyData.version,
            vendorName: thirdPartyData.name,
            vendorOrPartner: this.thirdPartyId === 'new' ? undefined : vendor,
            dataControllerOrProcessor: dataController,
            startDate: thirdPartyData.contractStartDate,
            expirationDate: thirdPartyData.contractEndDate,
            locationForms: thirdPartyData.locations,
            notes: thirdPartyData.notes
          });

          this.thirdPartyDetailsForm
            .get('companyEntityResponses')
            .patchValue(mappedManagingThirdPartyDropdownData);

          if (
            thirdPartyData.type === ThirdPartyType.VENDOR &&
            thirdPartyData.ccpaQuestionIds &&
            thirdPartyData.ccpaQuestionIds.length > 0
          ) {
            thirdPartyData.ccpaQuestionIds.forEach(x =>
              this.updateCCPAQuestion(x)
            );
          }

          this.thirdPartyDetailsForm.get('industrySectors').patchValue(
            thirdPartyData.industrySectors.map(sector => ({
              ...sector,
              label: sector.name
            }))
          );

          this.selectedStartDate = thirdPartyData.contractStartDate;
          this.selectedExpirationDate = thirdPartyData.contractEndDate;
          if (thirdPartyData.contact) {
            this.contactService.setLocationValues(thirdPartyData.contact);
          }
          if (exists(vendor)) {
            this.isDataControllerOrProcessorDisabled = false;
            if (!exists(dataController)) {
              if (vendor.id === ThirdPartyType.PARTNER) {
                this.thirdPartyDetailsForm.patchValue({
                  dataControllerOrProcessor:
                    DATA_CONTROLLER_PROCESSOR_MAP['DATA_CONTROLLER']
                });
              } else if (vendor.id === ThirdPartyType.VENDOR) {
                this.thirdPartyDetailsForm.patchValue({
                  dataControllerOrProcessor:
                    DATA_CONTROLLER_PROCESSOR_MAP['DATA_PROCESSOR']
                });
              }
            }
          }
          this.getSelectBoxData(thirdPartyData);
          this.thirdPartyVersion = thirdPartyData.version;
          this.thirdPartyDataLoaded = true;
          this.createValidityUpdate();
        },
        err => {
          const { status } = err;
          if (status === 404 || status === 403) {
            const message = getErrorMessageNoPermissionsToViewRecord();
            return this.toastService.error(message, null, 5000);
          }
          // [i18n-tobeinternationalized]
          this.toastService.error('Error retrieving third party.');
          console.error(err);
        }
      );
  }
  public setContactValue(contact: ContactInterface) {
    this.contact = contact;
  }

  public onStartDateSelect(dateEvent) {
    this.selectedStartDate = new Date(
      dateEvent.year,
      dateEvent.month - 1,
      dateEvent.day
    );
  }

  public onExpirationDateSelect(dateEvent) {
    this.selectedExpirationDate = new Date(
      dateEvent.year,
      dateEvent.month - 1,
      dateEvent.day
    );
  }

  public isExpirationDateLessThanStartDate() {
    if (this.selectedStartDate && this.selectedExpirationDate) {
      if (this.selectedStartDate >= this.selectedExpirationDate) {
        this.thirdPartyDetailsForm.controls['expirationDate'].setErrors({
          invalid: true
        });
        return true;
      } else {
        this.thirdPartyDetailsForm.controls['expirationDate'].setErrors(null);
        return false;
      }
    }
    return false;
  }

  private selectBoxSelectedValidator(): ValidatorFn {
    return (selected: FormControl) => {
      return !selected.value ||
        selected.value.name === 'Select' ||
        selected.value.id === null
        ? { invalidSelectBox: { valid: false, value: selected.value } }
        : null;
    };
  }

  private getSelectBoxData(data) {
    this.vendorOrPartners = DATA_INVENTORY_OPTIONS;
    this.dataControllerOrProcessors = DATA_CONTROLLER_PROCESSOR_OPTIONS;
    this._locationsData$ = this.thirdPartyService
      .getLocations()
      .subscribe(success => {
        this.allCountries = success;
        this.selectedLocations = data.locations;
      });

    this._industrySectorsData$ = this.thirdPartyService
      .getIndustrySectors()
      .subscribe(success => {
        this.industrySectors = categorize(
          success.map(sector => ({ ...sector, category: sector.sector })),
          'name',
          false
        );
      });
  }

  public createNewContact() {
    const modalRef = this.modalService.open(ContactComponent, {
      windowClass: 'ta-modal-custom-width'
    });

    modalRef.componentInstance.modalTitle = 'Contact';
    modalRef.componentInstance.mode = 'Adding';

    modalRef.result.then(
      success => {
        this.thirdPartyDetailsForm.markAsDirty();
        this.thirdPartyDetailsForm.markAsTouched();
        this.updatedContactValue.emit(this.contact);
      },
      dismiss => {}
    );
  }

  public editContact() {
    this.contactService
      .getContactById(this.contact.id)
      .subscribe(contactResponse => {
        const modalRef = this.modalService.open(ContactComponent, {
          windowClass: 'ta-modal-custom-width'
        });

        modalRef.componentInstance.contact = contactResponse;
        modalRef.componentInstance.mode = 'Editing';

        modalRef.result.then(
          success => {
            this.thirdPartyDetailsForm.markAsDirty();
            this.thirdPartyDetailsForm.markAsTouched();
            this.updatedContactValue.emit(this.contact);
          },
          dismiss => {}
        );
      });
  }

  public managingEntitiesSelectionChange(groupData) {
    this.thirdPartyDetailsForm.markAsDirty();
  }

  public save(): Observable<BaseDomainInterface> {
    if (this.cancelChanges) {
      return of({ id: null, version: null });
    }
    if (
      !this.thirdPartyDetailsForm.dirty ||
      !this.thirdPartyDetailsForm.valid
    ) {
      return of({ id: this.thirdPartyId, version: this.thirdPartyVersion });
    } else {
      this.thirdPartyDetailsForm.markAsPristine();

      const thirdPartyData: any = {};
      thirdPartyData['id'] = this.thirdPartyId;
      thirdPartyData['name'] = this.form.vendorName.value.trim();

      const allItems = [];
      this.thirdPartyDetailsForm
        .get('companyEntityResponses')
        .value.map(group => allItems.push(...group.items));

      thirdPartyData['owningCompanyEntityIds'] = allItems
        .filter(item => item.selected)
        .map(item => item.value);

      thirdPartyData['industrySectorIds'] = this.form.industrySectors.value.map(
        item => item.id
      );

      thirdPartyData['type'] = this.form.vendorOrPartner.value
        ? this.form.vendorOrPartner.value.id
        : null;

      if (
        _.isObject(this.form.customEntityType) &&
        this.form.customEntityType.value
      ) {
        thirdPartyData['type'] = this.form.customEntityType.value;
      }

      // Apply only for type = VENDOR
      if (
        thirdPartyData['type'] === ThirdPartyType.VENDOR &&
        this.form.ccpaQuestionIds.value
      ) {
        const ids = this.form.ccpaQuestionIds.value as string[];
        const finalQuestionIds = ids.filter(id => id.length > 0);
        thirdPartyData['ccpaQuestionIds'] =
          finalQuestionIds.length > 0 ? finalQuestionIds : [];
      }

      thirdPartyData['role'] = this.form.dataControllerOrProcessor.value
        ? this.form.dataControllerOrProcessor.value.id
        : null;

      thirdPartyData['locations'] = this.form.locationForms.value;

      thirdPartyData['contactId'] = this.contact ? this.contact.id : null;
      thirdPartyData['contractStartDate'] = this.selectedStartDate;
      thirdPartyData['contractEndDate'] = this.selectedExpirationDate;
      thirdPartyData['notes'] = this.form.notes.value;
      thirdPartyData['version'] = this.thirdPartyVersion;

      const cleanThirdPartyData = _.omitBy(thirdPartyData, isNullOrUndefined);

      return this.completionStateService.watchCompletionState(
        this.thirdPartyService
          .saveThirdParty(this.thirdPartyId, cleanThirdPartyData)
          .pipe(tap(result => (this.thirdPartyVersion = result.version)))
      );
    }
  }

  canDeactivateTab(deactivationType: DeactivationType): Observable<boolean> {
    return this.save().pipe(
      flatMap(result => {
        if (
          this.thirdPartyId === 'new' &&
          result.id &&
          result.id !== 'new' &&
          deactivationType === 'tabChange'
        ) {
          this.router.navigateByUrl(this.router.url.replace('new', result.id));
        }
        return of(true);
      }),
      catchError(() => of(false))
    );
  }

  public locationChanges(resp) {
    this.thirdPartyDetailsForm.get('locationForms').patchValue(resp.locations);
    this.thirdPartyDetailsForm.markAsDirty();
  }

  public onDropdownTouched(dropdownOpen, name) {
    if (dropdownOpen === false) {
      this.thirdPartyDetailsForm.get(name).markAsTouched();
    }
  }

  private getCCPAQuestionsData() {
    this._ccpaQuestionsData$ = this.thirdPartyService
      .getCCPAQuestions()
      .subscribe(
        success => {
          this.ccpaQuestions = success as CCPAQuestionInterface[];
          this.ccpaQuestions.forEach((element, index) => {
            element.index = index;
            this.addCCPAQuestion(element, index);
          });
        },
        error => {
          this.toastService.error('Error in retrieving CCPA Questions.'); // [i18n-tobeinternationalized]
        }
      );
  }

  get ccpaQuestionIdsFormArray(): FormArray {
    return this.thirdPartyDetailsForm.get('ccpaQuestionIds') as FormArray;
  }

  addCCPAQuestion(question: CCPAQuestionInterface, index: number) {
    const control = this.formBuilder.control(false);
    this.ccpaQuestionIdsFormArray.insert(index, control);
  }

  updateCCPAQuestion(questionId: string) {
    if (!this.ccpaQuestions) {
      this.toastService.error('Error in setting CCPA responses.'); // [i18n-tobeinternationalized]
      return;
    }
    const question = this.ccpaQuestions.find(x => x.id === questionId);
    if (question) {
      const control = this.ccpaQuestionIdsFormArray.controls[question.index];
      control.patchValue(question.id);
    }
  }
}
