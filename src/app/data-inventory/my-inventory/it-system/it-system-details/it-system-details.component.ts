import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaModal, ToastService } from '@trustarc/ui-toolkit';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { catchError, first, flatMap, tap } from 'rxjs/operators';
import { DataInventoryService } from 'src/app/data-inventory/data-inventory.service';
import { RoutingStateService } from 'src/app/global-services/routing-state.service';
import {
  CategoryItemInterface,
  CategoryLoaderInterface
} from 'src/app/shared/components/async-categorical-dropdown/async-categorical-dropdown.model';
import { ContactComponent } from 'src/app/shared/components/contact/contact.component';
import { ContactInterface } from 'src/app/shared/components/contact/contact.model';
import { ContactService } from 'src/app/shared/components/contact/contact.service';
import {
  CanDeactivateTabInterface,
  DeactivationType
} from 'src/app/shared/components/tabset-guarded/can-deactivate-tab.model';
import { AutoUnsubscribe } from 'src/app/shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { BaseDomainInterface } from 'src/app/shared/models/base-domain-model';
import { exists, isNullOrUndefined } from 'src/app/shared/utils/basic-utils';
import { noWhitespaceValidator } from 'src/app/shared/utils/form-utils';
import {
  RetentionPeriod,
  RetentionPeriodValues
} from 'src/app/shared/_interfaces';
import { CompletionStateService } from '../../../../shared/services/completion-state/completion-state.service';
import { InputIndividualTypeComponent } from '../input-individual-type/input-individual-type.component';
// tslint:disable-next-line:max-line-length
import { ItSystemEditLocationConfirmDialogComponent } from '../it-system-edit-location-confirm-dialog/it-system-edit-location-confirm-dialog.component';
// tslint:disable-next-line:max-line-length
import { ItSystemEditSubjectConfirmDialogComponent } from '../it-system-edit-subject-confirm-dialog/it-system-edit-subject-confirm-dialog.component';
import {
  ItSystemDetailsGetResponse,
  ItSystemDetailsPutRequest
} from './it-system-details.model';
import { ItSystemDetailsFormService } from './it-system-details.service';

declare const _: any;

