import { async, TestBed } from '@angular/core/testing';
import { Step4SearchFilterPipe } from './step-4-search-filter.pipe';

describe('Step4SearchFilterPipe', () => {
  let filter: Step4SearchFilterPipe;
  let selectedCategoryDataItems: any[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Step4SearchFilterPipe]
    }).compileComponents();

    filter = new Step4SearchFilterPipe();

    selectedCategoryDataItems = [
      {
        id: 1,
        label: 'Recruits',
        isSelected: false
      },
      {
        id: 2,
        label: 'Retirees',
        isSelected: false
      },
      {
        id: 3,
        label: 'Employees',
        isSelected: false
      }
    ];
  }));

  it('create an instance', () => {
    const pipe = new Step4SearchFilterPipe();
    expect(pipe).toBeTruthy();
  });

  it('filter pipe should return items if no search value is given', () => {
    const filtered = filter.transform(selectedCategoryDataItems, '');
    expect(filtered).toEqual(selectedCategoryDataItems);
  });

  it('filter pipe should return empty array if no data items are given', () => {
    const filtered = filter.transform(null, 'test');
    expect(filtered).toEqual([]);
  });

  it('filter pipe should data items array if search value is undefined', () => {
    const filtered = filter.transform(selectedCategoryDataItems, null);
    expect(filtered).toEqual(selectedCategoryDataItems);
  });

  it('filter pipe should filter items if search value is given', () => {
    const filtered = filter.transform(selectedCategoryDataItems, 'Re');
    expect(filtered.length).toBe(2);
  });

  it('filter pipe should return empty array if no search match', () => {
    const filtered = filter.transform(selectedCategoryDataItems, 'wo');
    expect(filtered.length).toBe(0);
  });
});
