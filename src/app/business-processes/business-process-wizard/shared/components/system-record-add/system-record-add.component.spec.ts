import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SystemRecordAddComponent } from './system-record-add.component';
import { TabsetGuardedModule } from '../../../../../shared/components/tabset-guarded/tabset-guarded.module';
import { DataInventoryModule } from '../../../../../data-inventory/data-inventory.module';
import { RiskFieldIndicatorModule } from '../../../../../shared/components/risk-field-indicator/risk-field-indicator.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TaTabsetModule, TaToastModule } from '@trustarc/ui-toolkit';
import { RouterTestingModule } from '@angular/router/testing';

describe('SystemRecordAddComponent', () => {
  let component: SystemRecordAddComponent;
  let fixture: ComponentFixture<SystemRecordAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SystemRecordAddComponent],
      imports: [
        RouterTestingModule,
        TaToastModule,
        HttpClientTestingModule,
        TabsetGuardedModule,
        TaTabsetModule,
        DataInventoryModule,
        RiskFieldIndicatorModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemRecordAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
