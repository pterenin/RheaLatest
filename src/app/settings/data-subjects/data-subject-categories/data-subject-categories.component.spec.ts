import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DataSubjectCategoriesComponent } from './data-subject-categories.component';
import { CategoriesModule } from '../../../shared/components/categories/categories.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TaToastModule } from '@trustarc/ui-toolkit';
import { TranslateModule } from '@ngx-translate/core';

describe('DataSubjectCategoriesComponent', () => {
  let component: DataSubjectCategoriesComponent;
  let fixture: ComponentFixture<DataSubjectCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DataSubjectCategoriesComponent],
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
    fixture = TestBed.createComponent(DataSubjectCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
