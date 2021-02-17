import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalConfirmationThreeButtonComponent } from './modal-confirmation-three-button.component';
import {
  TaActiveModal,
  TaSvgIconModule,
  TaTableModule,
  TaTooltipModule
} from '@trustarc/ui-toolkit';

describe('ModalConfirmationThreeButtonComponent', () => {
  let component: ModalConfirmationThreeButtonComponent;
  let fixture: ComponentFixture<ModalConfirmationThreeButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModalConfirmationThreeButtonComponent],
      imports: [TaSvgIconModule, TaTableModule, TaTooltipModule],
      providers: [TaActiveModal]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalConfirmationThreeButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('submit', () => {
    it('should call submit function', () => {
      component.showSpinner = false;
      const activeModalService = TestBed.get(TaActiveModal);

      const activeModalSpy = spyOn(activeModalService, 'close');
      const confirmSpy = spyOn(component.confirm, 'emit');

      component.submit();

      expect(activeModalSpy).toHaveBeenCalledTimes(1);
      expect(activeModalSpy).toHaveBeenCalledWith('CONFIRM');

      expect(confirmSpy).toHaveBeenCalledTimes(1);
    });
    it('should call submit function - no spinner', () => {
      component.showSpinner = true;
      const activeModalService = TestBed.get(TaActiveModal);

      const activeModalSpy = spyOn(activeModalService, 'close');
      const confirmSpy = spyOn(component.confirm, 'emit');

      component.submit();

      expect(activeModalSpy).toHaveBeenCalledTimes(0);
      expect(confirmSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('discardChanges', () => {
    it('should call discardChanges function', () => {
      const activeModalService = TestBed.get(TaActiveModal);

      const activeModalSpy = spyOn(activeModalService, 'close');
      const discardSpy = spyOn(component.discard, 'emit');

      component.discardChanges();

      expect(activeModalSpy).toHaveBeenCalledTimes(1);
      expect(activeModalSpy).toHaveBeenCalledWith('DISCARD');

      expect(discardSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('dismiss', () => {
    it('should call dismiss function', () => {
      const activeModalService = TestBed.get(TaActiveModal);

      const activeModalSpy = spyOn(activeModalService, 'dismiss');
      const cancelSpy = spyOn(component.cancel, 'emit');

      component.dismiss();

      expect(activeModalSpy).toHaveBeenCalledTimes(1);

      expect(cancelSpy).toHaveBeenCalledTimes(1);
    });
  });
});
