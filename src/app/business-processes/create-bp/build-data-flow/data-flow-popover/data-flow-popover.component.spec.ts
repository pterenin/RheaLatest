import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  TaTabsetModule,
  TaProgressbarModule,
  TaPopoverModule,
  TaTagsModule,
  TaBadgeModule,
  TaToggleSwitchModule,
  TaDropdownModule,
  TaSvgIconModule,
  TaModalModule
} from '@trustarc/ui-toolkit';

import { CategoricalViewModule } from 'src/app/shared/components/categorical-view/categorical-view.module';
import { LocationModule } from 'src/app/shared/components/location/location.module';
import { ReplacePipeModule } from 'src/app/shared/pipes/replace/replace.module';
import { DataFlowPopoverComponent } from './data-flow-popover.component';

describe('DataFlowPopoverComponent', () => {
  let component: DataFlowPopoverComponent;
  let fixture: ComponentFixture<DataFlowPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DataFlowPopoverComponent],
      imports: [
        CategoricalViewModule,
        LocationModule,
        ReplacePipeModule,
        TaTabsetModule,
        TaProgressbarModule,
        TaPopoverModule,
        TaTagsModule,
        TaBadgeModule,
        TaToggleSwitchModule,
        TaDropdownModule,
        TaSvgIconModule,
        TaModalModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataFlowPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
