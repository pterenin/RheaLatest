import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftNavComponent } from './left-nav.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('LeftNavComponent', () => {
  let component: LeftNavComponent;
  let fixture: ComponentFixture<LeftNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LeftNavComponent],
      imports: [RouterTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
