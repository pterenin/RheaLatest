import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaTabsetModule } from '@trustarc/ui-toolkit';
import { TabGuardedComponent } from './tab-guarded.component';

describe('TabGuardedComponent', () => {
  let component: TabGuardedComponent;
  let fixture: ComponentFixture<TabGuardedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TabGuardedComponent],
      imports: [TaTabsetModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabGuardedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
