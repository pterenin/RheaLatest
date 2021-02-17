import { Pipe, PipeTransform } from '@angular/core';

declare const _: any;
@Pipe({
  name: 'paginate'
})
export class PaginatePipe implements PipeTransform {
  transform(tableData: any, startingIndex = 0, pageSize = 6): any {
    const paginated = _.chunk(tableData, pageSize);
    return paginated[startingIndex];
  }
}
