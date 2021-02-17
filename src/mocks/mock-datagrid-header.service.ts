import { of } from 'rxjs';

export class MockDatagridHeaderService {
  viewSelectedPageItems() {
    return of([]);
  }

  getCurrentSelectedPageItems() {
    return of([]);
  }

  getDeleteIndividualBpSubject() {
    return of([]);
  }
}
