import { Pipe, PipeTransform } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

declare const _: any;

@Pipe({
  name: 'categoryFormSearchFilterByProperties'
})
export class CategoryFormSearchFilterByProperties implements PipeTransform {
  transform(
    ids: string[],
    form: FormGroup,
    propertiesArray?: string[],
    searchString?: string
  ): any {
    ids.forEach(id => {
      (form.get(id) as FormArray).controls.forEach(control => {
        const { value } = control;

        const tested = propertiesArray.map(property => {
          const regExp = new RegExp(searchString, 'gi');
          return regExp.test(value[property]);
        });
      });
    });

    return ids;
  }
}
