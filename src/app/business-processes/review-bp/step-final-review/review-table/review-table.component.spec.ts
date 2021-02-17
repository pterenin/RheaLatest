import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewTableComponent } from './review-table.component';
import {
  TaPaginationModule,
  TaTableModule,
  TaTooltipModule,
  TaPopoverModule,
  TaButtonsModule,
  TaBadgeModule
} from '@trustarc/ui-toolkit';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CategoricalViewModule } from 'src/app/shared/components/categorical-view/categorical-view.module';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterModule } from '@angular/router';

import { PaginatePipeModule } from 'src/app/shared/pipes/paginate/paginate.module';
import { SortByPipeModule } from 'src/app/shared/_pipes/sort-by/sort-by.module';

describe('ReviewTableComponent', () => {
  let component: ReviewTableComponent;
  let fixture: ComponentFixture<ReviewTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewTableComponent],
      imports: [
        CategoricalViewModule,
        TaTableModule,
        TaPaginationModule,
        HttpClientModule,
        HttpClientTestingModule,
        RouterModule,
        RouterTestingModule,
        TaPopoverModule,
        TaButtonsModule,
        TaBadgeModule,
        PaginatePipeModule,
        TaTooltipModule,
        SortByPipeModule
      ],
      providers: []
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
