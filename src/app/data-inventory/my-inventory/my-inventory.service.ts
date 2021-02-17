import { Injectable } from '@angular/core';

@Injectable()
export class MyInventoryService {
  private page = 1;

  constructor() {}

  setPage(page: number) {
    this.page = page;
  }

  getPage() {
    return this.page;
  }
}
