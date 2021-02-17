import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchBy'
})
export class SearchByPipe implements PipeTransform {
  /**
   * isAnd - parameter along with the original filter data. It uses the “isAnd” to
   * toggle between two different matching routines. When “isAnd” is true, the filtering
   * is the same as before. But, when it’s false, the “some” method is used to see if
   * there are any properties that match the key values.
   */
  transform(items: any, filter: any, isAnd: boolean): any {
    if (filter && Array.isArray(items)) {
      const filterKeys = Object.keys(filter);
      if (isAnd) {
        return items.filter(item =>
          filterKeys.reduce(
            (memo, keyName) =>
              (memo && new RegExp(filter[keyName], 'gi').test(item[keyName])) ||
              filter[keyName] === '',
            true
          )
        );
      } else {
        return items.filter(item => {
          return filterKeys.some(keyName => {
            return (
              new RegExp(filter[keyName], 'gi').test(item[keyName]) ||
              filter[keyName] === ''
            );
          });
        });
      }
    } else {
      return items;
    }
  }
}
