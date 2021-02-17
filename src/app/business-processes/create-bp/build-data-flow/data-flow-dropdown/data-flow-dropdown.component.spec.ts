import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataFlowDropdownComponent } from './data-flow-dropdown.component';
import {
  TaPopoverModule,
  TaTagsModule,
  TaBadgeModule,
  TaSvgIconModule,
  TaDropdownModule
} from '@trustarc/ui-toolkit';

import { DataFlowDropdownLabelComponent } from '../data-flow-dropdown-label/data-flow-dropdown-label.component';
import { LocationTooltipModule } from 'src/app/shared/components/location-tooltip/location-tooltip.module';

describe('DataFlowDropdownComponent', () => {
  let component: DataFlowDropdownComponent;
  let fixture: ComponentFixture<DataFlowDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DataFlowDropdownComponent, DataFlowDropdownLabelComponent],
      imports: [
        LocationTooltipModule,
        TaPopoverModule,
        TaTagsModule,
        TaBadgeModule,
        TaDropdownModule,
        TaSvgIconModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataFlowDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
