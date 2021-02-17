import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageHeaderTitleComponent } from './page-header-title.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('PageHeaderTitleComponent', () => {
  let component: PageHeaderTitleComponent;
  let fixture: ComponentFixture<PageHeaderTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PageHeaderTitleComponent],
      imports: [RouterTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageHeaderTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
