import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProcessingPurposeDetailsComponent } from './processing-purpose-details.component';
import { CategoriesModule } from '../../../../../shared/components/categories/categories.module';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TaToastModule } from '@trustarc/ui-toolkit';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ProcessingPurposeDetailsService } from './processing-purpose-details.service';

describe('ProcessingPurposeDetailsComponent', () => {
  let component: ProcessingPurposeDetailsComponent;
  let fixture: ComponentFixture<ProcessingPurposeDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProcessingPurposeDetailsComponent],
      imports: [
        CategoriesModule,
        RouterTestingModule,
        HttpClientTestingModule,
        TaToastModule,
        TranslateModule.forRoot()
      ],
      providers: [
        ProcessingPurposeDetailsService,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ processingPurposeId: 'de-Id-123' })
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessingPurposeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
