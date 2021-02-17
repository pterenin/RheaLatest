export type RiskType =
  | 'LIKELY_HIGH_RISK'
  | 'POSSIBLY_HIGH_RISK'
  | 'RISK_UNLIKELY'
  | 'INCOMPLETE_FIELDS'
  | 'USER_DETERMINED_NO_INDICATOR';

export const RISK_TYPE_LABELS = {
  LIKELY_HIGH_RISK: 'Likely High Risk',
  POSSIBLY_HIGH_RISK: 'Possibly High Risk',
  RISK_UNLIKELY: 'Risk Unlikely',
  INCOMPLETE_FIELDS: 'Incomplete Fields',
  USER_DETERMINED_NO_INDICATOR: '--'
};
