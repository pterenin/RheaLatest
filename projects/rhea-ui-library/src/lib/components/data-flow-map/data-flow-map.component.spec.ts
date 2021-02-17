import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataFlowMapComponent } from './data-flow-map.component';

describe('DataFlowMapComponent', () => {
  let component: DataFlowMapComponent;
  let fixture: ComponentFixture<DataFlowMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DataFlowMapComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataFlowMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
