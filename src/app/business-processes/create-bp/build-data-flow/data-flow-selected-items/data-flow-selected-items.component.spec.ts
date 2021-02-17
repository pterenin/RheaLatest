import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {
  TaTabsetModule,
  TaProgressbarModule,
  TaPopoverModule,
  TaTagsModule,
  TaBadgeModule,
  TaDropdownModule,
  TaSvgIconModule
} from '@trustarc/ui-toolkit';

import { DataFlowSelectedItemsComponent } from './data-flow-selected-items.component';
import { LabelBadgeModule } from 'src/app/shared/components/label-badge/label-badge.module';

describe('DataFlowSelectedItemsComponent', () => {
  let component: DataFlowSelectedItemsComponent;
  let fixture: ComponentFixture<DataFlowSelectedItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DataFlowSelectedItemsComponent],
      imports: [
        LabelBadgeModule,
        TaTabsetModule,
        TaProgressbarModule,
        TaPopoverModule,
        TaTagsModule,
        TaBadgeModule,
        TaDropdownModule,
        TaSvgIconModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataFlowSelectedItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
