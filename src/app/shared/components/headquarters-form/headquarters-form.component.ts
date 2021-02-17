import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { AutoUnsubscribe } from '../../decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import {
  CountryInterface,
  SelectedCountryInterface,
  SelectedStateOrProvinceInterface,
  StateOrProvinceInterface
} from 'src/app/shared/models/location.model';
import { emailPatternValidator } from 'src/app/shared/utils/basic-utils';
import { CompanyAddressInterface } from 'src/app/shared/_interfaces/rest-api/company-affiliate-controller/company-affiliate-controller';
import { Subscription } from 'rxjs';

declare const _: any;
@AutoUnsubscribe(['_formChangeSubscription$'])
@Component({
  selector: 'ta-headquarters-form',
  templateUrl: './headquarters-form.component.html',
  styleUrls: ['./headquarters-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeadquartersFormComponent implements OnInit, OnDestroy {
  public detailsForm: FormGroup;
  public stateProvinces: StateOrProvinceInterface[] = [];

  public searchTermCountry = '';
  public searchTermStateOrProvince = '';

  public selectedCountry: SelectedCountryInterface;
  public selectedStateOrProvince: SelectedStateOrProvinceInterface;

  public _formChangeSubscription$: Subscription = null;

  @Input() header: string;
  @Output() detailsUpdated = new EventEmitter();

  // Setter/Getter for allCountries input
  private _allCountries: CountryInterface[];
  @Input() set allCountries(value: CountryInterface[]) {
    if (value) {
      this._allCountries = value;
    }
  }
  get allCountries(): CountryInterface[] {
    return this._allCountries;
  }

  // Setter/Getter for details input
  private _details: CompanyAddressInterface;
  @Input() set details(value: CompanyAddressInterface) {
    if (value) {
      this._details = value;
      this.patchForm();
      this.setSelectedLocationData();
    }
  }
  get details(): CompanyAddressInterface {
    return this._details;
  }

  constructor(private formBuilder: FormBuilder) {
    this.detailsForm = formBuilder.group({
      emailAddress: new FormControl(null, [
        Validators.pattern(emailPatternValidator),
        Validators.maxLength(255)
      ]),
      phoneNumber: new FormControl(null, Validators.maxLength(255)),
      address: new FormControl(null, [Validators.maxLength(255)]),
      city: new FormControl(null, [Validators.maxLength(255)]),
      zipCode: new FormControl(null, [Validators.maxLength(20)]),
      country: this.formBuilder.group({
        id: null,
        name: null
      }),
      stateOrProvince: this.formBuilder.group({
        id: null,
        name: null
      })
    });

    this._formChangeSubscription$ = this.detailsForm.valueChanges.subscribe(
      () => {
        this.detailsUpdated.emit(this.detailsForm.value);
      }
    );
  }

  ngOnInit() {}

  public patchForm() {
    this.detailsForm.setValue({
      emailAddress: this.details.email,
      phoneNumber: this.details.phone,
      address: this.details.address,
      city: this.details.city,
      zipCode: this.details.zip,
      country: {
        id: null,
        name: null
      },
      stateOrProvince: {
        id: null,
        name: null
      }
    });
  }

  public setSelectedLocationData() {
    if (this.details.location) {
      const { countryId, stateOrProvinceId } = this.details.location;
      const foundCountry = this.allCountries.find(c => c.id === countryId);

      if (foundCountry) {
        this.handleCountrySelection(foundCountry);

        if (stateOrProvinceId) {
          const stateOrProvinces = foundCountry.stateOrProvinces || [];
          const foundStateOrProvince = stateOrProvinces.find(
            s => s.id === stateOrProvinceId
          );

          if (stateOrProvinceId) {
            this.handleStateOrProvinceSelection(foundStateOrProvince);
          }
        }
      }
    }
  }

  public onSearchCountry(event) {
    this.searchTermCountry = event;
  }

  public onSearchProvince(event) {
    this.searchTermStateOrProvince = event;
  }

  public handleCountrySelection(country) {
    const { id, name, stateOrProvinces } = country;

    this.selectedCountry = {
      id,
      name,
      stateOrProvinces
    };
    this.detailsForm.get('country').setValue({ id, name });
    this.handleStateOrProvinceSelection({ id: null, name: null });
  }

  public handleStateOrProvinceSelection(stateOrProvince) {
    const { id, name } = stateOrProvince;

    this.selectedStateOrProvince = { id, name };
    this.detailsForm.get('stateOrProvince').setValue({ id, name });
  }

  ngOnDestroy() {}
}
