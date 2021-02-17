import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {
  transform(tags: any, filterTerm?: string, propKey?: string): any {
    if (!filterTerm || !filterTerm.length) {
      return tags;
    }
    const result = [];
    const searchValue = filterTerm.toLowerCase().trim() || '';
    tags.forEach(tag => {
      const testString = propKey ? tag[propKey] : tag.tag;
      const testStringNormilized = testString
        ? testString.toLowerCase().trim()
        : '';
      if (testStringNormilized.indexOf(searchValue) !== -1) {
        result.push(tag);
      }
    });
    return result;
  }
}
