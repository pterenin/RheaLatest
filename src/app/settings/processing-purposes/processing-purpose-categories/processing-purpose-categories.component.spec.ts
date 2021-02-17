import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProcessingPurposeCategoriesComponent } from './processing-purpose-categories.component';
import { CategoriesModule } from '../../../shared/components/categories/categories.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TaToastModule } from '@trustarc/ui-toolkit';
import { TranslateModule } from '@ngx-translate/core';

describe('ProcessingPurposeCategoriesComponent', () => {
  let component: ProcessingPurposeCategoriesComponent;
  let fixture: ComponentFixture<ProcessingPurposeCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProcessingPurposeCategoriesComponent],
      imports: [
        CategoriesModule,
        RouterTestingModule,
        HttpClientTestingModule,
        TaToastModule,
        TranslateModule.forRoot()
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessingPurposeCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
