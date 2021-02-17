import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ta-download-report-fake-progress-bar',
  templateUrl: './download-report-fake-progress-bar.component.html',
  styleUrls: ['./download-report-fake-progress-bar.component.scss']
})
export class DownloadReportFakeProgressBarComponent implements OnInit {
  constructor() {}

  public displayProgress = 0;
  private currentProgress = 0;
  private speed = 0.1;

  ngOnInit() {
    const interval = setInterval(() => {
      this.currentProgress += this.speed;
      this.displayProgress =
        Math.round(
          (Math.atan(this.currentProgress) / (Math.PI / 2)) * 100 * 1000
        ) / 1000;
      if (this.displayProgress >= 100) {
        clearInterval(interval);
      } else if (this.displayProgress >= 70) {
        this.speed = 0.15;
      }
    }, 1000);
  }
}
