import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SystemRecordItemListComponent } from './system-record-item-list.component';
import { SystemRecordItemComponent } from '../..';
import { RecordIconComponent } from '../../../../../shared/_components/record-icon/record-icon.component';
import { TaSvgIconModule, TaTooltipModule } from '@trustarc/ui-toolkit';
import { ReplacePipeModule } from '../../../../../shared/pipes/replace/replace.module';
import { ItemButtonComponent } from '../../../../../shared/_components/item-button/item-button.component';

describe('SystemRecordItemListComponent', () => {
  let component: SystemRecordItemListComponent;
  let fixture: ComponentFixture<SystemRecordItemListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SystemRecordItemListComponent,
        SystemRecordItemComponent,
        ItemButtonComponent,
        RecordIconComponent
      ],
      imports: [TaSvgIconModule, TaTooltipModule, ReplacePipeModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemRecordItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
