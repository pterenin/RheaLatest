import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categoryFilter'
})
export class Step4CategoryFilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }

    if (!searchText) {
      return items;
    }

    return items.filter(item => {
      return item.items.some(i =>
        i.label.toLowerCase().includes(searchText.toLowerCase())
      );
    });
  }
}
