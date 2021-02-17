import { Pipe, PipeTransform } from '@angular/core';

declare const _: any;

@Pipe({
  name: 'locationPipe'
})
export class LocationPipe implements PipeTransform {
  transform(data: any, action: string, payload: any[] = [], parameter?): any {
    if (action === 'map') {
      const [firstLocation] = data;
      const { countryName, stateOrProvinceName } = firstLocation || {
        countryName: '',
        stateOrProvinceName: ''
      };
      const label = stateOrProvinceName ? `(${stateOrProvinceName})` : '';
      if (countryName) {
        if (data.length === 1) {
          return `${countryName} ${label}`;
        }
        if (data.length > 1) {
          // [i18n-tobeinternationalized]
          return `${countryName} ${label}, +${data.length - 1} more`;
        }
      }
      // [i18n-tobeinternationalized]
      return 'No Locations';
    }
    if (action === 'map-group') {
      const grouped = _.uniqBy(data, parameter);
      const [firstLocation] = grouped;
      const { countryName } = firstLocation || { countryName: '' };
      if (countryName) {
        if (grouped.length === 1) {
          return `${countryName}`;
        }
        if (grouped.length > 1) {
          // [i18n-tobeinternationalized]
          return `${countryName}, +${grouped.length - 1} more`;
        }
      }
      // [i18n-tobeinternationalized]
      return 'No Locations';
    }
    if (action === 'lookup') {
      if (parameter === 'countriesOnly') {
        const countries = payload.filter(location =>
          data.includes(location.id)
        );
        const [first] = countries;
        if (first) {
          const countryName = first.name || '';
          const regionName = _.get(first, 'globalRegions[0].name', '');
          if (countries.length === 1) {
            return `${countryName} (${regionName})`;
          }
          if (countries.length > 1) {
            // [i18n-tobeinternationalized]
            return `${countryName} (${regionName}), +${countries.length -
              1} more`;
          }
        }
        // [i18n-tobeinternationalized]
        return 'No Locations';
      }
    }
    if (action === 'stringify') {
      // [i18n-tobeinternationalized]
      const getDefault = () => 'No Locations';
      if (!Array.isArray(data) || data.length === 0) {
        return getDefault();
      }
      if (data.length === 1) {
        const [first] = data;
        return `${_.get(first, parameter)}`;
      }
      if (data.length === 2) {
        const [first, second] = data;
        return `${_.get(first, parameter)} and ${_.get(second, parameter)}`;
      }
      // [i18n-tobeinternationalized]
      if (data.length > 2) {
        const [first, second] = data;
        return `${_.get(first, parameter)}, ${_.get(
          second,
          parameter
        )}, +${data.length - 2} more`;
      }
      return getDefault();
    }
    if (action === 'stringify-simple') {
      // [i18n-tobeinternationalized]
      const getDefault = () => 'No Locations';
      if (!Array.isArray(data) || data.length === 0) {
        return getDefault();
      }
      if (data.length === 1) {
        const [first] = data;
        return `${_.get(first, parameter.fieldCountry)} (${_.get(
          first,
          parameter.fieldRegion
        )})`;
      }
      if (data.length > 1) {
        const [first] = data;
        // [i18n-tobeinternationalized]
        return `${_.get(first, parameter.fieldCountry)} (${_.get(
          first,
          parameter.fieldRegion
        )}), +${data.length - 1} more`;
      }

      return getDefault();
    }
  }
}
