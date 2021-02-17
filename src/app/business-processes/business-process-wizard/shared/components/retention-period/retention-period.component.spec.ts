import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RetentionPeriodComponent } from './retention-period.component';
import {
  TaDropdownModule,
  TaButtonsModule,
  TaSvgIconModule,
  TaCheckboxModule,
  TaBadgeModule
} from '@trustarc/ui-toolkit';
import { DropdownFieldModule } from 'src/app/shared/components/dropdown/dropdown-field.module';

describe('RetentionPeriodComponent', () => {
  let component: RetentionPeriodComponent;
  let fixture: ComponentFixture<RetentionPeriodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RetentionPeriodComponent],
      imports: [
        TaBadgeModule,
        TaDropdownModule,
        TaButtonsModule,
        TaSvgIconModule,
        TaCheckboxModule,
        FormsModule,
        ReactiveFormsModule,
        DropdownFieldModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetentionPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
