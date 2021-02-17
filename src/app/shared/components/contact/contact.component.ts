import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { TaActiveModal } from '@trustarc/ui-toolkit';
import {
  CountryInterface,
  StateOrProvinceInterface
} from '../../models/location.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ContactService } from './contact.service';
import { AutoUnsubscribe } from '../../decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { ContactInterface } from './contact.model';
import { defaultTo } from '../../utils/basic-utils';
import { flatMap } from 'rxjs/operators';

@AutoUnsubscribe([
  '_countries$',
  '_contactRoles$',
  '_contactChanges$',
  '_contactRequest$'
])
@Component({
  selector: 'ta-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContactComponent implements OnInit, OnDestroy {
  @Input() contact: ContactInterface;
  @Input() mode: 'Adding' | 'Editing';
  @Input() useRoles = false;

  public contactForm: FormGroup;
  public countries: CountryInterface[];
  public stateOrProvinces: StateOrProvinceInterface[];
  public country: CountryInterface;
  public stateOrProvince: StateOrProvinceInterface;
  public isContactFormValid: boolean;

  public isLoading = false;
  public roles: any;

  private _countries$: Subscription;
  private _contactRoles$: Subscription;
  private _contactChanges$: Subscription;
  private _contactRequest$: Subscription;

  constructor(
    private activeModal: TaActiveModal,
    private contactService: ContactService
  ) {}

  ngOnInit() {
    this.contactForm = new FormGroup({
      fullName: new FormControl(null, {
        validators: [Validators.maxLength(255)]
      }),
      role: new FormControl(
        null,
        this.useRoles ? Validators.compose([Validators.required]) : null
      ),
      email: new FormControl(null, {
        validators: [
          Validators.pattern(
            '^[_A-Za-z0-9]?(.)+@[a-zA-Z0-9]?(.)+\\.[a-zA-Z0-9]+$'
          ),
          Validators.maxLength(255)
        ],
        updateOn: 'blur'
      }),
      phone: new FormControl(null, {
        validators: [Validators.maxLength(255)]
      }),
      address: new FormControl(null, {
        validators: [Validators.maxLength(1024)]
      }),
      city: new FormControl(null, {
        validators: [Validators.maxLength(128)]
      }),
      zip: new FormControl(null, {
        validators: [Validators.maxLength(32)]
      }),
      country: new FormControl(null),
      stateOrProvince: new FormControl(null)
    });

    if (this.useRoles) {
      this.getContactRoles();
    }

    this.getCountries();
    this.onCountryChange();

    this.isContactFormValid = false;
    this.onContactFormValueChange();
  }

  ngOnDestroy() {}

  public onContactFormValueChange() {
    this.contactForm.valueChanges.subscribe((valueChanged: any) => {
      this.isContactFormValid = this.contactForm.valid;
    });
  }

  private setContactFormValues() {
    if (this.contact) {
      this.contactForm.setValue({
        fullName: this.contact.fullName,
        email: this.contact.email,
        phone: this.contact.phone,
        address: this.contact.address,
        city: this.contact.city,
        zip: this.contact.zip,
        role: this.getRole(),
        country: this.getCountry(),
        stateOrProvince: this.getStateOrProvince()
      });
    }
  }

  private getCountry() {
    return this.contact.location && this.contact.location.countryId
      ? this.countries.find(
          country => this.contact.location.countryId === country.id
        )
      : null;
  }

  private getStateOrProvince() {
    return this.contact.location && this.contact.location.stateOrProvinceId
      ? this.countries
          .find(country => this.contact.location.countryId === country.id)
          .stateOrProvinces.find(
            state => this.contact.location.stateOrProvinceId === state.id
          )
      : null;
  }

  private getRole() {
    return defaultTo(null, this.contact.role);
  }

  public closeModal() {
    this.activeModal.dismiss('Close');
  }

  public onSubmit() {
    if (this._contactRequest$) {
      this._contactRequest$.unsubscribe();
    }

    if (this.mode !== 'Adding' && this.mode !== 'Editing') {
      this.activeModal.close(this.contactForm.value);
      return;
    }

    this.isLoading = true;

    const contactToSave = this.contactService.mapToContactInterface(
      this.contactForm.value,
      this.contact
    );

    const saveAction =
      this.mode === 'Adding'
        ? this.contactService.postNewContact(contactToSave)
        : this.contactService.updateContactById(this.contact.id, contactToSave);

    this._contactRequest$ = saveAction
      .pipe(
        flatMap(response => this.contactService.getContactById(response.id))
      )
      .subscribe(contactData => {
        this.contactService.setLocationValues(contactData);
        this.activeModal.close(this.contactForm.value);
        this.isLoading = false;
      });
  }

  /* *********** Subscription Setup *********** */
  private getCountries() {
    if (this._countries$) {
      this._countries$.unsubscribe();
    }

    this._countries$ = this.contactService
      .getCountries()
      .subscribe(response => {
        this.countries = response;
        this.setContactFormValues();
      });
  }

  public onCountryChange() {
    if (this._contactChanges$) {
      this._contactChanges$.unsubscribe();
    }

    this._contactChanges$ = this.contactForm
      .get('country')
      .valueChanges.subscribe((country: CountryInterface) => {
        this.contactForm.patchValue({
          stateOrProvince: null
        });
        this.stateOrProvinces = country ? country.stateOrProvinces : null;
      });
  }

  public getContactRoles() {
    if (this._contactRoles$) {
      this._contactRoles$.unsubscribe();
    }

    this._contactRoles$ = this.contactService
      .getContactTypes()
      .subscribe(roles => {
        this.roles = roles.map(role => ({ ...role, name: role.type }));
      });
  }
}
