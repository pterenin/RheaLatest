import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmintegrationComponent } from './am-integration.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TaToastModule } from '@trustarc/ui-toolkit';

describe('AmintegrationComponent', () => {
  let component: AmintegrationComponent;
  let fixture: ComponentFixture<AmintegrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, TaToastModule],
      declarations: [AmintegrationComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmintegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
