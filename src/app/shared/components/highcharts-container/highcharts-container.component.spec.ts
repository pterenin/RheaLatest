import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HighchartsChartModule } from 'highcharts-angular';

import { HighchartsContainerComponent } from './highcharts-container.component';
import { FlowchartContainerComponent } from './flowchart-container/flowchart-container.component';
import {
  TaAccordionModule,
  TaBadgeModule,
  TaPopoverModule,
  TaSvgIconModule,
  TaTabsetModule,
  TaToggleSwitchModule,
  TaProgressbarModule,
  TaTooltipModule,
  ToastService
} from '@trustarc/ui-toolkit';
// tslint:disable-next-line:max-line-length
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RheaUiLibraryModule } from 'projects/rhea-ui-library/src/public-api';

describe('HighchartsContainerComponent', () => {
  let component: HighchartsContainerComponent;
  let fixture: ComponentFixture<HighchartsContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HighchartsContainerComponent, FlowchartContainerComponent],
      providers: [ToastService],
      imports: [
        TaTabsetModule,
        HighchartsChartModule,
        HttpClientModule,
        HttpClientTestingModule,
        RouterTestingModule,
        TaAccordionModule,
        TaPopoverModule,
        TaSvgIconModule,
        TaTooltipModule,
        TaProgressbarModule,
        BrowserModule,
        CommonModule,
        FormsModule,
        TaToggleSwitchModule,
        TaBadgeModule,
        TaAccordionModule,
        RheaUiLibraryModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HighchartsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
