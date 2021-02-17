import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DataSubjectDetailsComponent } from './data-subject-details.component';
import { CategoriesModule } from '../../../../../shared/components/categories/categories.module';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TaToastModule } from '@trustarc/ui-toolkit';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { DataSubjectDetailsService } from './data-subject-details.service';

describe('DataSubjectDetailsComponent', () => {
  let component: DataSubjectDetailsComponent;
  let fixture: ComponentFixture<DataSubjectDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DataSubjectDetailsComponent],
      imports: [
        CategoriesModule,
        RouterTestingModule,
        HttpClientTestingModule,
        TaToastModule,
        TranslateModule.forRoot()
      ],
      providers: [
        DataSubjectDetailsService,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ dataSubjectId: 'ds-id-123' })
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSubjectDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
