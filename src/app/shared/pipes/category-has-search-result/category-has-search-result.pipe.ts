import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categoryHasSearchResult'
})
export class CategoryHasSearchResultPipe implements PipeTransform {
  transform(categories: any, filterTerm?: string): any {
    if (!filterTerm) {
      return categories;
    }

    const regex = new RegExp(filterTerm, 'g');
    return categories.filter(category => {
      const hasMatchingItems = category.items.filter(item => {
        return regex.test(item.text);
      });

      if (hasMatchingItems.length) {
        return category;
      }
    });
  }
}
