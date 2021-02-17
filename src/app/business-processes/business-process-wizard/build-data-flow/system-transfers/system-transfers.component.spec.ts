import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { TaCollapseModule, TaTooltipModule } from '@trustarc/ui-toolkit';

import { SystemTransfersComponent } from './system-transfers.component';

describe('SystemTransfersComponent', () => {
  let component: SystemTransfersComponent;
  let fixture: ComponentFixture<SystemTransfersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SystemTransfersComponent],
      imports: [TaTooltipModule, TaCollapseModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemTransfersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
