export interface ImportInterface {
  fileErrors: FileErrorInterface[];
  recordCount: number;
}

export interface FileErrorInterface {
  error: string;
  fileName: string;
}
