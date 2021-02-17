import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusThemePipe'
})
export class StatusThemePipe implements PipeTransform {
  transform(status: string): string {
    switch (status) {
      case 'DRAFT':
        return 'inverted';
      case 'REVISE':
        return 'inverted-orange';
      case 'IN REVIEW':
        return 'inverted-violet';
      case 'IN_REVIEW':
        return 'inverted-violet';
      case 'PUBLISH':
        return 'inverted-green';
      case 'PUBLISHED':
        return 'inverted-green';
      default:
        return 'inverted-blue';
    }
  }
}
