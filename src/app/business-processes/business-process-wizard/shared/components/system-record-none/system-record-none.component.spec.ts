import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SystemRecordNoneComponent } from './system-record-none.component';

describe('SystemRecordNoneComponent', () => {
  let component: SystemRecordNoneComponent;
  let fixture: ComponentFixture<SystemRecordNoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SystemRecordNoneComponent],
      imports: []
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemRecordNoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
