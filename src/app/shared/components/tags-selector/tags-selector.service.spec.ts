import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { TagsSelectorService } from './tags-selector.service';
import { HttpClient } from '@angular/common/http';

describe('TagsSelectorService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpClient, TagsSelectorService]
    })
  );

  it('should be created', () => {
    const service: TagsSelectorService = TestBed.get(TagsSelectorService);
    expect(service).toBeTruthy();
  });
});
