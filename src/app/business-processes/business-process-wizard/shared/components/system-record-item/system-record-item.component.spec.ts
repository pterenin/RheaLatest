import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SystemRecordItemComponent } from './system-record-item.component';
import { RecordIconComponent } from '../../../../../shared/_components/record-icon/record-icon.component';
import { TaSvgIconModule, TaTooltipModule } from '@trustarc/ui-toolkit';
import { ReplacePipeModule } from '../../../../../shared/pipes/replace/replace.module';

describe('SystemRecordItemComponent', () => {
  let component: SystemRecordItemComponent;
  let fixture: ComponentFixture<SystemRecordItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SystemRecordItemComponent, RecordIconComponent],
      imports: [TaSvgIconModule, TaTooltipModule, ReplacePipeModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemRecordItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
