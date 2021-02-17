import { ActivatedRoute, Router } from '@angular/router';
import { AutoUnsubscribe } from 'src/app/shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { BaseDomainInterface } from 'src/app/shared/models/base-domain-model';
import { CategoricalViewComponent } from 'src/app/shared/components/categorical-view/categorical-view.component';
import { DetailsFormService } from './details-form.service';
import { tap, map, flatMap, catchError } from 'rxjs/operators';
import { noWhitespaceValidator } from 'src/app/shared/utils/form-utils';
import { Subscription, Observable, of } from 'rxjs';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  Input
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  CompanyAffiliateDetailsGetResponse,
  CompanyAffiliateDetailsPutRequest,
  CountrySelectBoxInterface,
  SelectBoxInterface
} from './details-form.model';
import { TaModal, ToastService } from '@trustarc/ui-toolkit';
import { ContactComponent } from 'src/app/shared/components/contact/contact.component';
import { ContactService } from 'src/app/shared/components/contact/contact.service';
import {
  ContactInterface,
  ContactTypeInterface
} from 'src/app/shared/components/contact/contact.model';

import {
  DATA_CONTROLLER_PROCESSOR_OPTIONS,
  DATA_CONTROLLER_PROCESSOR_MAP
} from 'src/app/shared/models/controller-process.model';
import { DataInventoryService } from 'src/app/data-inventory/data-inventory.service';
import {
  CanDeactivateTabInterface,
  DeactivationType
} from 'src/app/shared/components/tabset-guarded/can-deactivate-tab.model';
import {
  CategoryItemInterface,
  CategoryLoaderInterface
} from 'src/app/shared/components/async-categorical-dropdown/async-categorical-dropdown.model';
import { ItSystemDetailsFormService } from '../../it-system/it-system-details/it-system-details.service';
import { CompanyAddressInterface } from 'src/app/shared/_interfaces/rest-api/company-affiliate-controller/company-affiliate-controller';

