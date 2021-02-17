import { Pipe, PipeTransform } from '@angular/core';

declare const _: any;

@Pipe({
  name: 'capitalizeCasePipe'
})
export class CapitalizeCasePipe implements PipeTransform {
  transform(str: string): string {
    return _.startCase(_.toLower(str));
  }
}
