import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  OnDestroy
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import { TaActiveModal } from '@trustarc/ui-toolkit';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { CompanyEntitiesControllerService } from 'src/app/shared/_services/rest-api';
import {
  EntityContentInterface,
  BusinessProcessOwnerInterface,
  BusinessProcessOwnerLocationInterface
} from 'src/app/shared/_interfaces/rest-api';

import {
  emailPatternValidator,
  isNullOrUndefined
} from 'src/app/shared/utils/basic-utils';
import { noWhitespaceValidator } from 'src/app/shared/utils/form-utils';
import { ContactService } from '../../../../../../shared/components/contact/contact.service';
import {
  CountryInterface,
  StateOrProvinceInterface
} from '../../../../../../shared/models/location.model';
import { AutoUnsubscribe } from '../../../../../../shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';

@AutoUnsubscribe(['_getDropDownData$', '_ownerContactChanges$'])
@Component({
  selector: 'ta-add-edit-modal',
  templateUrl: './add-edit-modal.component.html',
  styleUrls: ['./add-edit-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddEditOwningOrganizationContactsModalComponent
  implements OnInit, OnDestroy {
  @Input() public isEditModal: boolean;
  @Input() public ownerData: BusinessProcessOwnerInterface;
  @Input() public showSpinner: Observable<boolean>;
  @Input() public ownersCount: Observable<number>;
  @Output() public closeModalEvent: EventEmitter<string>;
  @Output() public addOwnerEvent: EventEmitter<BusinessProcessOwnerInterface>;
  @Output() public iconRequiredColor: 'default' | 'red' = 'default';

  public bpAddEditOwner: FormGroup;
  public companySubsidiaryAffiliate: FormControl;
  public role: FormControl;
  public ownerName: FormControl;
  public ownerEmail: FormControl;
  public ownerPhone: FormControl;
  public ownerAddress: FormControl;
  public ownerCity: FormControl;
  public ownerZip: FormControl;

  public ownerCountry: FormControl;
  public ownerStateOrProvince: FormControl;

  public department: FormControl;
  public version: FormControl;
  public primary: FormControl;
  public organizations: EntityContentInterface[];
  public selectedDepartment: string;
  public departments: EntityContentInterface[];
  public owningEntityRoles: String[];
  public currentOwner: BusinessProcessOwnerInterface;
  public isShowingSpinner: boolean;
  public totalOwners: number;
  public countries: CountryInterface[];
  public stateOrProvinces: StateOrProvinceInterface[];

  private _getDropDownData$: Subscription;
  private _ownerContactChanges$: Subscription;

  private lastEndIndex = 0;
  private currentUserPage = 0;
  private endOfListReached = false;
  private loadingList = false;
  private userBuffer = 33;

  constructor(
    public activeModal: TaActiveModal,
    private formBuilder: FormBuilder,
    private companyEntitiesControllerService: CompanyEntitiesControllerService,
    private contactService: ContactService
  ) {
    this.closeModalEvent = new EventEmitter<string>();
    this.addOwnerEvent = new EventEmitter<BusinessProcessOwnerInterface>();
    this.initializeFormControls();
    this.bpAddEditOwner = this.formBuilder.group({
      companySubsidiaryAffiliate: this.companySubsidiaryAffiliate,
      role: this.role,
      ownerName: this.ownerName,
      ownerEmail: this.ownerEmail,
      ownerPhone: this.ownerPhone,
      ownerAddress: this.ownerAddress,
      ownerCity: this.ownerCity,
      ownerZip: this.ownerZip,
      ownerCountry: this.ownerCountry,
      ownerStateOrProvince: this.ownerStateOrProvince,
      department: this.department,
      version: 0,
      primary: this.primary
    });

    this.initListsValues();
  }

  public ngOnInit(): void {
    this.getDropDownData();
    this.onCountryChange();
    this.showSpinner.subscribe(show => {
      this.isShowingSpinner = show;
    });

    this.ownersCount.subscribe(total => {
      this.totalOwners = total;
    });
  }

  public closeModal(reason: string): void {
    this.closeModalEvent.emit(reason);
  }

  public onSubmit(): void {
    const companyAffiliate = this.bpAddEditOwner.get(
      'companySubsidiaryAffiliate'
    ).value;
    const owner: BusinessProcessOwnerInterface = {
      id: !this.isEditModal ? null : this.ownerData.id,
      companyId:
        companyAffiliate && companyAffiliate.id ? companyAffiliate.id : null,
      companyName:
        companyAffiliate && companyAffiliate.name
          ? companyAffiliate.name
          : null,
      departmentName: this.bpAddEditOwner.get('department').value
        ? this.bpAddEditOwner.get('department').value.name
        : null,
      departmentId: this.bpAddEditOwner.get('department').value
        ? this.bpAddEditOwner.get('department').value.id
        : null,
      email: this.bpAddEditOwner.get('ownerEmail').value,
      fullName: this.bpAddEditOwner.get('ownerName').value.trim(),
      phone: this.bpAddEditOwner.get('ownerPhone').value,
      address: this.bpAddEditOwner.get('ownerAddress').value,
      city: this.bpAddEditOwner.get('ownerCity').value,
      zip: this.bpAddEditOwner.get('ownerZip').value,
      location: this.getLocation(this.bpAddEditOwner.value),
      role: this.bpAddEditOwner.get('role').value,
      version: this.bpAddEditOwner.get('version').value,
      primaryOwner: this.bpAddEditOwner.get('primary').value
    };
    if (owner.id === null) {
      delete owner.id;
    }
    this.addOwnerEvent.emit(owner);
  }

  ngOnDestroy() {}

  private getLocation(formValue: any): BusinessProcessOwnerLocationInterface {
    const country = formValue.ownerCountry;
    const state = formValue.ownerStateOrProvince;
    return country
      ? {
          countryId: country.id || null,
          stateOrProvinceId: state ? state.id : null,
          globalRegionId: country.globalRegions[0]
            ? country.globalRegions[0].id
            : null
        }
      : null;
  }

  private initializeFormControls(): void {
    this.companySubsidiaryAffiliate = new FormControl('', {
      validators: [Validators.required]
    });

    this.role = new FormControl('');
    this.ownerName = new FormControl('', {
      validators: [
        Validators.required,
        Validators.maxLength(255),
        noWhitespaceValidator
      ]
    });

    this.ownerEmail = new FormControl('', {
      validators: [
        Validators.pattern(emailPatternValidator),
        Validators.maxLength(255)
      ],
      updateOn: 'blur'
    });
    this.ownerPhone = new FormControl('', {
      validators: [Validators.maxLength(255)],
      updateOn: 'blur'
    });
    this.ownerAddress = new FormControl('', {
      validators: [Validators.maxLength(1024)],
      updateOn: 'blur'
    });
    this.ownerCity = new FormControl('', {
      validators: [Validators.maxLength(128)],
      updateOn: 'blur'
    });
    this.ownerZip = new FormControl('', {
      validators: [Validators.maxLength(32)],
      updateOn: 'blur'
    });
    this.ownerCountry = new FormControl('');
    this.ownerStateOrProvince = new FormControl('');
    this.department = new FormControl('');
    this.primary = new FormControl('');
  }

  private getDropDownData() {
    if (this._getDropDownData$) {
      this._getDropDownData$.unsubscribe();
    }
    this._getDropDownData$ = forkJoin([
      this.companyEntitiesControllerService.getCompanyEntities(),
      this.companyEntitiesControllerService.getDepartments(),
      this.companyEntitiesControllerService.getOwningEntityRoles(),
      this.contactService.getCountries()
    ]).subscribe(
      ([organizations, departments, owningEntityRoles, countries]) => {
        this.organizations = organizations.content;
        this.departments = departments;
        this.owningEntityRoles = owningEntityRoles.sort();
        this.countries = countries;

        this.loadOwnerData();
      },
      err => console.log('Error: ', err)
    );
  }

  private initListsValues(): void {
    this.organizations = [];
    this.departments = [];
    this.owningEntityRoles = [];
  }

  private loadOwnerData(): void {
    if (this.isEditModal && !isNullOrUndefined(this.ownerData)) {
      const hasCompany = !isNullOrUndefined(this.ownerData.companyId);
      const hasDepartment = !isNullOrUndefined(this.ownerData.departmentId);

      this.bpAddEditOwner.patchValue({
        id: this.ownerData.id,
        companySubsidiaryAffiliate: hasCompany
          ? {
              name: this.ownerData.companyName,
              id: this.ownerData.companyId
            }
          : null,
        ownerName: this.ownerData.fullName,
        ownerEmail: this.ownerData.email,
        ownerPhone: this.ownerData.phone,
        ownerAddress: this.ownerData.address,
        ownerCity: this.ownerData.city,
        ownerCountry: this.getCountry(),
        ownerStateOrProvince: this.getStateOrProvince(),
        ownerZip: this.ownerData.zip,
        version: this.ownerData.version,
        department: hasDepartment
          ? {
              name: this.ownerData.departmentName,
              id: this.ownerData.departmentId
            }
          : null,
        role: this.ownerData.role,
        primary: this.ownerData.primaryOwner
      });
    }
  }

  private getCountry(): CountryInterface {
    const loc = this.ownerData.location;
    const country =
      loc && loc.countryId
        ? this.countries.find(c => loc.countryId === c.id)
        : null;
    return country;
  }

  private getStateOrProvince(): StateOrProvinceInterface {
    const loc = this.ownerData.location;
    return loc && loc.stateOrProvinceId
      ? this.getCountry().stateOrProvinces.find(
          s => loc.stateOrProvinceId === s.id
        )
      : null;
  }

  private onCountryChange(): void {
    if (this._ownerContactChanges$) {
      this._ownerContactChanges$.unsubscribe();
    }

    this._ownerContactChanges$ = this.bpAddEditOwner
      .get('ownerCountry')
      .valueChanges.subscribe((country: CountryInterface) => {
        this.bpAddEditOwner.patchValue({
          ownerStateOrProvince: null
        });
        this.stateOrProvinces = country ? country.stateOrProvinces : null;
      });
  }

  public requestForInfiniteList($event) {
    const end = $event.endIndex;
    const hasReachedBufferPoint =
      end &&
      end >= this.organizations.length - this.userBuffer &&
      end >= this.lastEndIndex;
    this.lastEndIndex = end;
    if (
      hasReachedBufferPoint &&
      !this.endOfListReached &&
      end !== -1 &&
      !this.loadingList
    ) {
      this.loadingList = true;
      this.currentUserPage++;
      this.companyEntitiesControllerService
        .getCompanyEntities(this.currentUserPage)
        .subscribe(organizationsResponse => {
          const organizationsToAdd = organizationsResponse.content;
          this.organizations = [...this.organizations, ...organizationsToAdd];
          this.loadingList = false;
          this.endOfListReached = organizationsResponse.last;
        });
    }
  }
}
