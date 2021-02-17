import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessProcessWizardFooterComponent } from './business-process-wizard-footer.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('BusinessProcessWizardFooterComponent', () => {
  let component: BusinessProcessWizardFooterComponent;
  let fixture: ComponentFixture<BusinessProcessWizardFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessProcessWizardFooterComponent],
      imports: [RouterTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessProcessWizardFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
