import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverFilterBodySimpleListComponent } from './popover-filter-body-simple-list.component';
import {
  TaDropdownModule,
  TaButtonsModule,
  TaSvgIconModule,
  TaCheckboxModule,
  TaBadgeModule
} from '@trustarc/ui-toolkit';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchFieldComponent } from 'src/app/shared/_components/search-field/search-field.component';

describe('PopoverFilterBodySimpleListComponent', () => {
  let component: PopoverFilterBodySimpleListComponent;
  let fixture: ComponentFixture<PopoverFilterBodySimpleListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PopoverFilterBodySimpleListComponent,
        SearchFieldComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        TaBadgeModule,
        TaDropdownModule,
        TaButtonsModule,
        TaSvgIconModule,
        TaCheckboxModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopoverFilterBodySimpleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
