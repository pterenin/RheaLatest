import { Pipe, PipeTransform } from '@angular/core';

declare const _: any;

@Pipe({
  name: 'tableSearchFilterPipe'
})
export class TableSearchFilterPipe implements PipeTransform {
  transform(rows: any, properties: string[] = [], searchString?: string): any {
    if (searchString.length === 0) {
      return rows;
    }

    return rows.filter(row => {
      const tested = properties.map(property => {
        const regExp = new RegExp(searchString, 'gi');
        return regExp.test(row[property]);
      });
      return tested.some(test => test === true);
    });
  }
}
