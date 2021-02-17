import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { OwingOrganizationsContactsComponent } from './owing-organizations-contacts.component';
import { RouterTestingModule } from '@angular/router/testing';
import {
  TaSvgIconModule,
  TaCheckboxModule,
  TaTableModule,
  TaTooltipModule
} from '@trustarc/ui-toolkit';

describe('OwingOrganizationsContactsComponent', () => {
  let component: OwingOrganizationsContactsComponent;
  let fixture: ComponentFixture<OwingOrganizationsContactsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OwingOrganizationsContactsComponent],
      imports: [
        RouterTestingModule,
        TaSvgIconModule,
        TaCheckboxModule,
        TaTableModule,
        HttpClientTestingModule,
        TaTooltipModule
      ],
      providers: [
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
    fixture = TestBed.createComponent(OwingOrganizationsContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
