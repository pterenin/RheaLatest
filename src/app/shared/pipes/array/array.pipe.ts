import { Pipe, PipeTransform } from '@angular/core';

declare const _: any;

@Pipe({
  name: 'joinByPipe'
})
export class JoinByPipe implements PipeTransform {
  transform(array, char): any {
    return array.join(char);
  }
}
