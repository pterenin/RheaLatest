import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// tslint:disable-next-line:max-line-length
import { BusinessProcessesListComponent } from 'src/app/business-processes/all-bp/business-processes-list/business-processes-list.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { InlineTagEditorModule } from 'src/app/shared/components/inline-tag-editor/inline-tag-editor.module';
import { DatagridHeaderModule } from 'src/app/shared/components/record-datagrid/datagrid-header/datagrid-header.module';
import { DatagridFooterModule } from 'src/app/shared/components/record-datagrid/datagrid-footer/datagrid-footer.module';
import {
  TaCheckboxModule,
  TaDatagridModule,
  TaDropdownModule,
  TaPaginationModule,
  TaPopoverModule,
  TaSvgIconModule,
  TaTableModule,
  TaTagsModule,
  TaToastModule,
  TaTooltipModule
} from '@trustarc/ui-toolkit';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
// tslint:disable-next-line:max-line-length
import { ViewRowsDropdownModule } from 'src/app/shared/components/record-datagrid/datagrid-header/view-rows-dropdown/view-rows-dropdown.module';
import { RiskIndicatorModule } from 'src/app/shared/components/risk-indicator/risk-indicator.module';
import { TrafficSignalRiskIndicatorModule } from 'src/app/shared/components/traffic-risk-indicator/traffic-risk-indicator.module';
import { CustomFiltersModule } from 'src/app/shared/components/custom-filters/custom-filters.module';
// tslint:disable-next-line:max-line-length
import { DatagridAddBpButtonModule } from 'src/app/shared/components/record-datagrid/datagrid-header/datagrid-add-bp-button/datagrid-add-bp-button.module';
import { ReactiveFormsModule } from '@angular/forms';
import { InlineOwnerEditorModule } from 'src/app/shared/components/inline-owner-editor/inline-owner-editor.module';
import { InlineBpNameEditorModule } from 'src/app/shared/components/inline-bp-name-editor/inline-bp-name-editor.module';
import { ReplacePipeModule } from 'src/app/shared/pipes/replace/replace.module';
import { OwnerPipeModule } from 'src/app/shared/pipes/owner/owner.module';
import { StatusThemePipeModule } from 'src/app/shared/pipes/status/status.module';
import { CapitalizeCasePipeModule } from 'src/app/shared/pipes/string/string.module';
import { DatagridHeaderService } from 'src/app/shared/services/record-listing/datagrid-header.service';
import { TagsSelectorService } from 'src/app/shared/components/tags-selector/tags-selector.service';
import { TranslateModule } from '@ngx-translate/core';

describe('BusinessProcessesListComponent', () => {
  let component: BusinessProcessesListComponent;
  let fixture: ComponentFixture<BusinessProcessesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessProcessesListComponent],
      imports: [
        NgxSkeletonLoaderModule,
        InlineTagEditorModule,
        DatagridHeaderModule,
        DatagridFooterModule,
        TaDatagridModule,
        HttpClientTestingModule,
        RouterTestingModule,
        TaToastModule,
        TaTableModule,
        TaPopoverModule,
        TaPaginationModule,
        ViewRowsDropdownModule,
        RiskIndicatorModule,
        TrafficSignalRiskIndicatorModule,
        CustomFiltersModule,
        DatagridAddBpButtonModule,
        TaDropdownModule,
        TaTooltipModule,
        TaSvgIconModule,
        TaTagsModule,
        TaCheckboxModule,
        ReactiveFormsModule,
        InlineOwnerEditorModule,
        InlineBpNameEditorModule,
        OwnerPipeModule,
        ReplacePipeModule,
        StatusThemePipeModule,
        CapitalizeCasePipeModule,
        TranslateModule.forRoot()
      ],
      providers: [DatagridHeaderService, TagsSelectorService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessProcessesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
