import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RheaUiLibraryModule } from 'projects/rhea-ui-library/src/public-api';

import { NoMappedSystemsStateComponent } from './no-mapped-systems-state.component';
// tslint:disable-next-line:max-line-length

describe('NoMappedSystemsStateComponent', () => {
  let component: NoMappedSystemsStateComponent;
  let fixture: ComponentFixture<NoMappedSystemsStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NoMappedSystemsStateComponent],
      imports: [RheaUiLibraryModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoMappedSystemsStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
