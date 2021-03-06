import { Pipe, PipeTransform } from '@angular/core';

declare const _: any;

@Pipe({
  name: 'dataElementPipe'
})
export class DataElementPipe implements PipeTransform {
  transform(
    data: any,
    action: string,
    payload: any[] = [],
    key: string = 'dataElement'
  ): any {
    if (action === 'lookup') {
      if (!data || data.length === 0) {
        return 'No Data Elements';
      }
      const found = payload.find(item => item.id === data.id);
      if (found) {
        return found.category;
      }
      return '';
    }
    if (action === 'lookup-populate') {
      const [firstElementId] = data;
      const found = payload.find(item => item.id === firstElementId);
      if (found) {
        return found.dataElement;
      }
      return '';
    }
    if (action === 'lookup-stringify') {
      const getDefault = () => 'No Data Elements';
      if (!Array.isArray(data) || data.length === 0) {
        return getDefault();
      }
      if (data.length === 1) {
        const [id] = data;
        const found = payload.find(item => item.id === id);
        if (found) {
          return `${found[key]}`;
        }
        return getDefault();
      }
      if (data.length === 2) {
        const [id1, id2] = data;
        const found1 = payload.find(item => item.id === id1);
        const found2 = payload.find(item => item.id === id2);
        if (found1 && found2) {
          return `${found1[key]} and ${found2[key]}`;
        }
        return getDefault();
      }
      if (data.length > 2) {
        const [id1, id2] = data;
        const found1 = payload.find(item => item.id === id1);
        const found2 = payload.find(item => item.id === id2);
        if (found1 && found2) {
          return `${found1[key]}, ${found2[key]}, +${data.length - 2} more`;
        }
        return getDefault();
      }
      return getDefault();
    }
    if (action === 'stringify') {
      const getDefault = () => 'No Data Elements';
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
