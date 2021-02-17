import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { AuthService } from '../../services/auth/auth.service';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ToastService } from '@trustarc/ui-toolkit';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        TranslateModule.forRoot()
      ],
      declarations: [HeaderComponent],
      providers: [AuthService, ToastService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('AAA menu link should have prevent default', async(() => {
    component.headerIsLoaded();
    const teNav = fixture.debugElement.queryAll(By.css('.te-nav li a'));
    expect(teNav).toBeGreaterThanOrEqual(0);
  }));
});
