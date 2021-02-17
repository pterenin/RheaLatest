import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionDisplayFieldComponent } from './region-display-field.component';
import {
  TaTagsModule,
  TaSvgIconModule,
  TaButtonsModule
} from '@trustarc/ui-toolkit';

describe('RegionDisplayFieldComponent', () => {
  let component: RegionDisplayFieldComponent;
  let fixture: ComponentFixture<RegionDisplayFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegionDisplayFieldComponent],
      imports: [TaTagsModule, TaSvgIconModule, TaButtonsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionDisplayFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
