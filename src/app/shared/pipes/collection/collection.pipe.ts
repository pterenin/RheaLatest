import { Pipe, PipeTransform } from '@angular/core';

declare const _: any;

@Pipe({
  name: 'filterOutByArrayAndPropertyPipe'
})
export class FilterOutByArrayAndPropertyPipe implements PipeTransform {
  transform(collection, arrayToExclude, property): any {
    return collection.filter(item => !arrayToExclude.includes(item[property]));
  }
}

@Pipe({
  name: 'mapByPropertyPipe'
})
export class MapByPropertyPipe implements PipeTransform {
  transform(collection, property): any {
    return collection.map(item => {
      return item && item[property] ? item[property] : '--';
    });
  }
}

@Pipe({
  name: 'searchInCollectionByPathsArray'
})
export class SearchInCollectionByPathsArrayPipe implements PipeTransform {
  transform(items: any[], searchTerm: string, paths: string[] = []): any {
    if (searchTerm.length === 0) {
      return items;
    }

    return items.filter(item => {
      const tested = paths.map(path => {
        const regExp = new RegExp(searchTerm, 'gi');
        return regExp.test(_.get(item, path));
      });
      return tested.some(test => test === true);
    });
  }
}
