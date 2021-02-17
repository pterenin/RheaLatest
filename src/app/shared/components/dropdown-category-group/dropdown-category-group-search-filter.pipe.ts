import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dropdownCategoryGroupSearchFilter'
})
export class DropdownCategoryGroupSearchFilterPipe implements PipeTransform {
  transform(collection: any, filterTerm: any = ''): any {
    // escape any \ characters to prevent regex error
    const term = filterTerm.replace(/\\/g, '\\\\');
    const pattern = new RegExp(term, 'gi');

    return collection.filter(dropdownItem => pattern.test(dropdownItem.text));
  }
}
