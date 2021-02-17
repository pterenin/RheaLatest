import { BaseDomainInterface } from '../../../models/base-domain-model';

export interface AttachmentInterface extends BaseDomainInterface {
  comment: string;
  fileName: string;
  uploadDate: number;
}

export interface AddAttachmentResponse extends BaseDomainInterface {
  newAttachment: BaseDomainInterface;
}

export interface AttachmentLink {
  dateCreated: string;
  fileUrl: string;
}
