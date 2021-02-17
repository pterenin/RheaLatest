import { CyDescription } from '../../../shared';

export interface Details {
  navigation: CyDescription;
  formDetails: CyDescription;
  title: CyDescription;
  tagsButton: CyDescription;
  attachmentsButton: CyDescription;
  tagsModal: CyDescription;
  attachmentsModal: CyDescription;
  processName: CyDescription;
  peopleRange: CyDescription;
  description: CyDescription;
  notes: CyDescription;
  owingOrganizationsTitle: CyDescription;
  emptyOwingOrganizationsAndContacts: CyDescription;
  addOwnerButton: CyDescription;
  addEditOwnerModalDef: AddEditOwnerModal;
  table: CyDescription;
}

export interface AddEditOwnerModal {
  addEditOwnerModal: CyDescription;
  addOwnerModalButton: CyDescription;
  ownerDef: Owner;
}

export interface Owner {
  company: CyDescription;
  role: CyDescription;
  fullName: CyDescription;
  email: CyDescription;
  department: CyDescription;
}
