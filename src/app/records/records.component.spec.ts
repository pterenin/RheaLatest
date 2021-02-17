import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordsComponent } from './records.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('RecordsComponent', () => {
  let component: RecordsComponent;
  let fixture: ComponentFixture<RecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RecordsComponent],
      imports: [RouterTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
