import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemsSelectionComponent } from './systems-selection.component';
import { RecordIconComponent } from '../../../shared/_components/record-icon/record-icon.component';
import {
  SystemRecordFilterComponent,
  BusinessProcessWizardFooterComponent,
  ModalConfirmationBasicComponent,
  ModalConfirmationThreeButtonComponent
} from '../shared';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TaAccordionModule,
  TaButtonsModule,
  TaDropdownModule,
  TaModalModule,
  TaPopoverModule,
  TaSvgIconModule,
  TaTableModule,
  TaTabsetModule,
  TaCheckboxModule
} from '@trustarc/ui-toolkit';
import {
  SystemRecordNoneComponent,
  SystemRecordTabDataElementComponent,
  SystemRecordTabDataSubjectComponent,
  SystemRecordTabProcessingPurposeComponent,
  SelectedSystemRecordFilterComponent
} from '../shared';
import { RecordIconModule } from 'src/app/shared/_components/record-icon/record-icon.module';
import { RouterTestingModule } from '@angular/router/testing';
import { CustomIconMaximizeComponent } from '../shared/components/custom-icon-maximize/custom-icon-maximize.component';
import { CustomIconMinimizeComponent } from '../shared/components/custom-icon-minimize/custom-icon-minimize.component';

describe('SystemsSelectionComponent', () => {
  let component: SystemsSelectionComponent;
  let fixture: ComponentFixture<SystemsSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SystemsSelectionComponent,
        SystemRecordNoneComponent,
        SystemRecordTabDataElementComponent,
        SystemRecordTabDataSubjectComponent,
        SystemRecordTabProcessingPurposeComponent,
        SystemRecordFilterComponent,
        SelectedSystemRecordFilterComponent,
        RecordIconComponent,
        BusinessProcessWizardFooterComponent,
        ModalConfirmationBasicComponent,
        ModalConfirmationThreeButtonComponent,
        RouterTestingModule,
        CustomIconMaximizeComponent,
        CustomIconMinimizeComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        TaDropdownModule,
        TaSvgIconModule,
        TaPopoverModule,
        TaButtonsModule,
        TaAccordionModule,
        TaTableModule,
        TaTabsetModule,
        TaCheckboxModule,
        RecordIconModule,
        TaModalModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemsSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
