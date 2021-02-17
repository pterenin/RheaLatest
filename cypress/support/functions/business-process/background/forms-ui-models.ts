import { CyDescription } from '../../data-inventory/it-system/forms-ui-models';

export module BusinessProcess {
  export interface Background {
    title: CyDescription;
    processName: CyDescription;
    peopleRange: CyDescription;
    description: CyDescription;
    notes: CyDescription;
    attachments: CyDescription;
    modalClose: CyDescription;
  }
}
