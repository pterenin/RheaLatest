import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficRiskIndicatorComponent } from './traffic-risk-indicator.component';
import { TaPopoverModule, TaTooltipModule } from '@trustarc/ui-toolkit';

const testData = {
  algorithmRiskIndicator: 'RISK_UNLIKELY',
  inherentRiskIndicator: 'MEDIUM_INHERENT_RISK',
  residualRiskIndicator: null
};

describe('TrafficRiskIndicatorComponent', () => {
  let component: TrafficRiskIndicatorComponent;
  let fixture: ComponentFixture<TrafficRiskIndicatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TrafficRiskIndicatorComponent],
      imports: [TaTooltipModule, TaPopoverModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrafficRiskIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
