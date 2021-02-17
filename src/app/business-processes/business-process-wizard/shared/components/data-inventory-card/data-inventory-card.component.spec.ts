import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DataInventoryCardComponent } from './data-inventory-card.component';
import {
  TaBadgeModule,
  TaCheckboxModule,
  TaDropdownModule,
  TaSvgIconModule,
  TaTableModule,
  TaTooltipModule
} from '@trustarc/ui-toolkit';
import { DataInventoryCardFilterComponent } from '../data-inventory-card-filter/data-inventory-card-filter.component';
import { DataInventoryCardAddComponent } from '../data-inventory-card-add/data-inventory-card-add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// tslint:disable-next-line:max-line-length
import { CategoryFormSearchFilterPipeModule } from 'src/app/shared/_pipes/category-form-search-filter/category-form-search-filter.pipe.module';
import { TableSearchFilterPipeModule } from 'src/app/shared/_pipes/table-search-filter/table-search-filter.pipe.module';
import { FilterByArrayPipeModule } from 'src/app/shared/_pipes/filter-by-array-pipe/filter-by-array-pipe.module';
// tslint:disable-next-line:max-line-length
import { DataInventoryCardTableBodyComponent } from 'src/app/business-processes/business-process-wizard/shared/components/data-inventory-card-table-body/data-inventory-card-table-body.component';
import { MapPipeModule } from 'src/app/shared/pipes/map/map.module';

describe('DataInventoryCardComponent', () => {
  let component: DataInventoryCardComponent;
  let fixture: ComponentFixture<DataInventoryCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DataInventoryCardComponent,
        DataInventoryCardAddComponent,
        DataInventoryCardFilterComponent,
        DataInventoryCardTableBodyComponent
      ],
      imports: [
        TaBadgeModule,
        TaSvgIconModule,
        TaTableModule,
        TaDropdownModule,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        TaCheckboxModule,
        MapPipeModule,
        TableSearchFilterPipeModule,
        CategoryFormSearchFilterPipeModule,
        FilterByArrayPipeModule,
        TaTooltipModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataInventoryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
