import { Pipe, PipeTransform } from '@angular/core';

declare const _: any;

@Pipe({
  name: 'multipleStringPipe'
})
export class MultipleStringPipe implements PipeTransform {
  transform(data: any = [], action: string = 'stringify'): any {
    if (action === 'stringify') {
      const filtered = data.filter(item => {
        return item !== null && item !== undefined && item !== '';
      });

      const getDefault = () => '';

      if (!Array.isArray(filtered) || filtered.length === 0) {
        return getDefault();
      }

      if (filtered.length === 1) {
        const [first] = filtered;

        if (first.length > 11) {
          return `${first.slice(0, 11)}...`;
        }
        return first;
      }

      if (filtered.length === 2) {
        const [f = '', s = ''] = filtered;

        let first;
        let second;
        if (f.length > 5) {
          first = `${f.slice(0, 5)}...`;
        } else {
          first = f;
        }
        if (s.length > 5) {
          second = `${s.slice(0, 5)}...`;
        } else {
          second = s;
        }

        return `${first}, ${second}`;
      }

      if (filtered.length > 2) {
        const [f = '', s = ''] = filtered;

        let first;
        let second;
        if (f.length > 5) {
          first = `${f.slice(0, 5)}...`;
        } else {
          first = f;
        }
        if (s.length > 5) {
          second = `${s.slice(0, 5)}...`;
        } else {
          second = s;
        }

        // [i18n-tobeinternationalized]
        return `${first}, ${second}, +${filtered.length - 2} more`;
      }

      return getDefault();
    }
  }
}
