import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationsComponent } from './organizations.component';
import { RouterTestingModule } from '@angular/router/testing';
import { PageWrapperModule } from 'src/app/shared/components/page-wrapper/page-wrapper.module';

describe('OrganizationsComponent', () => {
  let component: OrganizationsComponent;
  let fixture: ComponentFixture<OrganizationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrganizationsComponent],
      imports: [RouterTestingModule, PageWrapperModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
