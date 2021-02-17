import { Pipe, PipeTransform } from '@angular/core';

declare const _: any;

@Pipe({
  name: 'filterByArray'
})
export class FilterByArrayPipe implements PipeTransform {
  transform(value: any, args?: string[], keys?: string[]): any {
    if (args.length > 0) {
      const newValue = [];

      keys.forEach(key => {
        value.forEach(v => {
          args.forEach(arg => {
            if (v[key] === arg) {
              newValue.push(v);
            }
          });
        });
      });

      return newValue;
    }

    return value;
  }
}

@Pipe({
  name: 'filterByIncludeArrayAndPath'
})
export class FilterByIncludeArrayAndPathPipe implements PipeTransform {
  transform(
    data: any[] = [],
    included: string[] = [],
    path: string,
    returnOriginalOnEmptyIncluded = true
  ): any {
    if (Array.isArray(included) && included.length === 0) {
      return returnOriginalOnEmptyIncluded ? data : [];
    }
    if (included.length > 0) {
      return data.filter(item => included.includes(_.get(item, path)));
    }
    return data;
  }
}

@Pipe({
  name: 'filterByIncludeArrayInArrayAndPath'
})
export class FilterByIncludeArrayInArrayAndPathPipe implements PipeTransform {
  transform(
    data: any[] = [],
    included: string[] = [],
    path?: string,
    mapping?: string
  ): any {
    if (Array.isArray(included) && included.length === 0) {
      return data;
    }
    if (included.length > 0) {
      return data.filter(item => {
        // Get source array
        const source =
          _.chain(item)
            .get(path)
            .map(mapping)
            .value() || [];

        // Check each element of the source array against a test function
        // and return true if any element of the source array passes the test
        // function, i.e. is included in provided "included" array
        return source.some(id => included.includes(id));
      });
    }
    return data;
  }
}
