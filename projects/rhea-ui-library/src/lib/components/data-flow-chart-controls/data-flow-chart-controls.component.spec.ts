/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DataFlowChartControlsComponent } from './data-flow-chart-controls.component';

describe('DataFlowChartComponent', () => {
  let component: DataFlowChartControlsComponent;
  let fixture: ComponentFixture<DataFlowChartControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DataFlowChartControlsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataFlowChartControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
