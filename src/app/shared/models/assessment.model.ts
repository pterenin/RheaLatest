type AssessmentStatus = string;

export interface BaseRecordAssessmentInterface {
  assessmentStatus: AssessmentStatus;
  id: string;
  version: number;
}

export interface AssessmentsInterface {
  count: number;
  ref: string;
  status: string;
}

export interface AssessmentsCollectionInterface {
  buildAssessmentUrl: string;
  viewAssessmentsUrl: string;
  counts: AssessmentsInterface[];
}
