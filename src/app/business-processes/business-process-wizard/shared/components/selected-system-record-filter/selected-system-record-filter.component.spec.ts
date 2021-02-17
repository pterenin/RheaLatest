import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedSystemRecordFilterComponent } from './selected-system-record-filter.component';
import {
  TaDropdownModule,
  TaButtonsModule,
  TaSvgIconModule,
  TaCheckboxModule
} from '@trustarc/ui-toolkit';

describe('SelectedSystemRecordFilterComponent', () => {
  let component: SelectedSystemRecordFilterComponent;
  let fixture: ComponentFixture<SelectedSystemRecordFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectedSystemRecordFilterComponent],
      imports: [
        TaDropdownModule,
        TaButtonsModule,
        TaSvgIconModule,
        TaCheckboxModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedSystemRecordFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onClear()', () => {
    it('should call onClear() correctly, closeOnClear true', () => {
      const clearSpy = spyOn(component.clearClick, 'emit');
      const dropdownSpy = spyOn(component.dropdown, 'close');

      component.onClear();
      fixture.detectChanges();
      expect(clearSpy).toHaveBeenCalledTimes(1);
      expect(dropdownSpy).toHaveBeenCalledTimes(1);
    });
    it('should call onClear() correctly, closeOnClear false', () => {
      const clearSpy = spyOn(component.clearClick, 'emit');
      const dropdownSpy = spyOn(component.dropdown, 'close');

      component.closeOnClear = false;
      component.onClear();
      fixture.detectChanges();
      expect(clearSpy).toHaveBeenCalledTimes(1);
      expect(dropdownSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('onApply()', () => {
    it('should call onApply() correctly, closeOnApply true', () => {
      const applySpy = spyOn(component.applyClick, 'emit');
      const dropdownSpy = spyOn(component.dropdown, 'close');

      component.onApply();
      fixture.detectChanges();
      expect(applySpy).toHaveBeenCalledTimes(1);
      expect(dropdownSpy).toHaveBeenCalledTimes(1);
    });
    it('should call onApply() correctly, closeOnApply false', () => {
      const applySpy = spyOn(component.applyClick, 'emit');
      const dropdownSpy = spyOn(component.dropdown, 'close');

      component.closeOnApply = false;
      component.onApply();
      fixture.detectChanges();
      expect(applySpy).toHaveBeenCalledTimes(1);
      expect(dropdownSpy).toHaveBeenCalledTimes(0);
    });
  });
});
