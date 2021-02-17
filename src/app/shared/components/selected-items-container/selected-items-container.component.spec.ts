import {
  async,
  ComponentFixture,
  inject,
  TestBed
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { SelectedItemsContainerComponent } from './selected-items-container.component';
import { SelectedItemsContainerService } from './selected-items-container.service';
import {
  TaButtonsModule,
  TaCheckboxModule,
  TaDropdownModule,
  TaSvgIconModule,
  TaTooltipModule
} from '@trustarc/ui-toolkit';
import { SearchFilterPipe } from './pipes/search-filter/search-filter.pipe';
import { CategoryFilterPipe } from './pipes/category-filter/category-filter.pipe';
import { LabelBadgeModule } from '../label-badge/label-badge.module';
import { CategoricalViewModule } from '../categorical-view/categorical-view.module';
import { LocationService } from '../../services/location/location.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RiskFieldIndicatorModule } from '../risk-field-indicator/risk-field-indicator.module';

describe('SelectedItemsContainerComponent', () => {
  let component: SelectedItemsContainerComponent;
  let fixture: ComponentFixture<SelectedItemsContainerComponent>;
  let dataItemsCategoryMock: any;
  let dataItemMock1: any;
  let dataItemMock2: any;
  let selectedDataItemsMock: any[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SelectedItemsContainerComponent,
        SearchFilterPipe,
        CategoryFilterPipe
      ],
      imports: [
        FormsModule,
        TaDropdownModule,
        TaCheckboxModule,
        TaTooltipModule,
        TaSvgIconModule,
        TaButtonsModule,
        LabelBadgeModule,
        CategoricalViewModule,
        HttpClientTestingModule,
        RiskFieldIndicatorModule
      ],
      providers: [SelectedItemsContainerService, LocationService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedItemsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    dataItemsCategoryMock = {
      id: 1,
      label: 'Category 1',
      items: [
        {
          id: 1,
          label: 'Item 1',
          selected: false
        },
        {
          id: 2,
          label: 'Item 2',
          selected: false
        }
      ]
    };

    dataItemMock1 = {
      id: 1,
      businessProcessId: 'id1',
      label: 'Item 1',
      selected: true
    };
    dataItemMock2 = {
      id: 2,
      businessProcessId: 'id2',
      label: 'Item 2',
      selected: true
    };

    selectedDataItemsMock = [dataItemMock1, dataItemMock2];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('setCurrentDataItemsCategory', () => {
    it('should set selected data items category', () => {
      spyOn(component, 'syncFromDataToSelection');
      component.ngOnInit();
      expect(component.syncFromDataToSelection).toHaveBeenCalled();
    });
  });

  describe('addToSelectedDataItems', () => {
    it('should add selected data item to selectedDataItems array', inject(
      [SelectedItemsContainerService],
      (service: SelectedItemsContainerService) => {
        const selectedItemsLength = service.getSelectedDataItems().length;
        const dataItem = dataItemMock1;
        service.addSelectedDataItem(dataItem);
        expect(service.getSelectedDataItems().length).toEqual(
          selectedItemsLength + 1
        );
      }
    ));
  });

  describe('Emit dataChange', () => {
    it('should emit dataChange on change in data', done => {
      component.dataChange.subscribe(e => {
        expect(e).toEqual(dataItemsCategoryMock);
        done();
      });
      component.dataChange.emit(dataItemsCategoryMock);
    });
  });

  describe('Update ControlValueAccessor', () => {
    it('should update control value accessor on data update', () => {
      component.data = [];
      component.data[0] = dataItemsCategoryMock;
      let newData = [];
      newData = [{ id: 1, label: 'Category 1', items: [] }];
      newData[0].items = selectedDataItemsMock;
      component.writeValue(newData);
      expect(component.data).toEqual(newData);
    });
  });

  describe('getSelectedDataItems', () => {
    it('should return selected data items from service', inject(
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

  describe('clearAllDataItems', () => {
    it('should clear all selected data items using service', inject(
      [SelectedItemsContainerService],
      (service: SelectedItemsContainerService) => {
        const dataItem1 = dataItemMock1;
        const dataItem2 = dataItemMock2;
        service.addSelectedDataItem(dataItem1);
        service.addSelectedDataItem(dataItem2);
        service.clearAllSelectedDataItems();
        expect(service.getSelectedDataItems()).toEqual([]);
      }
    ));
  });

  describe('removeFromList', () => {
    it('should remove data item from selected items list', () => {
      component.data = [];
      component.data[0] = dataItemsCategoryMock;
      component.setSelectedDataItems(selectedDataItemsMock);
      const selectedItemsLength = component.getSelectedDataItems().length;
      expect(
        component.getSelectedDataItems().some(i => {
          return i.id === dataItemMock2.id;
        })
      ).toEqual(true);
      component.removeFromList(dataItemMock2);
      expect(component.getSelectedDataItems().length).toEqual(
        selectedItemsLength - 1
      );
      expect(
        component.getSelectedDataItems().some(i => {
          return i.id === dataItemMock2.id;
        })
      ).toEqual(false);
    });
  });
});
