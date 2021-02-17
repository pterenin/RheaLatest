import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageNavMinimalComponent } from './page-nav-minimal.component';

describe('PageNavMinimalComponent', () => {
  let component: PageNavMinimalComponent;
  let fixture: ComponentFixture<PageNavMinimalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PageNavMinimalComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageNavMinimalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
