import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { of, Subscription, zip } from 'rxjs';
import { groupBy, map, mergeMap, toArray } from 'rxjs/operators';
import {
  LocationFieldInterface,
  LocationForRequest
} from 'src/app/data-inventory/my-inventory/it-system/it-system-details/it-system-details.model';
import { exists } from 'src/app/shared/utils/basic-utils';
import { AutoUnsubscribe } from '../../decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { CountryInterface } from '../../models/location.model';

declare const _: any;
@AutoUnsubscribe(['_formChangeSubscription$'])
@Component({
  selector: 'ta-input-location',
  templateUrl: './input-location.component.html',
  styleUrls: ['./input-location.component.scss']
})
export class InputLocationComponent implements OnInit, OnDestroy, OnChanges {
  public inputLocationForms: FormGroup;
  public locationForms: FormArray;
  public disabled = false;
  public selectableCountries: any[];

  @Input() public iconRequiredColor: 'default' | 'red' = 'default';
  @Input() public iconTypeTooltip: 'information-circle' | 'help' =
    'information-circle';
  @Input() header: String;
  @Input() showRiskFields: boolean;
  @Input() allCountries: any[] = [];
  @Input() locations: any[] = [];
  @Output() locationChanges = new EventEmitter();
  @Output() toggleDisabled = new EventEmitter();

  private _formChangeSubscription$: Subscription[] = [];

  constructor(private formBuilder: FormBuilder) {
    this.inputLocationForms = formBuilder.group({
      locationForms: this.formBuilder.array([])
    });

    this.locationForms = this.inputLocationForms.get(
      'locationForms'
    ) as FormArray;

    this.locationForms.valueChanges.subscribe(selections =>
      this.setSelectableCountries(selections)
    );

    this.clearFormLocationsArray();
  }

  ngOnInit() {}

  ngOnChanges() {
    this.allCountries = this.allCountries ? this.allCountries : [];
    this.locations = this.locations ? this.locations : [];
    this.setLocationsFromServerData(this.locations);
  }

  ngOnDestroy() {}

  public editLocationUsedByBP(location) {
    this.toggleDisabled.emit(location.country.id);
  }

  private emitValue() {
    this.locationChanges.emit({
      isValid: this.inputLocationForms.valid,
      locations: this.getLocationsForRequest()
    });
  }

  private mapToLocationInterface(countryId: string, statesArray: any) {
    const refCountryRecord = this.allCountries.find(
      country => country.id === countryId
    );

    const newLocation: LocationFieldInterface = {
      id: statesArray[0].id,
      disable: statesArray[0].disable,
      country: refCountryRecord,
      state: null
    };

    let refStateRecords = statesArray.map(stateToSelect => {
      const associatedState = refCountryRecord.stateOrProvinces.find(
        state => state.id === stateToSelect.stateOrProvinceId
      );
      return associatedState;
    });

    refStateRecords = refStateRecords
      ? refStateRecords.filter(el => el != null)
      : null;

    newLocation.state =
      refStateRecords && refStateRecords.length > 0 ? refStateRecords : null;
    return newLocation;
  }

  private setLocationsFromServerData(locations): void {
    // clear all form groups and subscriptions;
    this._formChangeSubscription$.forEach(x => x.unsubscribe());
    this._formChangeSubscription$ = [];
    this.locationForms.reset();
    this.clearFormLocationsArray();
    this.inputLocationForms.updateValueAndValidity();

    if (locations.length === 0) {
      this.addEmptyLocationRow(false);
    } else {
      const forms: FormGroup[] = [];
      of(locations)
        .pipe(
          map(rawResponse => {
            return rawResponse.map(row => {
              return {
                countryId: row.countryId,
                stateOrProvinceId: row.stateOrProvinceId,
                id: row.id,
                disable: row.disable
              };
            });
          }),
          mergeMap(mm => mm),
          groupBy((row: any) => row.countryId),
          mergeMap(group => zip(of(group.key), group.pipe(toArray()))),
          map(groupRecord => {
            return this.mapToLocationInterface(groupRecord[0], groupRecord[1]);
          })
        )
        .subscribe(data => {
          // states grouped by countryId
          this.clearFormLocationsArray();
          forms.push(this.createLocationForm(data));
        });

      forms.map(formGroup => {
        this.locationForms.push(formGroup);
      });
      this.inputLocationForms.updateValueAndValidity();
    }
  }

  private getLocationsForRequest() {
    const result: LocationForRequest[] = [];
    this.locationForms.value.forEach(location => {
      if (Array.isArray(location.state) && location.state.length > 0) {
        location.state.forEach(state => {
          const resultItem: LocationForRequest = {};
          resultItem.countryId = location.country.id;
          resultItem.stateOrProvinceId = state ? state.id : null;
          result.push(resultItem);
        });
      } else {
        if (location.country && location.country.name) {
          const resultItem: LocationForRequest = {};
          resultItem.countryId = location.country.id;
          result.push(resultItem);
        }
      }
    });
    return result;
  }

  public onLocationTouched(dropdownOpen, index) {
    if (dropdownOpen === false) {
      this.locationForms
        .get(String(index))
        .get('country')
        .markAsTouched();

      this.emitValue();
    }
  }

  public onStateTouched() {
    this.emitValue();
  }

  private createLocationForm(newLocation: LocationFieldInterface): FormGroup {
    const newLocationWithValidation = {
      ...newLocation,
      country: new FormControl(newLocation.country, Validators.required),
      state: new FormControl(newLocation.state) // Needed to allow array values to map properly
    };

    const newLocationForm = this.formBuilder.group(newLocationWithValidation);

    this._formChangeSubscription$.push(
      newLocationForm.get('country').valueChanges.subscribe(result => {
        newLocationForm.get('state').patchValue('');
      })
    );

    return newLocationForm;
  }

  public addEmptyLocationRow(pushValue): void {
    const newLocation = {
      disable: false,
      country: null,
      state: null,
      id: _.uniqueId('location-')
    };

    this.locationForms.push(this.createLocationForm(newLocation));
    if (pushValue) {
      this.emitValue();
    }
  }

  private clearFormLocationsArray(): void {
    if (this.locationForms) {
      this.locationForms.value.forEach((location, index) => {
        this.locationForms.removeAt(index);
      });
    }
  }

  public removeLocation(index): void {
    this.locationForms = this.inputLocationForms.get(
      'locationForms'
    ) as FormArray;

    this.locationForms.removeAt(index);
    this.locationForms.markAsDirty();
    this.locationForms.markAsTouched();
    this.emitValue();
  }

  private setSelectableCountries(selectedLocations) {
    this.selectableCountries = this.allCountries.filter(loc => {
      const targetId = loc.country !== undefined ? loc.country.id : loc.id;
      return !selectedLocations.find(
        selLoc =>
          (selLoc.country !== null ? selLoc.country.id : selLoc.id) === targetId
      );
    });
  }

  public getStates(country: any) {
    if (exists(country) && exists(country.stateOrProvinces)) {
      const selectedStateIds = this.locationForms.value
        .filter(loc => exists(loc.state))
        .map(loc => loc.state.id);

      return country.stateOrProvinces.filter(
        stateOrProvince => !selectedStateIds.includes(stateOrProvince.id)
      );
    }

    return [];
  }
}
