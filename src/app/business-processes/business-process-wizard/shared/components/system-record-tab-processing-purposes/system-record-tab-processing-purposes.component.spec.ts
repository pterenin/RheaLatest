import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SystemRecordTabProcessingPurposeComponent } from './system-record-tab-processing-purposes.component';
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
import { ProcessingPurposePipeModule } from '../../../../../shared/pipes/processing-purpose/processing-purpose.module';
import { SearchByPipeModule } from 'src/app/shared/_pipes/search-by/search-by.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FilterByArrayPipeModule } from 'src/app/shared/_pipes/filter-by-array-pipe/filter-by-array-pipe.module';

describe('SystemRecordTabProcessingPurposeComponent', () => {
  let component: SystemRecordTabProcessingPurposeComponent;
  let fixture: ComponentFixture<SystemRecordTabProcessingPurposeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SystemRecordTabProcessingPurposeComponent,
        SelectedSystemRecordFilterComponent
      ],
      imports: [
        TaSvgIconModule,
        TaTableModule,
        TaCheckboxModule,
        TaDropdownModule,
        SearchFieldModule,
        ArrayPipeModule,
        LocationPipeModule,
        CollectionPipeModule,
        ProcessingPurposePipeModule,
        SearchByPipeModule,
        ReactiveFormsModule,
        FilterByArrayPipeModule,
        FormsModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(
      SystemRecordTabProcessingPurposeComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
