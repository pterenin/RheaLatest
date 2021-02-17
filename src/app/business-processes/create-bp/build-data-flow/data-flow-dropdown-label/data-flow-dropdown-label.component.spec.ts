import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataFlowDropdownLabelComponent } from './data-flow-dropdown-label.component';
import { LocationTooltipModule } from 'src/app/shared/components/location-tooltip/location-tooltip.module';
import { TaPopoverModule } from '@trustarc/ui-toolkit';

describe('DataFlowDropdownLabelComponent', () => {
  let component: DataFlowDropdownLabelComponent;
  let fixture: ComponentFixture<DataFlowDropdownLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DataFlowDropdownLabelComponent],
      imports: [LocationTooltipModule, TaPopoverModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataFlowDropdownLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
