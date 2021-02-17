import {
  getDefaultUIFeatures,
  getNewUIFeatures,
  getPreviousUIFeatures
} from './api-app-features-constants';
import { ApplicationFeatures, ApiAccessToken } from './models-api';

/**
 * get Rhea Application Licenses from RHEA feature-flag API
 */
export function getByApiApplicationFeaturesStatus() {
  // verify JWT token exist
  const tokenAAA = localStorage.getItem('aaa-token');
  // tslint:disable-next-line: no-unused-expression
  expect(tokenAAA).not.null;

  const baseUrl = Cypress.config().baseUrl;
  const api = {
    method: 'GET',
    url: 'api/hub/feature-flag/all',
    alias: '@api'
  };

  cy.server();
  cy.request({
    method: api.method,
    url: `${baseUrl}/${api.url}`,
    auth: {
      bearer: tokenAAA
    }
  })
    .its('body')
    .then(body => {
      const features = body as ApplicationFeatures;
      expect(features).to.have.property('CUSTOMIZATION_DATA_SUBJECTS_LICENSE');
      expect(features).to.have.property('CUSTOMIZATION_DEPARTMENT_LICENSE');
      expect(features).to.have.property('RISK_PROFILE_LICENSE');
      expect(features).to.have.property('RISK_PROFILE_THIRD_PARTY_LICENSE');
      expect(features).to.have.property('RHEA_NEW_UI_STEPS_34_LICENSE');
      expect(features).to.have.property(
        'CUSTOMIZATION_PROCESSING_PURPOSES_LICENSE'
      );
      expect(features).to.have.property('RHEA_NEW_UI_ALL_STEPS_LICENSE');
      expect(features).to.have.property('REPORTING_TRAINING_LICENSE');
      expect(features).to.have.property('RISK_SERVICE_V2');

      // console.log('%c%o', 'color: #00a3cc', body);
      // console.log('%c%o', 'color: #00a3cc', features);

      // if (features) {
      //   window.localStorage.setItem('rhea-licenses', JSON.stringify(features));
      //   console.log(
      //     `%c token:`,
      //     'color:orange;',
      //     window.localStorage.getItem('rhea-licenses')
      //   );
      //   cy.saveLocalStorageCache();
      // }

      Cypress.env('licenses.rhea', features);

      return features;
    });
}

/**
 * Enable or Disable any feature for Rhea Account through Plutus API,
 * this require plutus API token before executing this.
 * @param accountId Account Id
 * @param featureName Feature Name
 * @param enableOrDisable boolean (true to enable, false to disable)
 */
export function updateByApiFeatureStatus(
  accountId: string,
  featureName: string,
  enableOrDisable: boolean
) {
  // ---- verify JWT token exist ---------------------------------------
  // tslint:disable: no-unused-expression
  const tokenString = localStorage.getItem('aaa-plutus-token');
  expect(tokenString).not.null;
  const tokenAAA = JSON.parse(tokenString as string) as ApiAccessToken;
  expect(tokenAAA).not.null;
  // ---- --------------------------------------------------------------

  const baseUrl = Cypress.env('externalApplications').plutus.baseUrl;
  const apiUrl = `api/hub/feature-management/accounts/${accountId}/features/${featureName}`;
  const api = {
    method: 'PUT',
    url: apiUrl,
    alias: '@api'
  };

  cy.server();
  cy.request({
    method: api.method,
    url: `${baseUrl}/${api.url}`,
    auth: {
      bearer: tokenAAA.access_token
    },
    body: {
      value: enableOrDisable
    }
  })
    .its('body')
    .then(body => {
      expect(body).to.have.property(
        'value',
        enableOrDisable === true ? 'true' : 'false'
      );
      return body.value as boolean;
    });
  return cy.wrap(true);
}

export function stubApiResponse_GetFeatureAll(
  uiFeatureType: 'DEFAULT' | 'NEW' | 'PREVIOUS' = 'DEFAULT'
) {
  cy.server();
  let response = null;
  switch (uiFeatureType) {
    case 'NEW':
      response = getNewUIFeatures;
      break;
    case 'PREVIOUS':
      response = getPreviousUIFeatures;
      break;
    case 'DEFAULT':
      response = getDefaultUIFeatures;
      break;
  }
  cy.route('GET', '**/feature-flag/all', response as any);
}
