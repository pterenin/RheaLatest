import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { TaActiveModal } from '@trustarc/ui-toolkit';
import { ReportDownloadDataFlowOptions } from '../../../services/report-download/report-download.model';

@Component({
  selector: 'ta-modal-report-download',
  templateUrl: './modal-report-download.component.html',
  styleUrls: ['./modal-report-download.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalReportDownloadComponent implements OnInit {
  @Input() public reportName: string;

  public dataFlowOptions: ReportDownloadDataFlowOptions;

  constructor(private activeModal: TaActiveModal) {
    this.dataFlowOptions = {
      includeDataFlowChart: false,
      includeGlobalMap: false
    };
  }

  ngOnInit(): void {}

  public dismiss(): void {
    this.activeModal.dismiss();
  }

  public submit(): void {
    this.activeModal.dismiss(this.dataFlowOptions);
  }
}
