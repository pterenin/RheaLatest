import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalConfirmationBasicComponent } from './modal-confirmation-basic.component';
import {
  TaActiveModal,
  TaSvgIconModule,
  TaTableModule,
  TaTooltipModule
} from '@trustarc/ui-toolkit';

describe('ModalConfirmationBasicComponent', () => {
  let component: ModalConfirmationBasicComponent;
  let fixture: ComponentFixture<ModalConfirmationBasicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModalConfirmationBasicComponent],
      imports: [TaSvgIconModule, TaTableModule, TaTooltipModule],
      providers: [TaActiveModal]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalConfirmationBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('submit()', () => {
    it('should call submit() correctly, showSpinner - false', () => {
      const modalService = TestBed.get(TaActiveModal);
      const modalSpy = spyOn(modalService, 'close');
      const confirmSpy = spyOn(component.confirm, 'emit');

      component.showSpinner = false;
      component.submit();
      fixture.detectChanges();
      expect(modalSpy).toHaveBeenCalledTimes(1);
      expect(confirmSpy).toHaveBeenCalledTimes(1);
    });
    it('should call submit() correctly, showSpinner - true', () => {
      const modalService = TestBed.get(TaActiveModal);
      const modalSpy = spyOn(modalService, 'close');
      const confirmSpy = spyOn(component.confirm, 'emit');

      component.showSpinner = true;
      component.submit();
      fixture.detectChanges();
      expect(modalSpy).toHaveBeenCalledTimes(0);
      expect(confirmSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('dismiss()', () => {
    it('should call dismiss() correctly', () => {
      const modalService = TestBed.get(TaActiveModal);
      const modalSpy = spyOn(modalService, 'dismiss');
      const cancelSpy = spyOn(component.cancel, 'emit');
      component.dismiss();
      fixture.detectChanges();
      expect(modalSpy).toHaveBeenCalledTimes(1);
      expect(cancelSpy).toHaveBeenCalledTimes(1);
    });
  });
});
