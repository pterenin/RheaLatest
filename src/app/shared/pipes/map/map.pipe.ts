import { Pipe, PipeTransform } from '@angular/core';

declare const _: any;

@Pipe({
  name: 'valueByKeyMap'
})
export class ValueByKeyMapPipe implements PipeTransform {
  transform(key: string, map: Map<string, any>): any {
    return map.get(key);
  }
}
