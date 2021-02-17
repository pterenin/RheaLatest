import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorComponent } from './collaborator.component';
import { FormsModule } from '@angular/forms';

describe('CollaboratorComponent', () => {
  let component: CollaboratorComponent;
  let fixture: ComponentFixture<CollaboratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CollaboratorComponent],
      imports: [FormsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
