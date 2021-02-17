import { async, inject, TestBed } from '@angular/core/testing';
import { SelectedItemsContainerModule } from './selected-items-container.module';
import { SelectedItemsContainerService } from './selected-items-container.service';

describe('SelectedItemsContainerService', () => {
  let dataItemMock1: any;
  let dataItemMock2: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SelectedItemsContainerModule],
      providers: [SelectedItemsContainerService]
    }).compileComponents();

    dataItemMock1 = {
      id: 1,
      businessProcessId: 'id1',
      label: 'Item 1',
      isSelected: true
    };
    dataItemMock2 = {
      id: 2,
      businessProcessId: 'id2',
      label: 'Item 2',
      isSelected: true
    };
  }));

  it('should be created', () => {
    const service: SelectedItemsContainerService = TestBed.get(
      SelectedItemsContainerService
    );
    expect(service).toBeTruthy();
  });

  describe('addSelectedDataItem', () => {
    it('should add selected data item', inject(
      [SelectedItemsContainerService],
      (service: SelectedItemsContainerService) => {
        const dataItem = dataItemMock1;
        service.addSelectedDataItem(dataItem);
        expect(service.getSelectedDataItems()).toEqual([dataItem]);
      }
    ));
  });

  describe('setSelectedDataItems', () => {
    it('should set selected data items', inject(
      [SelectedItemsContainerService],
      (service: SelectedItemsContainerService) => {
        const dataItem1 = dataItemMock1;
        const dataItem2 = dataItemMock2;
        service.addSelectedDataItem(dataItem1);
        service.addSelectedDataItem(dataItem2);
        expect(service.getSelectedDataItems()).toEqual([dataItem1, dataItem2]);
      }
    ));
  });

  describe('getSelectedDataItems', () => {
    it('should get selected data items', inject(
      [SelectedItemsContainerService],
      (service: SelectedItemsContainerService) => {
        const dataItem1 = dataItemMock1;
        const dataItem2 = dataItemMock2;
        service.addSelectedDataItem(dataItem1);
        service.addSelectedDataItem(dataItem2);
        expect(service.getSelectedDataItems()).toEqual([dataItem1, dataItem2]);
      }
    ));
  });

  describe('clearAllSelectedDataItems', () => {
    it('should clear all selected data items', inject(
      [SelectedItemsContainerService],
      (service: SelectedItemsContainerService) => {
        const dataItem = dataItemMock1;
        service.addSelectedDataItem(dataItem);
        expect(service.getSelectedDataItems()).toEqual([dataItem]);

        service.clearAllSelectedDataItems();
        expect(service.getSelectedDataItems()).toEqual([]);
      }
    ));
  });

  describe('empty selectedDataItems', () => {
    it('should return empty array when no selected data items', inject(
      [SelectedItemsContainerService],
      (service: SelectedItemsContainerService) => {
        service.setSelectedDataItems([]);
        expect(service.getSelectedDataItems()).toEqual([]);
      }
    ));
  });
});
