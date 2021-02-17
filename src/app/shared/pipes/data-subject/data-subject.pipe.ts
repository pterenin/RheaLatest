import { Pipe, PipeTransform } from '@angular/core';

declare const _: any;

@Pipe({
  name: 'dataSubjectPipe'
})
export class DataSubjectPipe implements PipeTransform {
  transform(
    data: any,
    action: string,
    payload: any[] = [],
    key: string = 'dataSubject'
  ): any {
    if (action === 'stringify') {
      const getDefault = () => 'No Data Subjects';
      if (!Array.isArray(data) || data.length === 0) {
        return getDefault();
      }
      if (data.length === 1) {
        const [first] = data;
        return `${first[key]}`;
      }
      if (data.length === 2) {
        const [first, second] = data;
        return `${first[key]} and ${second[key]}`;
      }
      if (data.length > 2) {
        const [first, second] = data;
        return `${first[key]}, ${second[key]}, +${data.length - 2} more`;
      }
      return getDefault();
    }
  }
}
