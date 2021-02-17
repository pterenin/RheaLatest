import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpFilterViewComponent } from './bp-filter-view.component';

describe('BpFilterViewComponent', () => {
  let component: BpFilterViewComponent;
  let fixture: ComponentFixture<BpFilterViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BpFilterViewComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpFilterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the expandFilterView value to true on first toggle', () => {
    component.expandFilterViewToggle();
    expect(component.expandFilterView).toBeTruthy();
  });

  it('should set the expandFilterView value to false on second toggle', () => {
    component.expandFilterViewToggle();
    component.expandFilterViewToggle();
    expect(component.expandFilterView).toBeFalsy();
  });

  it('should set the expandFilterView value to false on close', () => {
    component.expandFilterView = false;
    component.closeFilterView();
    expect(component.expandFilterView).toBeFalsy();
    component.expandFilterView = true;
    component.closeFilterView();
    expect(component.expandFilterView).toBeFalsy();
    component.expandFilterViewToggle();
    component.closeFilterView();
    expect(component.expandFilterView).toBeFalsy();
    component.expandFilterView = true;
    component.expandFilterViewToggle();
    expect(component.expandFilterView).toBeFalsy();
  });
});
