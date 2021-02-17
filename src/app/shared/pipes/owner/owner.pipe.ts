import { Pipe, PipeTransform } from '@angular/core';
import { UtilsClass } from 'src/app/shared/_classes';

declare const _: any;
@Pipe({
  name: 'ownerPipe'
})
export class OwnerPipe implements PipeTransform {
  transform(item: any, action: string): any {
    if (action === 'fullName') {
      return (item.owners || [])
        .map(owner => {
          // include records which only have valid full name
          if (
            owner.fullName &&
            UtilsClass.isNullOrUndefinedOrEmpty(owner.fullName) === false
          ) {
            return owner.fullName;
          }
        })
        .filter(owner => {
          if (UtilsClass.isNullOrUndefinedOrEmpty(owner) === false) {
            return owner;
          }
        });
    }
    if (action === 'idName') {
      return (item.owners || [])
        .map(owner => {
          // include records only have valid id and full name
          if (
            owner &&
            owner.id &&
            owner.fullName &&
            UtilsClass.isNullOrUndefinedOrEmpty(owner.id) === false &&
            !UtilsClass.isNullOrUndefinedOrEmpty(owner.name) === false
          ) {
            return {
              id: owner.id,
              name: owner.fullName
            };
          }
        })
        .filter(owner => {
          if (!(owner === null) || !(owner === undefined)) {
            return owner;
          }
        });
    }
  }
}