@AutoUnsubscribe([
  '_validitySubscription$',
  '_contactDetails$',
  '_contactTypes$'
])
@Component({
  selector: 'ta-details-form',
  templateUrl: './details-form.component.html',
  styleUrls: ['./details-form.component.scss']
})
export class DetailsFormComponent
  implements OnInit, OnDestroy, CanDeactivateTabInterface {
  @Input() public mode: 'create';
  @Input() public showRiskFields: boolean;
  @Input() public iconRequiredColor: 'default' | 'red' = 'default';
  @Input() public iconTypeTooltip: 'information-circle' | 'help' =
    'information-circle';

  @Output() updatedFormValue = new EventEmitter();
  @Output() updatedContactValue = new EventEmitter<ContactInterface[]>();
  @Output() isDetailsFormValid = new EventEmitter<boolean>(false);

  @ViewChild('industrySectorSelectBox')
  industrySectorSelectBox: CategoricalViewComponent;

  public categoryLoadersFull: CategoryLoaderInterface[] = [
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
    }
  ];

  public categoryLoadersNoCycleRef: CategoryLoaderInterface[] = [
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
        this.detailsFormService
          .legalEntitiesFindAll(this.companyAffiliateId)
          .pipe(
            map(res => {
              const filtered = res.filter(item => {
                if (searchRequest.searchTerm) {
                  const r = new RegExp(searchRequest.searchTerm, 'ig');
                  return (
                    item.id !== this.companyAffiliateId && r.test(item.name)
                  );
                } else {
                  return item.id !== this.companyAffiliateId;
                }
              });
              return {
                content: filtered
              };
            })
          ),
      sort: 'name,ASC'
    }
  ];

  public formIsValid = false;

  public isNextButtonDisabled = false;

  public contact: ContactInterface;
  public contacts: ContactInterface[] = [];
  public contactRoles: ContactTypeInterface[];
  public contactInfoAdded = false;

  private defaultSelectBoxValue = undefined;

  public detailsForm: FormGroup;
  public legalEntity = new FormControl(null);
  public entityType = new FormControl(
    this.defaultSelectBoxValue,
    this.selectBoxSelectedValidator
  );
  public notes = new FormControl('', Validators.maxLength(1024));
  public companyName = new FormControl(
    '',
    Validators.compose([
      Validators.required,
      noWhitespaceValidator,
      Validators.maxLength(255)
    ])
  );
  public locationForms = new FormControl(null, [
    Validators.required,
    Validators.minLength(1)
  ]);
  public companyAddressForm = new FormControl(null);
  public industrySectorForms = new FormControl([]);

  public selectedLegalEntity;
  public dataControllerOrProcessors = DATA_CONTROLLER_PROCESSOR_OPTIONS;
  public entityTypes: SelectBoxInterface[];
  public industrySectors: SelectBoxInterface[];
  public allCountries: CountrySelectBoxInterface[];
  public stateOrProvinces: SelectBoxInterface[];
  public companyAddress: CompanyAddressInterface;
  public selectableCountries;

  public industrySectorOptions;

  public industrySectorOpenByDefault = false;
  public industrySectorStyleClass =
    'company-affiliate-details-categorical-view-component';

  private _formChangeSubscription$: Subscription[] = [];
  private _validitySubscription$: Subscription;
  private _addContactData$: Subscription;
  private _getContactData$: Subscription;
  private _updateContactData$: Subscription;
  private _contactDetails$: Subscription;
  private _contactTypes$: Subscription;
  private _onCancelSubscription$: Subscription;

  public companyAffiliateDetailsGetResponse: CompanyAffiliateDetailsGetResponse;
  private companyAffiliateId: string;
  private version: number;
  private cancelChanges: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private detailsFormService: DetailsFormService,
    private itSystemDetailsFormService: ItSystemDetailsFormService,
    private modalService: TaModal,
    private contactService: ContactService,
    private dataInventoryService: DataInventoryService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.populateForm();
  }

  ngOnInit() {
    this.subscribeToContactsUpdates();

    this._contactTypes$ = this.contactService
      .getContactTypes()
      .subscribe(result => {
        this.contactRoles = result;
      });

    this.onCancelChanges();

    this.detailsForm.valueChanges.subscribe(value => {
      this.updatedFormValue.emit({
        dirty: this.detailsForm.dirty,
        valid: this.detailsForm.valid,
        value
      });
    });
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

  private subscribeToContactsUpdates() {
    this._contactDetails$ = this.contactService.contactSubject.subscribe(
      res => {
        const found = this.contacts.find(contact => contact.id === res.id);

        if (!found) {
          const contact = this.buildContactDetails(res);
          return this.contacts.push(contact);
        }

        this.contacts = this.contacts.map(contact => {
          if (contact.id === res.id) {
            return this.buildContactDetails(res);
          }

          return contact;
        });
      }
    );
  }

  public getCategoryLoaders() {
    const companyAffiliateId = this.route.snapshot.params.id;
    if (companyAffiliateId === 'new' || this.mode === 'create') {
      return this.categoryLoadersFull;
    }
    return this.categoryLoadersNoCycleRef;
  }

  private createValidityUpdates() {
    if (this._validitySubscription$) {
      this._validitySubscription$.unsubscribe();
    }
    this._validitySubscription$ = this.detailsForm.statusChanges.subscribe(
      status => {
        const isValid = this.detailsForm.valid && !this.isNextButtonDisabled;
        this.formIsValid = isValid;
        this.isDetailsFormValid.emit(isValid);
      }
    );
  }

  public selectLegalEntity($event: CategoryItemInterface) {
    const newValue = { name: $event.name, id: $event.id };
    this.selectedLegalEntity = this.mapContentItem($event);
    this.detailsForm.get('legalEntity').patchValue(newValue);
    this.detailsForm.markAsDirty();
  }

  private populateForm() {
    this.detailsForm = this.formBuilder.group({
      id: '',
      version: -1,
      companyName: this.companyName,
      entityType: this.entityType,
      dataControllerOrProcessor: undefined,
      industrySectors: this.industrySectorForms,
      legalEntity: this.legalEntity,
      companyAddress: this.companyAddressForm,
      locationForms: this.locationForms,
      notes: this.notes
    });

    this.companyAffiliateId = this.route.snapshot.params.id;

    this.detailsFormService.clearCompanyAffiliateDetails();

    this.detailsFormService.updateCompanyAffiliateDetails(
      this.companyAffiliateId
    );

    this.createValidityUpdates();

    this.detailsFormService._companyAffiliateData$.subscribe(data => {
      if (data) {
        this.contacts = data.contacts || [];
        this.industrySectorOptions = data.industrySectorOptions;
        this.companyAffiliateDetailsGetResponse = data;
        this.allCountries = data.locationsForDropdown;
        this.companyAddress = data.companyAddress;

        this.getSelectBoxData(data);

        this.version = data.version;

        this.setDynamicDataFromServer(this.companyAffiliateDetailsGetResponse);
      }
    });
  }

  private selectBoxSelectedValidator(selected: FormControl) {
    return !selected.value || selected.value.name === 'Select'
      ? {
          invalidSelectBox: {
            valid: false,
            invalid: true,
            value: selected.value
          }
        }
      : null;
  }

  private setLegalEntity(legalEntity): void {
    this.selectLegalEntity(legalEntity);
  }

  private getSelectBoxData(data) {
    this.entityTypes = data.businessStructureOptions;
    this.industrySectors = data.industrySectorOptions;
  }

  private setDynamicDataFromServer(data: CompanyAffiliateDetailsGetResponse) {
    const companyAffiliateId = this.route.snapshot.params.id;
    const companyNameControl = this.detailsForm.get('companyName');

    if (companyAffiliateId === 'new' || this.mode === 'create') {
      // When "new" or "create" mode we set to form whatever is already entered by User
      companyNameControl.setValue(companyNameControl.value || data.name);
    } else {
      // Otherwise set to form what is being returned by server
      companyNameControl.setValue(data.name);
    }

    if (data.industrySectors && data.industrySectorOptions) {
      const patchValue = data.industrySectors.map(industrySector => ({
        id: industrySector.id,
        label: industrySector.name
      }));

      this.detailsForm.get('industrySectors').patchValue(patchValue);

      // Needed to allow values to correctly map to form
      patchValue.forEach(value => {
        this.industrySectorForms.value.push(value);
      });
    }

    if (data.businessStructure) {
      this.addDataToSelectBoxFromServer(
        'entityType',
        data.businessStructure.businessStructure,
        this.entityTypes
      );
    }

    if (data.entityRole) {
      this.addDataToSelectBoxFromServer(
        'dataControllerOrProcessor',
        DATA_CONTROLLER_PROCESSOR_MAP[data.entityRole].name,
        DATA_CONTROLLER_PROCESSOR_OPTIONS
      );
    }

    if (data.locations) {
      this.detailsForm.get('locationForms').setValue(data.locations);
    }

    if (data.contact) {
      this.contactService.setLocationValues(data.contact);
    }

    if (data.legalEntity) {
      const value = { name: data.legalEntity.name, id: data.legalEntity.id };
      this.detailsForm.get('legalEntity').patchValue(value);
      this.setLegalEntity(data.legalEntity);
    }

    if (data.notes) {
      this.detailsForm.get('notes').setValue(data.notes);
    }
  }

  private addDataToSelectBoxFromServer(
    fieldName: string,
    serverData: string,
    formField: SelectBoxInterface[]
  ) {
    if (serverData) {
      formField.forEach(selectBoxItem => {
        if (selectBoxItem.name === serverData) {
          this.detailsForm.get(fieldName).setValue(selectBoxItem);
        }
      });
    }
  }

  public createNewContact() {
    const modalRef = this.modalService.open(ContactComponent, {
      windowClass: 'ta-modal-custom-width'
    });

    modalRef.componentInstance.mode = 'Adding';
    modalRef.componentInstance.useRoles = true;

    modalRef.result.then(
      success => {
        this.detailsForm.markAsDirty();
        this.detailsForm.markAsTouched();
        this.updatedContactValue.emit(this.contacts);
      },
      dismiss => {}
    );
  }

  public editContact(contact) {
    this.contactService
      .getContactById(contact.id)
      .subscribe(contactResponse => {
        const modalRef = this.modalService.open(ContactComponent, {
          windowClass: 'ta-modal-custom-width'
        });
        modalRef.componentInstance.contact = contactResponse;
        modalRef.componentInstance.mode = 'Editing';
        modalRef.componentInstance.useRoles = true;

        modalRef.result.then(
          success => {
            this.detailsForm.markAsDirty();
            this.detailsForm.markAsTouched();
            this.updatedContactValue.emit(this.contacts);
          },
          dismiss => {}
        );
      });
  }

  public deleteContact(contact: ContactInterface, fromServer = false) {
    this.detailsForm.markAsDirty();

    if (!fromServer) {
      return (this.contacts = this.contacts.filter(
        item => item.id !== contact.id
      ));
    }

    this.contactService.deleteContactById(contact.id).subscribe(
      res => {
        this.contacts = this.contacts.filter(item => item.id !== contact.id);
      },
      err => {
        console.error(err);
      }
    );
  }

  public onSubmit() {}

  public save(): Observable<BaseDomainInterface> {
    if (this.cancelChanges) {
      return of({ id: null, version: null });
    }
    if (!this.detailsForm.dirty) {
      return of({ id: this.companyAffiliateId, version: this.version });
    }

    const payload = this.buildPutRequest();
    return this.detailsFormService
      .saveCompanyAffiliate(this.companyAffiliateId, payload)
      .pipe(tap(result => (this.version = result.version)));
  }

  private buildPutRequest(): CompanyAffiliateDetailsPutRequest {
    const form = this.detailsForm;
    const name = (form.get('companyName').value || '').trim();
    const entityRole = (form.get('dataControllerOrProcessor').value || {}).id;
    const legalEntityId = (form.get('legalEntity').value || {}).id;
    const businessStructureId = (form.get('entityType').value || {}).id;
    const note = form.get('notes').value || '';
    const contactIds = (this.contacts || []).map(contact => contact.id);
    const locations = form.get('locationForms').value;
    const companyAddress = this.getCompanyAddress(this.companyAddressForm);
    const industrySectorIds = (form.get('industrySectors').value || []).map(
      item => item.id
    );

    return {
      name,
      industrySectorIds,
      entityType: '',
      contactIds,
      note,
      companyAddress,
      locations,
      businessStructureId,
      entityRole,
      legalEntityId,
      version: this.version
    };
  }

  private getCompanyAddress(form) {
    const value = form.value ? form.value : {};
    const {
      emailAddress,
      phoneNumber,
      address,
      city,
      zipCode,
      country,
      stateOrProvince
    } = value;

    const companyAddress: CompanyAddressInterface = {
      email: emailAddress ? emailAddress.trim() : null,
      phone: phoneNumber ? phoneNumber.trim() : null,
      address: address ? address.trim() : null,
      city: city ? city.trim() : null,
      zip: zipCode ? zipCode.trim() : null,
      location: null
    };

    if (country && country.id) {
      companyAddress.location = {
        countryId: country.id
      };
      if (stateOrProvince && stateOrProvince.id) {
        companyAddress.location.stateOrProvinceId = stateOrProvince.id;
      }
    }

    return companyAddress;
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

  canDeactivateTab(deactivationType: DeactivationType): Observable<boolean> {
    return this.save().pipe(
      flatMap(result => {
        if (
          this.companyAffiliateId === 'new' &&
          result.id &&
          result.id !== 'new' &&
          deactivationType === 'tabChange'
        ) {
          this.router.navigateByUrl(this.router.url.replace('new', result.id));
        }
        return of(true);
      }),
      catchError(err => {
        const { status } = err;
        if (status === 403) {
          // [i18n-tobeinternationalized]
          this.toastService.error(
            'You do not have the access permissions needed to edit this record',
            null,
            5000
          );
        }

        return of(false);
      })
    );
  }

  public locationChanges(resp) {
    this.detailsForm.get('locationForms').patchValue(resp.locations);
    this.detailsForm.markAsDirty();
  }

  public mapContentItem(item: any): CategoryItemInterface {
    return { ...item, categoryId: item.type };
  }

  public onDropdownTouched(dropdownOpen, name) {
    if (dropdownOpen === false) {
      this.detailsForm.get(name).markAsTouched();
    }
  }

  public getContactRole(contact) {
    if (contact) {
      return contact.role;
    }
  }

  public getCountryName(contact) {
    return contact.location ? contact.location.countryName : '';
  }

  public getCityState(contact) {
    const { city } = contact;

    if (contact.location) {
      const { stateOrProvinceName } = contact.location;
      return stateOrProvinceName ? `${city}, ${stateOrProvinceName}` : city;
    }

    return city;
  }

  private buildContactDetails(data: ContactInterface) {
    return {
      address: data.address,
      city: data.city,
      email: data.email,
      fullName: data.fullName,
      id: data.id,
      location: data.location,
      phone: data.phone,
      role: data.role,
      version: data.version,
      zip: data.zip
    };
  }

  public handleDetailsUpdated(event) {
    this.companyAddressForm.setValue(event);
    this.detailsForm.get('companyAddress').setValue(event);
    this.detailsForm.markAsDirty();
  }
}
