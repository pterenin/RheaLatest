import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {
  TaCheckboxModule,
  TaDropdownModule,
  TaSvgIconModule,
  TaTagsModule
} from '@trustarc/ui-toolkit';

import { DropdownHierarchyComponent } from './dropdown-hierarchy.component';
import { SearchFilterPipeModule } from '../../pipes/filter/search-filter.module';
import { NonselectedPipeModule } from '../../pipes/filter/nonselected.module';

describe('DropdownHierarchyComponent', () => {
  let component: DropdownHierarchyComponent;
  let fixture: ComponentFixture<DropdownHierarchyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DropdownHierarchyComponent],
      imports: [
        TaDropdownModule,
        TaTagsModule,
        SearchFilterPipeModule,
        TaSvgIconModule,
        TaCheckboxModule,
        NonselectedPipeModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownHierarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
