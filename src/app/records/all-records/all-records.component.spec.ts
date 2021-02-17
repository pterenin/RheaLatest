import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllRecordsComponent } from './all-records.component';
import { RouterTestingModule } from '@angular/router/testing';
import { PageWrapperModule } from 'src/app/shared/components/page-wrapper/page-wrapper.module';

describe('AllRecordsComponent', () => {
  let component: AllRecordsComponent;
  let fixture: ComponentFixture<AllRecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AllRecordsComponent],
      imports: [RouterTestingModule, PageWrapperModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
