import * as Utilities from '../../../../support/functions/utilities';
import { selectDropDown } from '../../../../support/functions/shared/ta-dropdown-field';

// Models
import { BusinessProcessAPI } from '../../../../support/functions/business-process/owner/forms-api-models';
import { Page } from '../../../../support/functions/shared/models-ui';

// -------------------  Business Process Models
import * as BPUi from '../../../../support/functions/business-process/namespace-business-process-ui';
import * as BPApi from '../../../../support/functions/business-process/namespace-business-process-api';
import * as BPData from '../../../../support/functions/business-process/namespace-business-process-data';
import {
  CategoryItem,
  ApiAccessToken,
  ApplicationFeaturesEnum,
  getPreviousUIFeatures,
  stubApiResponse_GetFeatureAll
} from '../../../../support/functions/shared';
import { selectPPDETypes } from '../../../../support/functions/business-process/security-risks/select-PP-DE';

// tslint:disable: no-unused-expression
context('RHEA>BP>Security Risk Form; fill fields and Save', () => {
  const CONFIGURATION = Cypress.env('optional').createBusinessProcess;
  const useCaseIdentifier = Utilities.utilGenerateUUID();
  const contextRecordPrefix = CONFIGURATION.recordPrefix;
  /**
   * USE CASE:
   *    Fill detail form of Security and Risk
   * ASSOCIATED COMPONENTS:
   *    src/app/business-processes/create-bp/step-6/step-6.component.html
   * DESCRIPTION:
   *    Fill all the fields
   *    creates new business process, give it name specific to the fixture and then clicks next to proceed to Security and Owner page.
   * Fill all form
   */

  //#region Context
  // URL to redirect after login or valid Cookies
  let contextURL = '';

  // record Id - Business Process
  let contextRecordId = '';

  // related to component
  let ui: BPUi.SecurityRisks;
  let data: BPData.SecurityRisks;

  // related to module
  let apiCRUD: BusinessProcessAPI.CRUD;

  // common page elements to verify and trigger
  let uiPage: Page;

  const baseUrl = Cypress.config().baseUrl;
  //#endregion

  //#region Load Fixtures

  // JSON files for UI Definitions, API and Data in fixtures
  const jsonCRUDApiBusinessProcess =
    'business-processes/definitions/business-process-def-api.json';
  const jsonUIDef =
    '/business-processes/security-risk/definitions/form-security-risk-def-ui.json';
  const jsonData =
    '/business-processes/security-risk/form-security-risk-data.json';

  function loadFixtures() {
    // Loading Common Elements for Page
    const jsonPageUI = 'page-def-ui.json';
    cy.fixture(jsonPageUI).as('page-def-ui');
    cy.get('@page-def-ui').then(definitions => {
      uiPage = (definitions as unknown) as Page;
    });

    // Loading Definitions
    cy.fixture(jsonUIDef).as('def-ui');
    cy.get('@def-ui').then(definitions => {
      ui = (definitions as unknown) as BPUi.SecurityRisks;
    });

    // Loading Data
    cy.fixture(jsonData).as('data');
    cy.get('@data').then(dataF => {
      data = (dataF as unknown) as BPData.SecurityRisks;
    });

    // Loading CRUD API
    cy.fixture(jsonCRUDApiBusinessProcess).as('def-api');
    cy.get('@def-api').then(apis => {
      apiCRUD = (apis as unknown) as BusinessProcessAPI.CRUD;

      // create business process and navigate to first form
      createBusinessProcess();
    });
  }

  //#endregion

  //#region Enable/Disable License, Login and Redirect to URL

  function createBusinessProcess() {
    const bpName = `${CONFIGURATION.recordPrefix}${data.data.processName} ${useCaseIdentifier}`;
    cy.getAAARheaToken().then(() => {
      cy.createByApiBusinessProcess(bpName).then(id => {
        expect(id).to.not.be.undefined;
        expect(id).not.null;
        contextRecordId = id;

        contextURL = `business-process/${contextRecordId}/security-and-risk`;
        loginAndRedirect('admin', contextURL);
      });
    });
  }

  function loginAndRedirect(loginAs: 'admin' | 'user', redirectUrl: string) {
    // login based on user role
    if (loginAs === 'user') {
      cy.loginAsUser({
        redirect: redirectUrl
      });
    } else {
      cy.loginAsAdministrator(
        {
          redirect: redirectUrl
        },
        getPreviousUIFeatures
      );
    }
  }

  //#region Hooks

  before(() => {
    loadFixtures();
  });

  beforeEach(() => {
    cy.trustArcCookies();
    cy.restoreLocalStorageCache();
  });
  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  after(() => {
    if (CONFIGURATION.deleteAfterFixture === true && contextRecordId) {
      cy.deleteByApiBusinessProcess(contextRecordId);
    }
  });

  //#endregion

  it('BP-Security & Risk - should display title', () => {
    cy.get(ui.title.selector).as(Utilities.delAt(ui.title.alias));
    cy.get(ui.title.alias).should('be.visible');
    cy.get(ui.title.alias).should('not.be.empty');
  });

  it('BP-Security & Risk - select Security Controls ', () => {
    data.data.securityControls.items.forEach(securityControl => {
      const cyElement = {
        selector: `[data-cy="${securityControl}"]`,
        alias: '@element'
      };

      cy.get(cyElement.selector).as(Utilities.delAt(cyElement.alias));
      cy.get(cyElement.alias)
        .should('be.visible')
        .click();
    });
  });

  it('BP-Security & Risk - select Security Controls, other ', () => {
    const cyElement = ui.securityControlOther;
    cy.get(cyElement.selector).as(Utilities.delAt(cyElement.alias));
    cy.get(cyElement.alias)
      .should('be.visible')
      .click();

    const cyElement_textInput = ui.securityControlOtherName;
    cy.get(cyElement_textInput.selector).as(
      Utilities.delAt(cyElement_textInput.alias)
    );
    cy.get(cyElement_textInput.alias)
      .should('be.visible')
      .click();
    cy.get(cyElement_textInput.alias).type('{selectall}{backspace}');
    cy.get(cyElement_textInput.alias).type(data.data.securityControls.other);
  });

  it('BP-Security & Risk - Retention Period length ', () => {
    const cyElement = ui.retentionPeriod;
    cy.get(cyElement.selector).as(Utilities.delAt(cyElement.alias));
    cy.get(cyElement.alias)
      .should('be.visible')
      .click();
    cy.get(cyElement.alias).type('{selectall}{backspace}');
    cy.get(cyElement.alias).type(data.data.retentionPeriod.period);
  });

  it('BP-Security & Risk - Retention Period Unit ', () => {
    const cyElement = ui.retentionPeriodUnit;
    selectDropDown(cyElement.selector, data.data.retentionPeriod.periodUnit);
  });

  it('BP-Security & Risk - Processing Purposes', function() {
    const selections: CategoryItem[] = data.data.processingPurposes;
    const cyElement = ui.selectProcessingPurposes;
    selectPPDETypes(cyElement, selections);
  });

  it('BP-Security & Risk - Data Elements', function() {
    const selections: CategoryItem[] = data.data.dataElements;
    const cyElement = ui.selectDataElements;
    selectPPDETypes(cyElement, selections);
  });

  it('Security and Risk - click next should take to next form', () => {
    stubApiResponse_GetFeatureAll('PREVIOUS');
    cy.get(uiPage.next.selector).as(Utilities.delAt(uiPage.next.alias));
    cy.get(uiPage.next.alias)
      .should('be.visible')
      .click();
  });
});
