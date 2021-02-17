import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessProcessDetailComponent } from './business-process-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TaDropdownModule } from '@trustarc/ui-toolkit';
import { DropdownFieldModule } from 'src/app/shared/components/dropdown/dropdown-field.module';
import { of } from 'rxjs';

describe('BusinessProcessDetailComponent', () => {
  let component: BusinessProcessDetailComponent;
  let fixture: ComponentFixture<BusinessProcessDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessProcessDetailComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        TaDropdownModule,
        DropdownFieldModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessProcessDetailComponent);
    component = fixture.componentInstance;
    const sample = {
      id: '5e855070-dd8f-47a3-9e0e-593092b72500',
      version: 4,
      name: 'Changed Name by PUT 5e855070-dd8f-47a3-9e0e-593092b72500',
      description: 'test',
      dataSubjectVolumeId: null
    };
    component.sourceData = of(sample);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
