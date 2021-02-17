import { Injectable } from '@angular/core';

declare const _: any;
@Injectable({
  providedIn: 'root'
})
export class SystemRecordAddService {
  state: any = {};
  constructor() {}

  setState(state) {
    this.state = state;
  }

  getState() {
    return this.state;
  }

  clearState() {
    this.state = {
      details: {},
      selectedDataElements: [],
      selectedProcessingPurposes: [],
      selectedTags: []
    };
  }
}
