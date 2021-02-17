import { Subscription } from 'rxjs';
import { AbstractControl, ValidatorFn } from '@angular/forms';

export class UtilsClass {
  constructor() {}
  public static unSubscribe(subscription: Subscription | Subscription[]) {
    if (subscription) {
      if (Array.isArray(subscription)) {
        subscription.forEach(sub => {
          if (sub) {
            sub.unsubscribe();
          }
        });
      } else {
        if (subscription) {
          subscription.unsubscribe();
        }
      }
    }
  }

  public static updateTemplateString(updateTemplateString, keyValArray: any[]) {
    keyValArray.map(itemKV => {
      updateTemplateString = updateTemplateString.replace(
        itemKV.key,
        itemKV.value
      );
    });
    return updateTemplateString;
  }

  /**
   * Clears Control Validations
   */
  public static clearControlValidations = (
    control: AbstractControl,
    clearValue: boolean = true,
    disableControl: boolean = false
  ) => {
    control.clearAsyncValidators();
    if (clearValue === true) {
      control.setValue(null);
    }
    if (disableControl === true) {
      control.disable();
    }
    control.updateValueAndValidity({ emitEvent: true });
  };

  /**
   * Apply Control Validations
   */
  public static applyControlValidations = (
    control: AbstractControl,
    validators: ValidatorFn | ValidatorFn[]
  ) => {
    control.clearValidators();
    control.setValidators(validators);
    control.enable();
    control.updateValueAndValidity({ emitEvent: true });
  };

  /**
   * returns relative url for path
   * examples: replace last url example: this.getRelativeUrl(state.url, '../details)
   * examples: add to last url example: this.getRelativeUrl(state.url, './more')
   * @param url main url ( state.url etc)
   * @param redirectTo provided relative url
   */
  public static getRelativeUrl(url: string, redirectTo: string) {
    const urlTokens = url.split('/');
    const redirectToTokens = redirectTo.split('/');

    let token = redirectToTokens.shift();

    while (token) {
      if (token !== '.' && token !== '..') {
        redirectToTokens.unshift(token);
        break;
      }

      if (token === '..') {
        urlTokens.pop();
      }

      token = redirectToTokens.shift();
    }

    urlTokens.push(...redirectToTokens);

    return urlTokens.join('/');
  }

  public static isNullOrUndefinedOrEmpty(value: any) {
    return value === undefined || value === null || value === '' ? true : false;
  }

  public static isIE() {
    const ua = window.navigator.userAgent;
    const msie = ua.indexOf('MSIE ');
    const trident = ua.indexOf('Trident/');

    return msie > 0 || trident > 0;
  }
}
