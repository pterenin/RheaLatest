export interface CyDescription {
  selector: string;
  alias: string;
}
export interface Page {
  save: CyDescription;
  cancel: CyDescription;
  back: CyDescription;
  next: CyDescription;
  exit: CyDescription;
  title: CyDescription;
  finish: CyDescription;
}
