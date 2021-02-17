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
  getPreviousUIFeatures,
  selectItemsOfCategory,
  stubApiResponse_GetFeatureAll
} from '../../../../support/functions/shared';
import { selectPPDETypes } from '../../../../support/functions/business-process/security-risks/select-PP-DE';
import { ProcessingPurposesLegalBasis } from '../../../../support/functions/business-process/final-review/namespace-forms-data-models';

// tslint:disable: no-unused-expression
context('RHEA>BP>Security Risk Form; fill fields and Save', () => {
  const CONFIGURATION = Cypress.env('optional').createBusinessProcess;
  const useCaseIdentifier = Utilities.utilGenerateUUID();
  /**
   * USE CASE:
   *    Fill detail form of Final Risk
   * ASSOCIATED COMPONENTS:
   *    src/app/business-processes/review-bp ( detail , review table, footer)
   * DESCRIPTION:
   *    Fill all the fields
   *    creates new business process, give it name specific to the fixture and then clicks next to proceed to Final Review Page
   */

  //#region Context
  // URL to redirect after login or valid Cookies
  let contextURL = '';

  // record Id - Business Process
  let contextRecordId = '';

  // related to component
  let ui: BPUi.FinalReview;
  let data: BPData.FinalReview;

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
    '/business-processes/final-review/definitions/form-final-review-def-ui.json';
  const jsonData =
    '/business-processes/final-review/form-final-review-data.json';

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
      ui = (definitions as unknown) as BPUi.FinalReview;
    });
    // Loads Security Risks Definitions
    loadFixtureSecurityRisks();

    // Loading Data
    cy.fixture(jsonData).as('data');
    cy.get('@data').then(dataF => {
      data = (dataF as unknown) as BPData.FinalReview;
    });

    // Loading CRUD API
    cy.fixture(jsonCRUDApiBusinessProcess).as('def-api');
    cy.get('@def-api').then(apis => {
      apiCRUD = (apis as unknown) as BusinessProcessAPI.CRUD;

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
    if (CONFIGURATION.deleteAfterFixture === true) {
      if (contextRecordId) {
        cy.deleteByApiBusinessProcess(contextRecordId);
      }
    }
  });

  //#endregion

  //#region Create Processing Purposes

  const jsonUIDef_Security_Risks =
    '/business-processes/final-review/definitions/form-security-risk-def-ui.json';
  let uiSecurityRisks: BPUi.SecurityRisks;
  function loadFixtureSecurityRisks() {
    // Loading Definitions
    cy.fixture(jsonUIDef_Security_Risks).as('def-ui-security-risks');
    cy.get('@def-ui-security-risks').then(definitions => {
      uiSecurityRisks = (definitions as unknown) as BPUi.SecurityRisks;
    });
  }

  xit('BP-Security & Risk - Processing Purposes', function() {
    const selections: CategoryItem[] = data.data.processingPurposesLegalBasis.map(
      pp => pp.processingPurpose
    );

    const cyElement = uiSecurityRisks.selectProcessingPurposes;
    // console.log('%c selections: %o', 'color: #607339', selections);
    // console.log('%c elements: %o', 'color: #40fff2', cyElement);
    selectPPDETypes(cyElement, selections);

    cy.get(uiPage.next.selector).as(Utilities.delAt(uiPage.next.alias));
    cy.get(uiPage.next.alias)
      .should('be.visible')
      .click();
  });

  //#endregion

  //#region Legal Basis Selection

  xit('BP-Final Review - select Legal Basis ', function() {
    const selections: ProcessingPurposesLegalBasis[] =
      data.data.processingPurposesLegalBasis;

    selections.forEach(select => {
      const cyElement = {
        selector:
          `[data-cy="${select.processingPurpose.category} ${select.processingPurpose.searchPrefix}"] ` +
          `${ui.processingPurposesLegalBasis.selector}`,
        alias: ui.processingPurposesLegalBasis.alias
      };

      cy.get(cyElement.selector).as(Utilities.delAt(cyElement.alias));
      cy.get(cyElement.alias)
        .should('be.visible')
        .click();

      selectItemsOfCategory([select.legalBasis]);
    });
  });

  xit('BP-Final Review - set Publish status ', function() {
    const cyElement = ui.status;
    selectDropDown(cyElement.selector, data.data.status);
  });

  xit('BP-Final Review: click back should be on step Security and Risk, return to Final Review', () => {
    stubApiResponse_GetFeatureAll('PREVIOUS');
    cy.get(uiPage.back.selector).as(Utilities.delAt(uiPage.back.alias));
    cy.get(uiPage.back.alias)
      .should('be.visible')
      .click();

    const cyElement = {
      selector: `[data-cy="title-security-risk"]`,
      alias: '@title-security-risk'
    };

    cy.get(cyElement.selector).as(Utilities.delAt(cyElement.alias));
    cy.get(cyElement.alias)
      .should('be.visible')
      .click();
  });

  xit('BP-Final Review: back to Final Review  ', () => {
    stubApiResponse_GetFeatureAll('PREVIOUS');
    cy.get(uiPage.next.selector).as(Utilities.delAt(uiPage.next.alias));
    cy.get(uiPage.next.alias)
      .should('be.visible')
      .click();
  });

  xit('BP-Final Review: Finish and wait for Approval PUT response ', () => {
    // meantime: security risks is triggered on every 5 seconds,
    // recommended: application should change security risk trigger on select legal basis or finish

    const cyApi = {
      putRequests: {
        method: 'PUT',
        url: `/api/hub/business-processes/${contextRecordId}/approval`,
        alias: '@putRequest'
      }
    };

    cy.server();
    cy.route(cyApi.putRequests.method, cyApi.putRequests.url).as(
      Utilities.delAt(cyApi.putRequests.alias)
    );

    cy.get(uiPage.finish.selector).as(Utilities.delAt(uiPage.finish.alias));
    cy.get(uiPage.finish.alias)
      .should('be.visible')
      .click();

    cy.wait(cyApi.putRequests.alias).then(xhr => {
      expect(xhr.status, 'Valid Response').eq(200);
      const responseId = (xhr.response.body as any).id;
      expect(xhr.response.body, `Response Object has id `).to.have.property(
        'id'
      );

      expect(responseId).eql(contextRecordId);
    });
  });

  //#endregion
});
