import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dropdownCategoryGroupItemSelected',
  pure: false
})
export class DropdownCategoryGroupItemSelectedPipe implements PipeTransform {
  transform(items: any[], args?: any): any {
    const filtered = items.filter(item => item.selected);
    return filtered;
  }
}
