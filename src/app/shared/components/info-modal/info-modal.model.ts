export type Position = 'bottom-left' | 'top-left';

export interface InfoToolTipData {
  sendingEntity: DataElements;
  receivingEntity: DataElements;
  isSaleOfData: Boolean;
}

export interface DataElements {
  name: String;
  jobTitle: String;
  emailAddress: String;
  telephoneNumber: String;
  salary: String;
  homeAddress: String;
}
