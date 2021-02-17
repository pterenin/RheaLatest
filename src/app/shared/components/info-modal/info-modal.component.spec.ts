import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoModalComponent } from './info-modal.component';
import {
  TaPopoverModule,
  TaTabsetModule,
  TaToggleSwitchModule
} from '@trustarc/ui-toolkit';
import { FormsModule } from '@angular/forms';

describe('InfoModalComponent', () => {
  let component: InfoModalComponent;
  let fixture: ComponentFixture<InfoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InfoModalComponent],
      imports: [
        TaPopoverModule,
        TaTabsetModule,
        TaToggleSwitchModule,
        FormsModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
