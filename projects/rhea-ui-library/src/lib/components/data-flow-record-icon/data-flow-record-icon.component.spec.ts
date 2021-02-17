import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataFlowRecordIconComponent } from './data-flow-record-icon.component';

import { TaTooltipModule } from '@trustarc/ui-toolkit';

describe('DataFlowRecordIconComponent', () => {
  let component: DataFlowRecordIconComponent;
  let fixture: ComponentFixture<DataFlowRecordIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DataFlowRecordIconComponent],
      imports: [TaTooltipModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataFlowRecordIconComponent);
    component = fixture.componentInstance;
    component.type = 'VENDOR';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
