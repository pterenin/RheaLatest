import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItSystemDataElementsComponent } from './it-system-data-elements.component';
import { TranslateModule } from '@ngx-translate/core';
import {
  TaButtonsModule,
  TaCheckboxModule,
  TaDropdownModule
} from '@trustarc/ui-toolkit';
import { CategoricalViewModule } from 'src/app/shared/components/categorical-view/categorical-view.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DataInventoryService } from 'src/app/data-inventory/data-inventory.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('ItSystemDataElementsComponent', () => {
  let component: ItSystemDataElementsComponent;
  let fixture: ComponentFixture<ItSystemDataElementsComponent>;

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
      declarations: [ItSystemDataElementsComponent],
      providers: [DataInventoryService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItSystemDataElementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
