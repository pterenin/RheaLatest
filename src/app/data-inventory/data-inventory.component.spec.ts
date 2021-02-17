import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataInventoryComponent } from './data-inventory.component';
import { RouterTestingModule } from '@angular/router/testing';
import { LabelBadgeModule } from '../shared/components/label-badge/label-badge.module';
import { TaTooltipModule } from '@trustarc/ui-toolkit';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DataInventoryComponent', () => {
  let component: DataInventoryComponent;
  let fixture: ComponentFixture<DataInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DataInventoryComponent],
      imports: [
        RouterTestingModule,
        TaTooltipModule,
        LabelBadgeModule,
        HttpClientTestingModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
