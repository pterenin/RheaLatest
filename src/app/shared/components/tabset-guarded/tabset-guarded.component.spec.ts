import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsetGuardedComponent } from './tabset-guarded.component';
import { TaTabsetModule } from '@trustarc/ui-toolkit';

describe('TabsetGuardedComponent', () => {
  let component: TabsetGuardedComponent;
  let fixture: ComponentFixture<TabsetGuardedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TabsetGuardedComponent],
      imports: [TaTabsetModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsetGuardedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
