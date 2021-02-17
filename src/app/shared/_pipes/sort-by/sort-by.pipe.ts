import { Pipe, PipeTransform } from '@angular/core';
import { sortBy } from 'src/app/shared/_pipes/sort-by/sort-by-utils';

/**
 * Pipe for the sorting function.
 */
@Pipe({
  name: 'sortBy'
})
export class SortByPipe implements PipeTransform {
  public transform(value: any[], reverse: boolean, ...keys: string[]): any[] {
    return sortBy<any>(value.slice(), reverse, ...keys);
  }
}
