import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nonselected'
})
export class NonselectedPipe implements PipeTransform {
  transform(tags = [], selection: any, isMultiSelect: boolean): any {
    if (isMultiSelect) {
      return tags;
    }

    if (selection) {
      tags = tags.filter(option => option.id !== selection.id);
    }
    return tags;
  }
}
