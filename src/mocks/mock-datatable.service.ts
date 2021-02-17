import { of } from 'rxjs';

export class MockDatatableService {
  viewSelectedPageItems() {
    return of([]);
  }

  getCurrentSelectedPageItems() {
    return of([]);
  }
}
