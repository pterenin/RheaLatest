import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRowsDropdownComponent } from './view-rows-dropdown.component';
import { DatagridService, TaDropdownModule } from '@trustarc/ui-toolkit';

describe('ViewRowsDropdownComponent', () => {
  let component: ViewRowsDropdownComponent;
  let fixture: ComponentFixture<ViewRowsDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewRowsDropdownComponent],
      imports: [TaDropdownModule],
      providers: [DatagridService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRowsDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set options to default values on construction', () => {
    expect(component.options).toEqual([
      { value: 1, text: '25' },
      { value: 2, text: '50' },
      { value: 3, text: '75' },
      { value: 4, text: '100' },
      { value: 5, text: '200' }
    ]);
  });

  it('should update the number of rows on the call to updateNumberOfRows()', () => {
    component.updateNumberOfRows(30);
    expect(component.numRowsSelected).toEqual(30);
  });
});
