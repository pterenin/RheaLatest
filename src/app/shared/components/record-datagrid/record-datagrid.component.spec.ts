import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { RecordDatagridComponent } from './record-datagrid.component';
import {
  TaCheckboxModule,
  TaDatagridModule,
  TaDatepickerModule,
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
import { DatagridHeaderModule } from './datagrid-header/datagrid-header.module';
import { RouterTestingModule } from '@angular/router/testing';
import { DatagridFooterModule } from './datagrid-footer/datagrid-footer.module';
import { TranslateModule } from '@ngx-translate/core';
import { ViewRowsDropdownModule } from './datagrid-header/view-rows-dropdown/view-rows-dropdown.module';
import { RiskIndicatorModule } from '../risk-indicator/risk-indicator.module';
import { TrafficSignalRiskIndicatorModule } from 'src/app/shared/components/traffic-risk-indicator/traffic-risk-indicator.module';
import { DatagridAddBpButtonModule } from './datagrid-header/datagrid-add-bp-button/datagrid-add-bp-button.module';
import { CustomFiltersModule } from 'src/app/shared/components/custom-filters/custom-filters.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ReplacePipeModule } from '../../pipes/replace/replace.module';
import { InlineTagEditorModule } from 'src/app/shared/components/inline-tag-editor/inline-tag-editor.module';
import { TagsSelectorService } from 'src/app/shared/components/tags-selector/tags-selector.service';
import { DatagridHeaderService } from '../../services/record-listing/datagrid-header.service';
import { InlineOwnerEditorModule } from '../inline-owner-editor/inline-owner-editor.module';

describe('RecordDatagridComponent', () => {
  let component: RecordDatagridComponent;
  let fixture: ComponentFixture<RecordDatagridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
        ReplacePipeModule,
        TaDatepickerModule,
        TranslateModule.forRoot()
      ],
      declarations: [RecordDatagridComponent],
      providers: [DatagridHeaderService, TagsSelectorService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordDatagridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(
    'should update the old-totalElements-value if old-totalElements and current totalElements' +
      'are not equal on ngAfterContentChecked()',
    () => {
      component.oldTotalElements = 5;
      expect(component.oldTotalElements).toEqual(5);
      component.ngAfterContentChecked();
      expect(component.oldTotalElements).toEqual(undefined);
      component.totalElements = 10;
      expect(component.oldTotalElements).toEqual(undefined);
      component.ngAfterContentChecked();
      expect(component.oldTotalElements).toEqual(10);
    }
  );
});
