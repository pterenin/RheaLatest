import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CloneRecordModalComponent } from './clone-record-modal.component';
import {
  TaActiveModal,
  TaButtonsModule,
  TaCheckboxModule
} from '@trustarc/ui-toolkit';

describe('CloneRecordModalComponent', () => {
  let component: CloneRecordModalComponent;
  let fixture: ComponentFixture<CloneRecordModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CloneRecordModalComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        TaButtonsModule,
        TaCheckboxModule
      ],
      providers: [TaActiveModal]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloneRecordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
