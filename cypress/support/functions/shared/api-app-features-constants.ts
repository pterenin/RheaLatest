export const FEATURES = {
  CUSTOMIZATION_DATA_SUBJECTS_LICENSE: false,
  RHEA_FILTER_BY_DATABASE: true,
  PRIVACY_SHIELD: false,
  RISK_PROFILE_LICENSE: false,
  PI_CCPA: true,
  PRIVACY_ASSURANCE: false,
  RHEA_BP_REVALIDATION_DATE: false,
  PI_ALL: false,
  ACCOUNT_INTERNAL: false,
  CUSTOMIZATION_DEPARTMENT_LICENSE: false,
  RISK_PROFILE_ASSESSMENT_LICENSE: false,
  RHEA_NEW_AUDIT_LOG: true,
  RISK_PROFILE_THIRD_PARTY_LICENSE: false,
  CUSTOMIZATION_DATA_ELEMENT_LICENSE: false,
  CUSTOMIZATION_PROCESSING_PURPOSES_LICENSE: false,
  REPORTING_TRAINING_LICENSE: false,
  ALERT_NOTIFICATION: false,
  RISK_SERVICE_V2: false,

  RHEA_NEW_UI_ALL_STEPS_LICENSE: false,
  RHEA_NEW_UI_STEPS_34_LICENSE: false
};

/**
 * returns the list of features require to  enabled New User Interface
 */
export const getDefaultUIFeatures = () => {
  const newFeatures = FEATURES;
  newFeatures.RHEA_NEW_UI_ALL_STEPS_LICENSE = true;
  newFeatures.RHEA_NEW_UI_STEPS_34_LICENSE = true;
  return newFeatures;
};

/**
 * returns the list of features require to  enabled New User Interface
 */
export const getNewUIFeatures = () => {
  const newFeatures = FEATURES;
  newFeatures.RHEA_NEW_UI_ALL_STEPS_LICENSE = true;
  newFeatures.RHEA_NEW_UI_STEPS_34_LICENSE = true;
  return newFeatures;
};

/**
 * returns the list of features require to enable Previous Interface
 */
export const getPreviousUIFeatures = () => {
  const newFeatures = FEATURES;
  newFeatures.RHEA_NEW_UI_ALL_STEPS_LICENSE = false;
  newFeatures.RHEA_NEW_UI_STEPS_34_LICENSE = false;
  return newFeatures;
};
