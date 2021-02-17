import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DataFlowEmptyStateComponent } from './data-flow-empty-state.component';

describe('DataFlowEmptyStateComponent', () => {
  let component: DataFlowEmptyStateComponent;
  let fixture: ComponentFixture<DataFlowEmptyStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DataFlowEmptyStateComponent],
      imports: []
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataFlowEmptyStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
