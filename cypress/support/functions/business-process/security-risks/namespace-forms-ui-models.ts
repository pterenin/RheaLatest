import { CyDescription } from '../../shared/models-ui';

export interface SecurityRisks {
  processName: CyDescription;
  title: CyDescription;
  securityControlOther: CyDescription;
  securityControlOtherName: CyDescription;
  retentionPeriod: CyDescription;
  retentionPeriodUnit: CyDescription;
  selectProcessingPurposes: CyDescription;
  selectDataElements: CyDescription;
}
