import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup
} from '@angular/forms';

declare const _: any;

export const SEARCH_FIELD_DEBOUNCE_MILLISECONDS = 500;

/**
 * Returns an error object if the specified control's value
 *
 * @param control the control that holds the target value
 */
export function noWhitespaceValidator(control: FormControl): object {
  const isWhitespace = (control.value || '').trim().length === 0;
  const isValid = !isWhitespace;
  return isValid ? null : { whitespace: true };
}

/**
 * The FormArray object does not support a direct way to set its child controls.
 * This method will clear them, then set them.
 *
 * @param formArray the target parent to update
 * @param controls the child controls
 */
export function setFormArrayControls(
  formArray: FormArray,
  controls: AbstractControl[]
): void {
  while (formArray.length > 0) {
    formArray.removeAt(0);
  }
  controls.forEach(control => formArray.push(control));
}

/**
 * The FormGroup object does not support setting a value attribute that is an array:
 * instead it replaces the array with the first value of the array.
 * For example, "this.formBuilder.group({myArray:['a','b']})" will store the value myArray: "'a'".
 * This method will retain any array values as arrays.
 *
 * Note that FormGroup.setValue will fail when your child is a form control:
 * The value will become a grand-child form element.
 *
 * See https://github.com/angular/angular/issues/24182
 *
 * @param formArray the target parent to update
 * @param controls the child controls
 */
export function createFormGroup(
  formBuilder: FormBuilder,
  formValue: object
): FormGroup {
  const form = formBuilder.group(formValue);
  const formValueArrays = _.pickBy(formValue, child => Array.isArray(child));
  form.patchValue(formValueArrays);
  return form;
}
