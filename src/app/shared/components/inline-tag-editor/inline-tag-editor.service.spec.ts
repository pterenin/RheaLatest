import { TestBed } from '@angular/core/testing';

import { InlineTagEditorService } from './inline-tag-editor.service';

describe('InlineTagEditorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InlineTagEditorService = TestBed.get(InlineTagEditorService);
    expect(service).toBeTruthy();
  });
});
