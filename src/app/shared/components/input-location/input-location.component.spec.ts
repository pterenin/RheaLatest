import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputLocationComponent } from './input-location.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownFieldModule } from '../dropdown/dropdown-field.module';
import { HttpClientModule } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { RiskFieldIndicatorModule } from '../risk-field-indicator/risk-field-indicator.module';
import { TaSvgIconModule } from '@trustarc/ui-toolkit';

describe('InputLocationComponent', () => {
  let component: InputLocationComponent;
  let fixture: ComponentFixture<InputLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InputLocationComponent],
      imports: [
        DropdownFieldModule,
        HttpClientModule,
        ReactiveFormsModule,
        RiskFieldIndicatorModule,
        TaSvgIconModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not delete existing location on enter pressed within country dropdown', () => {
    component.addEmptyLocationRow(false);
    component.addEmptyLocationRow(false);
    fixture.detectChanges();

    // find both location rows and assert both are there
    const countryDropdownButton1 = fixture.debugElement.query(
      By.css('#dropdown-button-0')
    );
    expect(countryDropdownButton1).toBeTruthy();
    const countryDropdownButton2 = fixture.debugElement.query(
      By.css('#dropdown-button-1')
    );
    expect(countryDropdownButton2).toBeTruthy();

    // click on the 2nd button to open up the country dropdown
    countryDropdownButton2.triggerEventHandler('click', {});
    fixture.detectChanges();

    // find both search boxes and assert 1st being hidden and 2nd being visible
    const searchInput1 = fixture.debugElement.query(
      By.css('#search-dropdown-0')
    );
    expect(searchInput1.nativeElement.offsetHeight).toEqual(0);
    const searchInput2 = fixture.debugElement.query(
      By.css('#search-dropdown-1')
    );
    expect(searchInput2.nativeElement.offsetHeight).toBeGreaterThan(0);

    // trigger an enter keydown on the 2nd row search box
    searchInput2.triggerEventHandler('keydown.enter', {});
    fixture.detectChanges();

    // assert both rows still exist
    expect(searchInput1).toBeTruthy();
    expect(searchInput2).toBeTruthy();
  });
});
