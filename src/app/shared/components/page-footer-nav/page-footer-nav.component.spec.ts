import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageFooterNavComponent } from './page-footer-nav.component';

describe('PageFooterNavComponent', () => {
  let component: PageFooterNavComponent;
  let fixture: ComponentFixture<PageFooterNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PageFooterNavComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageFooterNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