@AutoUnsubscribe([
  '_validitySubscription$',
  '_contactDetails$',
  '_addContactData$',
  '_updateContactData$',
  '_getContactData$',
  '_itSystemData$',
  '_formChangeSubscription$'
])
@Component({
  selector: 'ta-it-system-details',
  templateUrl: './it-system-details.component.html',
  styleUrls: ['./it-system-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ItSystemDetailsComponent
  implements OnInit, OnDestroy, CanDeactivateTabInterface {
  @Input() public redesign = false;
  @Input() public tabToRedirect: string;
  @Output() public startRedirect = new EventEmitter();
  @Output() public addNewEntity = new EventEmitter<string>();
  @Input() public prePopulatedDetails: any;
  @Input() public prePopulatedDetailsMerge = false;
  @Input() public showRiskFields: boolean;
  @Input() public isAddNewItemLinkAtBottom = false;
  @Input() public iconRequiredColor: 'default' | 'red' = 'default';
  @Input() public iconTypeTooltip: 'information-circle' | 'help' =
    'information-circle';
  @Input() public categoricalDropdownClass = '';
  @Output() public updateRetentionPeriod = new EventEmitter<
    RetentionPeriodValues
  >();
  @ViewChild('inputIndividualType')
  private inputIndividualType: InputIndividualTypeComponent;

  public contact: ContactInterface;
  public countries: any[];
  public dataSubjectVolumes: any[];
  public individualTypes: any[];
  public dataSubjectsWithLocations: any[];
  public selectedLegalEntity;
  public isLegalEntityChanged = false;

  public itSystemName = new FormControl(
    '',
    Validators.compose([
      Validators.required,
      noWhitespaceValidator,
      Validators.maxLength(255)
    ])
  );

  public itSystemDetailsForm: FormGroup;
  public legalEntity = new FormControl(null, Validators.required);
  public locationForms = new FormControl(null, [
    Validators.required,
    Validators.minLength(1)
  ]);
  public itSystemDescription = new FormControl('', Validators.maxLength(1024));
  public notes = new FormControl('', Validators.maxLength(1024));

  public allCountries: any[];
  public selectableCountries: any[];
  public itSystemDetailsData: ItSystemDetailsGetResponse;
  public fullCountriesList: any[];

  public categories = [];
  public selectedCategory = null;

  @Input() exitEventSubject: Subject<any>;
  @Output() updateValidity = new EventEmitter<boolean>(false);
  @Output() updatedFormValue = new EventEmitter();
  @Output() updatedContactValue = new EventEmitter<string[]>();
  @Output() saving = new EventEmitter<boolean>(false);

  public categoryLoaders: CategoryLoaderInterface[] = [
    {
      categoryId: 'PRIMARY_ENTITY',
      requestFunction: searchRequest =>
        this.itSystemDetailsFormService.searchLegalEntities(
          'PRIMARY_ENTITY',
          searchRequest
        ),
      sort: 'name,ASC'
    },
    {
      categoryId: 'COMPANY_AFFILIATE',
      requestFunction: searchRequest =>
        this.itSystemDetailsFormService.searchLegalEntities(
          'COMPANY_AFFILIATE',
          searchRequest
        ),
      sort: 'name,ASC'
    },
    {
      categoryId: 'PARTNER',
      requestFunction: searchRequest =>
        this.itSystemDetailsFormService.searchLegalEntities(
          'PARTNER',
          searchRequest
        ),
      sort: 'name,ASC'
    },
    {
      categoryId: 'VENDOR',
      requestFunction: searchRequest =>
        this.itSystemDetailsFormService.searchLegalEntities(
          'VENDOR',
          searchRequest
        ),
      sort: 'name,ASC'
    },
    {
      categoryId: 'CUSTOMER',
      requestFunction: searchRequest =>
        this.itSystemDetailsFormService.searchLegalEntities(
          'CUSTOMER',
          searchRequest
        ),
      sort: 'name,ASC'
    },
    {
      categoryId: 'SERVICE_PROVIDER',
      requestFunction: searchRequest =>
        this.itSystemDetailsFormService.searchLegalEntities(
          'SERVICE_PROVIDER',
          searchRequest
        ),
      sort: 'name,ASC'
    },
    {
      categoryId: 'BUSINESS_ASSOCIATE',
      requestFunction: searchRequest =>
        this.itSystemDetailsFormService.searchLegalEntities(
          'BUSINESS_ASSOCIATE',
          searchRequest
        ),
      sort: 'name,ASC'
    }
  ];
  public retentionPeriodData: RetentionPeriod;
  public systemContacts: ContactInterface[];

  private _contactDetails$: Subscription;
  private _getContactData$: Subscription;
  private _itSystemData$: Subscription;
  private _onCancelSubscription$: Subscription;
  private _validitySubscription$: Subscription;

  private cancelChanges: boolean;
  private itSystemId: string;
  private version: number;
  private retentionPeriodChanges: RetentionPeriodValues;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private itSystemDetailsFormService: ItSystemDetailsFormService,
    private modalService: TaModal,
    private contactService: ContactService,
    private routingStateService: RoutingStateService,
    private completionStateService: CompletionStateService,
    private dataInventoryService: DataInventoryService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.mapContentItem = this.mapContentItem.bind(this);

    this.itSystemDetailsForm = formBuilder.group({
      id: '',
      version: -1,
      name: this.itSystemName,
      legalEntity: this.legalEntity,
      locationForms: this.locationForms,
      description: this.itSystemDescription,
      individualTypes: [],
      dataSubjectVolume: '',
      dataSubjectTypes: [],
      notes: this.notes,
      contacts: null
    });
    this.itSystemDetailsFormService.clearItSystemDetails();
    this.setServerData();
  }

  ngOnInit() {
    this.retentionPeriodData = null;
    this.systemContacts = [];
    this.createValidityUpdates();

    if (this.exitEventSubject) {
      this.exitEventSubject
        .pipe(
          first(),
          flatMap(() => this.save())
        )
        .subscribe();
    }

    if (this._contactDetails$) {
      this._contactDetails$.unsubscribe();
    }

    this._contactDetails$ = this.contactService.contactSubject.subscribe(
      response => {
        const found = this.systemContacts.findIndex(
          contactItem => contactItem.id === response.id
        );
        if (found > -1) {
          this.systemContacts[found] = response;
        } else {
          this.systemContacts.push(response);
        }
      }
    );

    this.onCancelChanges();

    this.itSystemDetailsForm.valueChanges.subscribe(value => {
      this.updatedFormValue.emit({
        dirty: this.itSystemDetailsForm.dirty,
        valid: this.itSystemDetailsForm.valid,
        value
      });
    });
  }

  ngOnDestroy() {
    this.onCancelChangesSubscriber();
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

  private createValidityUpdates() {
    if (this._validitySubscription$) {
      this._validitySubscription$.unsubscribe();
    }

    this._validitySubscription$ = this.itSystemDetailsForm.statusChanges.subscribe(
      status => {
        const isValid = this.itSystemDetailsForm.valid;

        this.updateValidity.emit(isValid);
        // When it system passed validation we can redirect to target tab
        this.startRedirect.emit(this.tabToRedirect);
      }
    );
  }

  public selectLegalEntity($event: CategoryItemInterface) {
    const newValue = { name: $event.name, id: $event.id };

    this.selectedLegalEntity = this.mapContentItem($event);
    this.itSystemDetailsForm.get('legalEntity').patchValue(newValue);

    if (this.isLegalEntityChanged) {
      this.itSystemDetailsForm.markAsDirty();
    }

    this.isLegalEntityChanged = true;
  }

  public save(): Observable<BaseDomainInterface> {
    if (this.cancelChanges) {
      return of({ id: null, version: null });
    }

    if (!this.itSystemDetailsForm.dirty || !this.itSystemDetailsForm.valid) {
      return of({ id: this.itSystemId, version: this.version });
    } else {
      this.itSystemDetailsForm.markAsPristine();
      this.saving.emit(true);

      const itSystemData = _.omitBy(
        this.createPutRequestObject(),
        isNullOrUndefined
      );
      return this.completionStateService.watchCompletionState(
        this.itSystemDetailsFormService
          .saveItSystem(this.itSystemId, itSystemData)
          .pipe(
            tap(result => {
              this.version = result.version;
              const lastRoute = this.routingStateService.getLatestReplayableHistory();
              if (lastRoute && lastRoute.url) {
                this.routingStateService.pushHistory(lastRoute.url, result);
              }
              this.saving.emit(false);
            })
          )
      );
    }
  }

  public handleRetentionPeriodChange(changes: RetentionPeriodValues): void {
    this.retentionPeriodChanges = changes;
    this.updateRetentionPeriod.emit(changes);
    this.itSystemDetailsForm.markAsDirty();
    this.itSystemDetailsForm.markAsTouched();
  }

  private createPutRequestObject(): ItSystemDetailsPutRequest {
    const newData: ItSystemDetailsPutRequest = { version: this.version };

    newData.id = this.itSystemId === 'new' ? null : this.itSystemId;
    newData.contactIds = this.systemContacts.map(contactItem => contactItem.id);
    newData.name = this.getFormValue('name').trim();
    newData.notes = this.getFormValue('notes');
    newData.legalEntityId = this.getFormValue('legalEntity').id;
    newData.locations = this.getFormValue('locationForms');
    newData.description = this.getFormValue('description');
    newData.dataRetention = this.validateRetentionPeriod()
      ? this.getDataRetentionPutRequest()
      : null;

    newData.dataSubjectTypes = exists(this.getFormValue('dataSubjectTypes'))
      ? this.getFormValue('dataSubjectTypes')
      : [];

    newData.dataSubjectVolumeId = exists(this.getFormValue('dataSubjectVolume'))
      ? this.getFormValue('dataSubjectVolume').id
      : '';

    return newData;
  }

  private validateRetentionPeriod() {
    const retentionPeriodInfo = this.getDataRetentionPutRequest();
    if (
      retentionPeriodInfo &&
      retentionPeriodInfo.type === 'Other' &&
      retentionPeriodInfo.description
    ) {
      return true;
    }

    if (
      retentionPeriodInfo &&
      retentionPeriodInfo.type !== 'Other' &&
      retentionPeriodInfo.value
    ) {
      return true;
    }

    return false;
  }

  private setServerData(): void {
    this.itSystemId = exists(this.route.snapshot)
      ? this.route.snapshot.params.id
      : '';

    this.itSystemDetailsFormService.updateItSystemDetails(
      this.itSystemId,
      true
    );

    if (this._itSystemData$) {
      this._itSystemData$.unsubscribe();
    }

    this._itSystemData$ = this.itSystemDetailsFormService._itSystemData$.subscribe(
      data => {
        if (data) {
          const disableLocationsWithAffectedBPs = () => {
            data.locations.forEach(location => {
              if (location.businessProcessUsage.length) {
                location.disable = true;
              } else {
                location.disable = false;
              }
            });
          };

          const setLocationsWithDisableFalse = () => {
            data.locationsForDropdown.forEach(
              location => (location.disable = false)
            );
          };

          data.hasOwnProperty('locations')
            ? disableLocationsWithAffectedBPs()
            : setLocationsWithDisableFalse();

          this.individualTypes = data.individualTypes;
          this.dataSubjectVolumes = data.individualRecordsVolume;
          this.allCountries = data.locationsForDropdown;
          this.version = data.version;
          this.dataSubjectsWithLocations = data.dataSubjectsWithLocations;
          this.fullCountriesList = data.fullCountryList;

          // If we provide data from input too - we can merge it to server response
          if (this.prePopulatedDetailsMerge) {
            const { data: details = {}, contact } = this.prePopulatedDetails;
            this.retentionPeriodData = details.dataRetention;
            this.itSystemDetailsData = {
              name: details.name || '',
              description: details.description || '',
              notes: details.notes || '',
              legalEntity: details.legalEntity,
              locations: details.locationForms,
              dataSubjectVolume: details.dataSubjectVolume,
              dataSubjectsWithLocations: details.dataSubjectTypes,
              contact: contact
            };
            this.dataSubjectsWithLocations = details.dataSubjectTypes;
          } else {
            this.retentionPeriodData = data.dataRetention;
            this.itSystemDetailsData = data;
          }
          this.populateForm(this.itSystemDetailsData);
        }
      }
    );
  }

  private populateForm(data: ItSystemDetailsGetResponse): void {
    this.setFormValue('name', data.name);
    this.setFormValue('notes', data.notes);
    this.setFormValue('legalEntity', data.legalEntity);
    this.setFormValue('dataSubjectVolume', data.dataSubjectVolume);
    this.setFormValue('description', data.description);

    if (
      data.dataSubjectsWithLocations &&
      data.dataSubjectsWithLocations.length
    ) {
      this.setFormValue('dataSubjectTypes', data.dataSubjectsWithLocations);
    }

    if (data.legalEntity && data.legalEntity.name) {
      this.setLegalEntity(data.legalEntity);
    }

    if (data.locations) {
      this.setFormValue('locationForms', data.locations);
    }

    if (data.contacts) {
      data.contacts.forEach(contactItem => {
        this.contactService.setLocationValues(contactItem);
        this.updatedContactValue.emit(
          this.systemContacts.map(contact => contact.id)
        );
      });
    }
  }

  private setLegalEntity(legalEntity): void {
    this.selectLegalEntity(legalEntity);
  }

  private setFormValue(field: string, value: any): void {
    if (exists(value)) {
      this.itSystemDetailsForm.get(field).setValue(value);
    }
  }

  public onOwnedByOpen(dropdownOpen) {
    if (dropdownOpen === false) {
      this.itSystemDetailsForm.get('legalEntity').markAsTouched();
    }
  }

  public getFormValue(fieldName: string) {
    const field = this.itSystemDetailsForm.get(fieldName);

    return exists(field) ? field.value : null;
  }

  public createNewContact() {
    const modalRef = this.modalService.open(ContactComponent, {
      windowClass: 'ta-modal-custom-width',
      backdrop: 'static'
    });

    modalRef.componentInstance.mode = 'Adding';
    modalRef.componentInstance.style = 'width:500px;';

    modalRef.result.then(
      success => {
        this.itSystemDetailsForm.markAsDirty();
        this.itSystemDetailsForm.markAsTouched();
        this.updatedContactValue.emit(
          this.systemContacts.map(contact => contact.id)
        );
      },
      dismiss => {}
    );
  }

  public editContact(contact) {
    if (this._getContactData$) {
      this._getContactData$.unsubscribe();
    }
    this._getContactData$ = this.contactService
      .getContactById(contact.id)
      .subscribe(contactResponse => {
        const modalRef = this.modalService.open(ContactComponent, {
          windowClass: 'ta-modal-custom-width',
          backdrop: 'static'
        });

        modalRef.componentInstance.contact = contactResponse;
        modalRef.componentInstance.mode = 'Editing';

        modalRef.result.then(
          success => {
            this.itSystemDetailsForm.markAsDirty();
            this.itSystemDetailsForm.markAsTouched();
            this.updatedContactValue.emit(contact);
          },
          dismiss => {}
        );
      });
  }

  public onSubmit() {}

  canDeactivateTab(deactivationType: DeactivationType): Observable<boolean> {
    return this.save().pipe(
      flatMap(result => {
        if (
          this.itSystemId === 'new' &&
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

  public toggleDisabledSubjectType(subjectType) {
    const modalRef = this.modalService.open(
      ItSystemEditSubjectConfirmDialogComponent,
      {
        windowClass: 'ta-edit-subjectType'
      }
    );

    modalRef.componentInstance.subjectType = subjectType;
    modalRef.componentInstance.bpRecords = _.flatten(
      this.itSystemDetailsData.dataSubjectsWithLocations
        .filter(subject => subject.dataSubjectTypeId === subjectType.id)
        .map(subject => subject.businessProcessUsage)
    ).reduce((accumulator, current) => {
      if (!accumulator.some(subject => subject.bpId === current.bpId)) {
        accumulator.push(current);
      }
      return accumulator;
    }, []);

    modalRef.result.then(
      success => {
        if (success) {
          this.itSystemDetailsData.dataSubjectsWithLocations
            .filter(subject => subject.dataSubjectTypeId === subjectType.id)
            .forEach(subject =>
              this.inputIndividualType.toggleSubjectDisabled(
                subject.dataSubjectTypeId
              )
            );
        }
      },
      reason => {}
    );
  }

  public toggleDisabledLocation(countryId) {
    const modalRef = this.modalService.open(
      ItSystemEditLocationConfirmDialogComponent,
      {
        windowClass: 'ta-edit-location'
      }
    );

    let records = _.flatten(
      this.itSystemDetailsData.locations
        .filter(location => location.countryId === countryId)
        .map(location => location.businessProcessUsage)
        .map(bpRecords => bpRecords)
    );

    records = _.uniqBy(records, rec => rec.bpId);

    modalRef.componentInstance.countryId = countryId;
    modalRef.componentInstance.bpRecords = records;

    modalRef.result.then(
      success => {
        if (success) {
          this.itSystemDetailsData.locations.forEach(location => {
            if (location.countryId === countryId) {
              location.disable = false;
            }
          });
          this.itSystemDetailsData.locations = _.cloneDeep(
            this.itSystemDetailsData.locations
          );
        }
      },
      error => {}
    );
  }

  public locationChanges(resp) {
    this.itSystemDetailsForm.get('locationForms').patchValue(resp.locations);
    this.itSystemDetailsForm.markAsDirty();
  }

  public mapContentItem(item: any): CategoryItemInterface {
    return { ...item, categoryId: item.type };
  }

  public onDataSubjectLocationsChanges(dataSubjectLocations) {
    this.itSystemDetailsForm
      .get('dataSubjectTypes')
      .patchValue(this.makeRequestDataSubjectTypes(dataSubjectLocations));

    this.itSystemDetailsForm.markAsDirty();
    this.itSystemDetailsForm.markAsTouched();
  }

  public getCityState(contact) {
    const { city } = contact;

    if (contact.location) {
      const { stateOrProvinceName } = contact.location;
      return stateOrProvinceName ? `${city}, ${stateOrProvinceName}` : city;
    }

    return city;
  }

  public getCountryName(contact) {
    return contact.location ? contact.location.countryName : '';
  }

  public deleteContact(contact: ContactInterface) {
    this.contactService.deleteContactById(contact.id).subscribe(
      res => {
        this.systemContacts = this.systemContacts.filter(
          item => item.id !== contact.id
        );
      },
      err => {
        console.error(err);
      }
    );
  }

  private makeRequestDataSubjectTypes(dataSubjectLocations) {
    const dataSubjectRequest = [];
    dataSubjectLocations.map(dataSubjectLocation => {
      const locations = [];
      dataSubjectLocation.locations.map(country => {
        // Example:
        // If user chooses 36/36 States for India
        //  - we need to represent selections as India country Id only
        // If user chooses 35/36 States for India
        //  - we represent selections as 35x selected state ids for India
        if (
          country.selectedStates &&
          country.stateOrProvinces &&
          country.selectedStates.length > 0 &&
          country.selectedStates.length < country.stateOrProvinces.length
        ) {
          country.selectedStates.map(stateOrProvinceId => {
            locations.push({
              countryId: country.id,
              stateOrProvinceId: stateOrProvinceId
            });
          });
        } else {
          locations.push({
            countryId: country.id,
            stateOrProvinceId: null
          });
        }
      });

      dataSubjectRequest.push({
        dataSubjectTypeId: dataSubjectLocation.dataSubjectTypeId.id,
        locations: locations
      });
    });

    return dataSubjectRequest;
  }

  public handleAddNewEntity(event) {
    this.addNewEntity.emit(event);
  }

  private getDataRetentionPutRequest() {
    const type = this.retentionPeriodChanges
      ? this.retentionPeriodChanges.retentionPeriodUnits
      : null;
    if (!type) {
      return null;
    }
    if (type === 'Other') {
      return {
        type,
        description: this.retentionPeriodChanges.retentionPeriodUnitsOther
      };
    }

    return {
      type,
      value: this.retentionPeriodChanges.retentionPeriodValue
    };
  }
}
