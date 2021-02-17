import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DataElementDetailsComponent } from './data-element-details.component';
import { CategoriesModule } from '../../../../../shared/components/categories/categories.module';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TaToastModule } from '@trustarc/ui-toolkit';
import { TranslateModule } from '@ngx-translate/core';
import { DataElementDetailsService } from './data-element-details.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('DataElementDetailsComponent', () => {
  let component: DataElementDetailsComponent;
  let fixture: ComponentFixture<DataElementDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DataElementDetailsComponent],
      imports: [
        CategoriesModule,
        RouterTestingModule,
        HttpClientTestingModule,
        TaToastModule,
        TranslateModule.forRoot()
      ],
      providers: [
        DataElementDetailsService,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ dataElementId: 'de-Id-123' })
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataElementDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
