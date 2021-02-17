import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataFlowChartComponent } from './data-flow-chart.component';

describe('DataFlowChartComponent', () => {
  let component: DataFlowChartComponent;
  let fixture: ComponentFixture<DataFlowChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DataFlowChartComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataFlowChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
