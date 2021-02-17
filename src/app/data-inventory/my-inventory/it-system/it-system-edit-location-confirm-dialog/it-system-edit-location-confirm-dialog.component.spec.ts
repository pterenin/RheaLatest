import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ItSystemEditLocationConfirmDialogComponent } from './it-system-edit-location-confirm-dialog.component';
import { CommonModule } from '@angular/common';
import {
  TaButtonsModule,
  TaModalModule,
  TaActiveModal
} from '@trustarc/ui-toolkit';

describe('ItSystemEditLocationConfirmDialogComponent', () => {
  let component: ItSystemEditLocationConfirmDialogComponent;
  let fixture: ComponentFixture<ItSystemEditLocationConfirmDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItSystemEditLocationConfirmDialogComponent],
      imports: [CommonModule, TaButtonsModule, TaModalModule],
      providers: [TaActiveModal]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(
      ItSystemEditLocationConfirmDialogComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
