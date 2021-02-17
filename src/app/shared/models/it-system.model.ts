import { BaseRecordAssessmentInterface } from './assessment.model';
import { AttachmentInterface } from './attachment.model';
import {
  ContactInterface,
  ContactType,
  CreatorInterface,
  UserCreatorInterface
} from './contact.model';
import {
  DataElementInterface,
  DataElementOtherInterface
} from './data-elements.model';
import {
  DataSubjectTypeInterface,
  DataSubjectVolumeInterface
} from './subjects-recipients.model';
import { LocationInterface } from './location.model';
import { ProcessingPurposeInterface } from './processing-purposes.model';
import { TagGroupAndValueInterface } from './tags.model';

export interface ItSystemInterface {
  attachments: AttachmentInterface[];
  baseRecordAssessments: BaseRecordAssessmentInterface[];
  contact: ContactInterface;
  contactType: ContactType;
  created: string;
  createdBy: CreatorInterface;
  createdByUser: UserCreatorInterface;
  dataElements: DataElementInterface[];
  dataElementsOther: DataElementOtherInterface[];
  dataSubjectVolume: DataSubjectVolumeInterface;
  dataSubjects: DataSubjectTypeInterface[];
  description: string;
  id: string;
  identifier: string;
  internalId: string;
  lastModified: string;
  lastModifiedBy: CreatorInterface;
  locations: LocationInterface[];
  name: string;
  notes: string;
  owner: CreatorInterface;
  processingPurposes: ProcessingPurposeInterface[];
  recordType: string;
  tags: TagGroupAndValueInterface[];
  version: number;
}
