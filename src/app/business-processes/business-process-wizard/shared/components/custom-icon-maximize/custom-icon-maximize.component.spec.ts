import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomIconMaximizeComponent } from './custom-icon-maximize.component';

describe('CustomIconMaximizeComponent', () => {
  let component: CustomIconMaximizeComponent;
  let fixture: ComponentFixture<CustomIconMaximizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomIconMaximizeComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomIconMaximizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
