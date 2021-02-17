import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmUnlinkDataElementCategoriesComponent } from './confirm-unlink-data-element-categories.component';
import {
  TaActiveModal,
  TaButtonsModule,
  TaDatagridModule,
  TaModalModule,
  TaTableModule,
  TaToastModule
} from '@trustarc/ui-toolkit';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('ConfirmUnlinkDataElementCategoriesComponent', () => {
  let component: ConfirmUnlinkDataElementCategoriesComponent;
  let fixture: ComponentFixture<ConfirmUnlinkDataElementCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmUnlinkDataElementCategoriesComponent],
      imports: [
        TaButtonsModule,
        TaTableModule,
        TaToastModule,
        RouterTestingModule,
        ReactiveFormsModule,
        TaModalModule,
        CommonModule,
        HttpClientTestingModule,
        TaDatagridModule,
        TranslateModule.forRoot()
      ],
      providers: [TaActiveModal, TranslateService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(
      ConfirmUnlinkDataElementCategoriesComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
