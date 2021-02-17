import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemRecordTabHostingLocationsComponent } from './system-record-tab-hosting-locations.component';
import { ReplacePipeModule } from 'src/app/shared/pipes/replace/replace.module';
import { SearchFieldModule } from 'src/app/shared/_components/search-field/search-field.module';
import {
  TaDropdownModule,
  TaCheckboxModule,
  TaTableModule,
  TaSvgIconModule
} from '@trustarc/ui-toolkit';
import { SelectedSystemRecordFilterComponent } from '../selected-system-record-filter/selected-system-record-filter.component';
import { ArrayPipeModule } from '../../../../../shared/pipes/array/array.module';
import { LocationPipeModule } from '../../../../../shared/pipes/location/location.module';
import { CollectionPipeModule } from '../../../../../shared/pipes/collection/collection.module';
import { SearchByPipeModule } from 'src/app/shared/_pipes/search-by/search-by.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FilterByArrayPipeModule } from 'src/app/shared/_pipes/filter-by-array-pipe/filter-by-array-pipe.module';

describe('SystemRecordTabHostingLocationsComponent', () => {
  let component: SystemRecordTabHostingLocationsComponent;
  let fixture: ComponentFixture<SystemRecordTabHostingLocationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SystemRecordTabHostingLocationsComponent,
        SelectedSystemRecordFilterComponent
      ],
      imports: [
        TaSvgIconModule,
        TaTableModule,
        TaCheckboxModule,
        TaDropdownModule,
        SearchFieldModule,
        ReplacePipeModule,
        ArrayPipeModule,
        LocationPipeModule,
        CollectionPipeModule,
        SearchByPipeModule,
        FilterByArrayPipeModule,
        ReactiveFormsModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemRecordTabHostingLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
