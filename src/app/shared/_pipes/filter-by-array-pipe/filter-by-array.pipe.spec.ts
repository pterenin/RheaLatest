import {
  FilterByArrayPipe,
  FilterByIncludeArrayAndPathPipe,
  FilterByIncludeArrayInArrayAndPathPipe
} from './filter-by-array.pipe';

describe('Filter by array pipes tests', () => {
  describe('FilterByArrayPipe', () => {
    it('create an instance', () => {
      const pipe = new FilterByArrayPipe();
      expect(pipe).toBeTruthy();
    });
  });
  describe('FilterByIncludeArrayAndPathPipe', () => {
    it('create an instance', () => {
      const pipe = new FilterByIncludeArrayAndPathPipe();
      expect(pipe).toBeTruthy();
    });
  });
  describe('FilterByIncludeArrayInArrayAndPathPipe', () => {
    it('create an instance', () => {
      const pipe = new FilterByIncludeArrayInArrayAndPathPipe();
      expect(pipe).toBeTruthy();
    });
  });
});
