import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SystemRecordInfoComponent } from './system-record-info.component';
import { DataSubjectPipeModule } from '../../../../../shared/pipes/data-subject/data-subject.module';
import { DataElementPipeModule } from '../../../../../shared/pipes/data-element/data-element.module';
import { ProcessingPurposePipeModule } from '../../../../../shared/pipes/processing-purpose/processing-purpose.module';
import { LocationPipeModule } from 'src/app/shared/pipes/location/location.module';
import { RecordIconModule } from '../../../../../shared/_components/record-icon/record-icon.module';

describe('SystemRecordInfoComponent', () => {
  let component: SystemRecordInfoComponent;
  let fixture: ComponentFixture<SystemRecordInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SystemRecordInfoComponent],
      imports: [
        DataSubjectPipeModule,
        DataElementPipeModule,
        ProcessingPurposePipeModule,
        LocationPipeModule,
        RecordIconModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemRecordInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
