import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { InlineTagEditorComponent } from './inline-tag-editor.component';
import { SearchFilterPipeModule } from 'src/app/shared/pipes/filter/search-filter.module';
import {
  TaButtonsModule,
  TaCheckboxModule,
  TaDropdownModule,
  TaPopoverModule,
  TaSvgIconModule
} from '@trustarc/ui-toolkit';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('InlineTagEditorComponent', () => {
  let component: InlineTagEditorComponent;
  let fixture: ComponentFixture<InlineTagEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InlineTagEditorComponent],
      imports: [
        TaPopoverModule,
        TaDropdownModule,
        TaSvgIconModule,
        TaButtonsModule,
        TaCheckboxModule,
        SearchFilterPipeModule,
        ReactiveFormsModule,
        FormsModule,
        CommonModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InlineTagEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
