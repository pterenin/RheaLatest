import { CyDescription } from '../../data-inventory/it-system/forms-ui-models';

export module BusinessProcess {
  export interface Owner {
    processName: CyDescription;
    title: CyDescription;
    entity: CyDescription;
    entityRole: CyDescription;
    fullName: CyDescription;
    email: CyDescription;
    department: CyDescription;
  }
}
