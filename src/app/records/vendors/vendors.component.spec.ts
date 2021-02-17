import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorsComponent } from './vendors.component';
import { RouterTestingModule } from '@angular/router/testing';
import { PageWrapperModule } from 'src/app/shared/components/page-wrapper/page-wrapper.module';

describe('VendorsComponent', () => {
  let component: VendorsComponent;
  let fixture: ComponentFixture<VendorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VendorsComponent],
      imports: [RouterTestingModule, PageWrapperModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
