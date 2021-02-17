import {
  FilterOutByArrayAndPropertyPipe,
  MapByPropertyPipe,
  SearchInCollectionByPathsArrayPipe
} from './collection.pipe';

describe('Collection pipes', () => {
  describe('FilterOutByArrayAndPropertyPipe', () => {
    it('Create an instance', () => {
      const pipe = new FilterOutByArrayAndPropertyPipe();
      expect(pipe).toBeTruthy();
    });
  });
  describe('MapByPropertyPipe', () => {
    it('Create an instance', () => {
      const pipe = new MapByPropertyPipe();
      expect(pipe).toBeTruthy();
    });
  });
  describe('SearchInCollectionByPathsArrayPipe', () => {
    it('Create an instance', () => {
      const pipe = new SearchInCollectionByPathsArrayPipe();
      expect(pipe).toBeTruthy();
    });
  });
});
