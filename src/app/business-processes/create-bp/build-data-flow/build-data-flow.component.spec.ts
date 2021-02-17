import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  TaTabsetModule,
  TaProgressbarModule,
  TaPopoverModule,
  TaTagsModule,
  TaBadgeModule,
  TaDropdownModule,
  ToastService,
  TaToggleSwitchModule,
  TaSvgIconModule
} from '@trustarc/ui-toolkit';
import { ReplacePipeModule } from 'src/app/shared/pipes/replace/replace.module';
import { DataFlowPopoverComponent } from './data-flow-popover/data-flow-popover.component';
import { DataFlowSelectedItemsComponent } from './data-flow-selected-items/data-flow-selected-items.component';
import { DataFlowDropdownComponent } from './data-flow-dropdown/data-flow-dropdown.component';
import { DataFlowDropdownLabelComponent } from './data-flow-dropdown-label/data-flow-dropdown-label.component';
import { HighchartsContainerComponent } from 'src/app/shared/components/highcharts-container/highcharts-container.component';
import { LocationModule } from 'src/app/shared/components/location/location.module';
import { CategoricalViewModule } from 'src/app/shared/components/categorical-view/categorical-view.module';
import { StepContainerService } from '../step-container/step-container.service';
import { BusinessProcessWizardHeaderModule } from '../../business-process-wizard/shared';
import { BuildDataFlowComponent } from './build-data-flow.component';

describe('BuildDataFlowComponent', () => {
  let component: BuildDataFlowComponent;
  let fixture: ComponentFixture<BuildDataFlowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BuildDataFlowComponent,
        DataFlowPopoverComponent,
        DataFlowSelectedItemsComponent,
        DataFlowDropdownComponent,
        DataFlowDropdownLabelComponent,
        HighchartsContainerComponent
      ],
      imports: [
        BusinessProcessWizardHeaderModule,
        CategoricalViewModule,
        ReplacePipeModule,
        LocationModule,
        HttpClientTestingModule,
        TaDropdownModule,
        TaToggleSwitchModule,
        TaBadgeModule,
        TaTabsetModule,
        TaProgressbarModule,
        TaPopoverModule,
        TaTagsModule,
        TaSvgIconModule,
        RouterTestingModule.withRoutes([{ path: '**', redirectTo: '' }])
      ],
      providers: [ToastService, StepContainerService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildDataFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
