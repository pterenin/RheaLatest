import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomIconMinimizeComponent } from './custom-icon-minimize.component';

describe('CustomIconMinimizeComponent', () => {
  let component: CustomIconMinimizeComponent;
  let fixture: ComponentFixture<CustomIconMinimizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomIconMinimizeComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomIconMinimizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
