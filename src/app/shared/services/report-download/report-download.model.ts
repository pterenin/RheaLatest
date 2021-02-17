import { ReportDownloadType } from './report-download.constant';

export interface ReportDownloadDataFlowOptions {
  includeDataFlowChart: boolean;
  includeGlobalMap: boolean;
}

export interface MultiDocumentFileRequest
  extends ReportDownloadDataFlowOptions {
  entityIds: string[];
  reportType: ReportDownloadType;
  zip?: boolean;
}
