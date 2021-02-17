import {
  async,
  ComponentFixture,
  inject,
  TestBed
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Step4ItemsComponent } from './step-4-selected-items-container.component';
import { Step4SelectedItemsContainerService } from './step-4-selected-items-container.service';
import {
  TaButtonsModule,
  TaCheckboxModule,
  TaDropdownModule,
  TaSvgIconModule,
  TaToastModule,
  TaTooltipModule
} from '@trustarc/ui-toolkit';
import { Step4SearchFilterPipe } from './step-4-pipes/step-4-search-filter/step-4-search-filter.pipe';
import { Step4CategoryFilterPipe } from './step-4-pipes/step-4-category-filter/step-4-category-filter.pipe';
import { LabelBadgeModule } from '../label-badge/label-badge.module';
import { CategoricalViewModule } from '../categorical-view/categorical-view.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponents } from 'ng-mocks';
import { AsyncCategoricalDropdownComponent } from '../async-categorical-dropdown/async-categorical-dropdown.component';

describe('Step4ItemsComponent', () => {
  let component: Step4ItemsComponent;
  let fixture: ComponentFixture<Step4ItemsComponent>;
  let dataItemsCategoryMock: any;
  let dataItemMock1: any;
  let dataItemMock2: any;
  let selectedDataItemsMock: any[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        Step4ItemsComponent,
        Step4SearchFilterPipe,
        Step4CategoryFilterPipe,
        ...MockComponents(AsyncCategoricalDropdownComponent)
      ],
      imports: [
        FormsModule,
        TaButtonsModule,
        TaDropdownModule,
        TaCheckboxModule,
        TaTooltipModule,
        TaSvgIconModule,
        TaToastModule,
        LabelBadgeModule,
        CategoricalViewModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [Step4SelectedItemsContainerService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Step4ItemsComponent);
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
      label: 'Item 1',
      selected: true
    };
    dataItemMock2 = {
      id: 2,
      label: 'Item 2',
      selected: true
    };

    selectedDataItemsMock = [dataItemMock1, dataItemMock2];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('addToSelectedDataItems', () => {
    it('should add selected data item to selectedDataItems array', inject(
      [Step4SelectedItemsContainerService],
      (service: Step4SelectedItemsContainerService) => {
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

  describe('getSelectedDataItems', () => {
    it('should return selected data items from service', inject(
      [Step4SelectedItemsContainerService],
      (service: Step4SelectedItemsContainerService) => {
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
      [Step4SelectedItemsContainerService],
      (service: Step4SelectedItemsContainerService) => {
        const dataItem1 = dataItemMock1;
        const dataItem2 = dataItemMock2;

        service.addSelectedDataItem(dataItem1);
        service.addSelectedDataItem(dataItem2);
        service.clearAllSelectedDataItems();

        expect(service.getSelectedDataItems()).toEqual([]);
      }
    ));
  });
});
