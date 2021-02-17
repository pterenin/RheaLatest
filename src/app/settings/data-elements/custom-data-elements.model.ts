import { DataElementType } from 'src/app/shared/models/data-elements.model';
import { BaseDomainInterface } from 'src/app/shared/models/base-domain-model';

export interface DataElementSettingsInterface extends BaseDomainInterface {
  dataElementType: DataElementType;
  isCustom: boolean;
  isHidden: boolean;
  name: string;
  numberOfLinkedRecords: number;
}
