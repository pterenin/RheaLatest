import { async, TestBed } from '@angular/core/testing';
import { Step4CategoryFilterPipe } from './step-4-category-filter.pipe';

describe('SearchFilterPipe', () => {
  let filter: Step4CategoryFilterPipe;
  let dataItems: any[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Step4CategoryFilterPipe]
    }).compileComponents();

    filter = new Step4CategoryFilterPipe();

    dataItems = [
      {
        id: 1,
        label: 'Category 1',
        items: [
          {
            id: 1,
            label: 'Recruits',
            isSelected: false
          },
          {
            id: 2,
            label: 'Retirees',
            isSelected: false
          }
        ]
      },
      {
        id: 1,
        label: 'Category 2',
        items: [
          {
            id: 1,
            label: 'Sponsors',
            isSelected: false
          },
          {
            id: 2,
            label: 'Contractors',
            isSelected: false
          }
        ]
      }
    ];
  }));

  beforeEach(() => {});

  it('create an instance', () => {
    const pipe = new Step4CategoryFilterPipe();
    expect(pipe).toBeTruthy();
  });

  it('filter pipe should return all categories if no search value is given', () => {
    const filtered = filter.transform(dataItems, '');
    expect(filtered).toEqual(dataItems);
  });

  it('filter pipe should return empty array if no data items are given', () => {
    const filtered = filter.transform(null, 'test');
    expect(filtered).toEqual([]);
  });

  it('filter pipe should data items array if search value is undefined', () => {
    const filtered = filter.transform(dataItems, null);
    expect(filtered).toEqual(dataItems);
  });

  it('filter pipe should filter categories if search value is given', () => {
    const filtered = filter.transform(dataItems, 'Re');
    expect(filtered.length).toBe(1);
  });

  it('filter pipe should filter out all categories if no search match', () => {
    const filtered = filter.transform(dataItems, 'wo');
    expect(filtered.length).toBe(0);
  });
});
