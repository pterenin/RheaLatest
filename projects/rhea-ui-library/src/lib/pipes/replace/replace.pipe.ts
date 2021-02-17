import { Pipe, PipeTransform } from '@angular/core';

function isNullOrUndefined(data) {
  return data === null || data === undefined;
}

function exists(data) {
  return !isNullOrUndefined(data);
}

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
