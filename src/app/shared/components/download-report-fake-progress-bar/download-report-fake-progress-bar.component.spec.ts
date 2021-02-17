import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadReportFakeProgressBarComponent } from './download-report-fake-progress-bar.component';
import { TaProgressbarModule } from '@trustarc/ui-toolkit';

describe('DownloadReportFakeProgressBarComponent', () => {
  let component: DownloadReportFakeProgressBarComponent;
  let fixture: ComponentFixture<DownloadReportFakeProgressBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TaProgressbarModule],
      declarations: [DownloadReportFakeProgressBarComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadReportFakeProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
