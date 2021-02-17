import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItSystemProcessingPurposesComponent } from './it-system-processing-purposes.component';
import { TranslateModule } from '@ngx-translate/core';
import {
  TaButtonsModule,
  TaCheckboxModule,
  TaDropdownModule
} from '@trustarc/ui-toolkit';
import { CategoricalViewModule } from 'src/app/shared/components/categorical-view/categorical-view.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Subject } from 'rxjs';
import { DataInventoryService } from 'src/app/data-inventory/data-inventory.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('ItSystemProcessingPurposesComponent', () => {
  let component: ItSystemProcessingPurposesComponent;
  let fixture: ComponentFixture<ItSystemProcessingPurposesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TaButtonsModule,
        TaCheckboxModule,
        TaDropdownModule,
        CategoricalViewModule,
        HttpClientTestingModule,
        RouterTestingModule,
        TranslateModule.forRoot()
      ],
      declarations: [ItSystemProcessingPurposesComponent],
      providers: [DataInventoryService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItSystemProcessingPurposesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
