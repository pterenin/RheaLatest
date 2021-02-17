import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageNavComponent } from './page-nav.component';
import { PageNavModule } from './page-nav.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('PageNavComponent', () => {
  let component: PageNavComponent;
  let fixture: ComponentFixture<PageNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PageNavModule, RouterTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
