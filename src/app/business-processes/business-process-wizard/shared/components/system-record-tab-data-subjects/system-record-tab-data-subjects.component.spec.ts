import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SystemRecordTabDataSubjectComponent } from './system-record-tab-data-subjects.component';
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
import { SearchByPipeModule } from 'src/app/shared/_pipes/search-by/search-by.module';
import { FilterByArrayPipeModule } from '../../../../../shared/_pipes/filter-by-array-pipe/filter-by-array-pipe.module';

describe('SystemRecordTabDataSubjectComponent', () => {
  let component: SystemRecordTabDataSubjectComponent;
  let fixture: ComponentFixture<SystemRecordTabDataSubjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SystemRecordTabDataSubjectComponent,
        SelectedSystemRecordFilterComponent
      ],
      imports: [
        ReactiveFormsModule,
        TaSvgIconModule,
        TaTableModule,
        TaCheckboxModule,
        TaDropdownModule,
        SearchFieldModule,
        ArrayPipeModule,
        LocationPipeModule,
        CollectionPipeModule,
        DataElementPipeModule,
        SearchByPipeModule,
        FilterByArrayPipeModule,
        HttpClientTestingModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemRecordTabDataSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
