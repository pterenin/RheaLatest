import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageNavDefaultComponent } from './page-nav-default.component';

describe('PageNavDefaultComponent', () => {
  let component: PageNavDefaultComponent;
  let fixture: ComponentFixture<PageNavDefaultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PageNavDefaultComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageNavDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
