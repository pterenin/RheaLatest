import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordIconComponent } from './record-icon.component';
import { ReplacePipeModule } from '../../pipes/replace/replace.module';
import { TaTooltipModule } from '@trustarc/ui-toolkit';

describe('RecordIconComponent', () => {
  let component: RecordIconComponent;
  let fixture: ComponentFixture<RecordIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RecordIconComponent],
      imports: [TaTooltipModule, ReplacePipeModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordIconComponent);
    component = fixture.componentInstance;
    component.type = 'VENDOR';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
