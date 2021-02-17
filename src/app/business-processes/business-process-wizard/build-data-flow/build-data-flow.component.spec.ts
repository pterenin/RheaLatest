import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ToastService } from '@trustarc/ui-toolkit';

import { BuildDataFlowNewUiComponent } from './build-data-flow.component';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

describe('BuildDataFlowNewUiComponent', () => {
  let component: BuildDataFlowNewUiComponent;
  let fixture: ComponentFixture<BuildDataFlowNewUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BuildDataFlowNewUiComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        ToastService,
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              params: of(convertToParamMap({ id: 'business-process-Id-123' }))
            }
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildDataFlowNewUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
