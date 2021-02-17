import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SystemRecordTabDataElementComponent } from './system-record-tab-data-elements.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  TaSvgIconModule,
  TaTableModule,
  TaCheckboxModule,
  TaDropdownModule
} from '@trustarc/ui-toolkit';
import { SelectedSystemRecordFilterComponent } from '../selected-system-record-filter/selected-system-record-filter.component';
import { SearchFieldModule } from 'src/app/shared/_components/search-field/search-field.module';
import { ArrayPipeModule } from '../../../../../shared/pipes/array/array.module';
import { LocationPipeModule } from '../../../../../shared/pipes/location/location.module';
import { CollectionPipeModule } from '../../../../../shared/pipes/collection/collection.module';
import { DataElementPipeModule } from '../../../../../shared/pipes/data-element/data-element.module';
import { SearchByPipeModule } from '../../../../../shared/_pipes/search-by/search-by.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FilterByArrayPipeModule } from 'src/app/shared/_pipes/filter-by-array-pipe/filter-by-array-pipe.module';

describe('SystemRecordTabDataElementComponent', () => {
  let component: SystemRecordTabDataElementComponent;
  let fixture: ComponentFixture<SystemRecordTabDataElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SystemRecordTabDataElementComponent,
        SelectedSystemRecordFilterComponent
      ],
      imports: [
        TaSvgIconModule,
        TaTableModule,
        TaCheckboxModule,
        TaDropdownModule,
        SearchFieldModule,
        FormsModule,
        ArrayPipeModule,
        LocationPipeModule,
        CollectionPipeModule,
        DataElementPipeModule,
        SearchByPipeModule,
        ReactiveFormsModule,
        FilterByArrayPipeModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemRecordTabDataElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
