import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ItSystemEditSubjectConfirmDialogComponent } from './it-system-edit-subject-confirm-dialog.component';
import { CommonModule } from '@angular/common';
import {
  TaButtonsModule,
  TaModalModule,
  TaActiveModal
} from '@trustarc/ui-toolkit';

describe('ItSystemEditSubjectConfirmDialogComponent', () => {
  let component: ItSystemEditSubjectConfirmDialogComponent;
  let fixture: ComponentFixture<ItSystemEditSubjectConfirmDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItSystemEditSubjectConfirmDialogComponent],
      imports: [CommonModule, TaButtonsModule, TaModalModule],
      providers: [TaActiveModal]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(
      ItSystemEditSubjectConfirmDialogComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
