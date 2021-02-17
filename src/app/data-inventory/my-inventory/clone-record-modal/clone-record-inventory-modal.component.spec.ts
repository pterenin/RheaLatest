import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CloneRecordInventoryModalComponent } from './clone-record-inventory-modal.component';
import {
  TaButtonsModule,
  TaCheckboxModule,
  TaActiveModal
} from '@trustarc/ui-toolkit';

describe('CloneRecordInventoryModalComponent', () => {
  let component: CloneRecordInventoryModalComponent;
  let fixture: ComponentFixture<CloneRecordInventoryModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CloneRecordInventoryModalComponent],
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
    fixture = TestBed.createComponent(CloneRecordInventoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
