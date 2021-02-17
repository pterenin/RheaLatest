import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RiskFieldIndicatorComponent } from './risk-field-indicator.component';

describe('RiskFieldIndicatorComponent', () => {
  let component: RiskFieldIndicatorComponent;
  let fixture: ComponentFixture<RiskFieldIndicatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RiskFieldIndicatorComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskFieldIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
