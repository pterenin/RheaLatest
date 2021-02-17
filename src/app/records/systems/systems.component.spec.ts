import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemsComponent } from './systems.component';
import { RouterTestingModule } from '@angular/router/testing';
import { PageWrapperModule } from 'src/app/shared/components/page-wrapper/page-wrapper.module';

describe('SystemsComponent', () => {
  let component: SystemsComponent;
  let fixture: ComponentFixture<SystemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SystemsComponent],
      imports: [RouterTestingModule, PageWrapperModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
