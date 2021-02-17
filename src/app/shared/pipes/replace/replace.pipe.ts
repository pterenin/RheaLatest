import { Pipe, PipeTransform } from '@angular/core';
import { exists } from 'src/app/shared/utils/basic-utils';

@Pipe({
  name: 'replace'
})
export class ReplacePipe implements PipeTransform {
  transform(value: string, regexValue: string, replaceValue: string): any {
    return exists(value) && exists(regexValue)
      ? value.replace(new RegExp(regexValue, 'g'), replaceValue)
      : value;
  }
}
