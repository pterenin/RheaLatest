import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HighchartsChartModule } from 'highcharts-angular';
import { FlowchartContainerComponent } from './flowchart-container.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  TaAccordionModule,
  TaBadgeModule,
  TaPopoverModule,
  TaSvgIconModule,
  TaTabsetModule,
  TaToggleSwitchModule,
  TaTooltipModule,
  ToastService
} from '@trustarc/ui-toolkit';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

describe('FlowchartContainerComponent', () => {
  let component: FlowchartContainerComponent;
  let fixture: ComponentFixture<FlowchartContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FlowchartContainerComponent],
      providers: [ToastService],
      imports: [
        HighchartsChartModule,
        HttpClientModule,
        HttpClientTestingModule,
        RouterTestingModule,
        TaPopoverModule,
        TaSvgIconModule,
        TaTooltipModule,
        TaTabsetModule,
        TaToggleSwitchModule,
        TaBadgeModule,
        TaAccordionModule,
        CommonModule,
        BrowserModule,
        FormsModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowchartContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should bind Highcharts', () => {
    expect(component.highcharts).toBeTruthy();
  });

  it('should have correct class name', () => {
    expect(
      fixture.nativeElement.querySelector('highcharts-chart').className
    ).toBe('flowchartContainer');
  });
});
