import { Pipe, PipeTransform } from '@angular/core';
import { isNullOrUndefined } from 'src/app/shared/utils/basic-utils';

declare const _: any;

@Pipe({
  name: 'entityType'
})
export class EntityTypePipe implements PipeTransform {
  transform(value: string): any {
    if (isNullOrUndefined(value)) {
      return value;
    }

    return _.startCase(
      value
        .replace(new RegExp('^IT[^a-zA-Z0-9]|^IT', 'i'), '')
        .replace('_', ' ')
        .toLowerCase()
    );
  }
}
