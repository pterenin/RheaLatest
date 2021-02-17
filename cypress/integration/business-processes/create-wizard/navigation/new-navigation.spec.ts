import * as Utilities from '../../../../support/functions/utilities';
import { selectDropDown } from '../../../../support/functions/shared/ta-dropdown-field';

// Models
import { BusinessProcessAPI } from '../../../../support/functions/business-process/create-wizard/details/forms-api-models';
import { Page } from '../../../../support/functions/shared/models-ui';

// -------------------  Business Process Models
import * as BPUi from '../../../../support/functions/business-process/create-wizard/namespace-business-process-ui';
import * as BPData from '../../../../support/functions/business-process/create-wizard/namespace-business-process-data';
import {
  ApplicationFeaturesEnum,
  ApiAccessToken,
  getNewUIFeatures,
  stubApiResponse_GetFeatureAll
} from '../../../../support/functions/shared';
import { tail } from 'cypress/types/lodash';
// tslint:disable: no-unused-expression

context('RHEA>BP> New Navigation', () => {
  const CONFIGURATION = Cypress.env('optional').createBusinessProcess;
  const useCaseIdentifier = Utilities.utilGenerateUUID();
  const contextRecordPrefix = CONFIGURATION.recordPrefix;
  const entityIds: any[] = [];
  /**
   * USE CASE:
   *    BP wizard header
   * ASSOCIATED COMPONENTS:
   *    business-processes/business-process-wizard/shared/
   *    components/business-process-wizard-header/business-process-wizard-header.component.html
   * DESCRIPTION:
   *    Fill all the fields
   */

  //#region Context
  // URL to redirect after login or valid Cookies
  let contextURL = '';

  // record Id - Business Process
  let contextRecordId = '';

  const baseUrl = Cypress.config().baseUrl;
  //#endregion

  //#region Load Fixtures
  function loadFixtures() {
    createBusinessProcess();
  }

  //#endregion

  //#region Enable/Disable License, Login and Redirect to URL

  function createBusinessProcess() {
    cy.getAAARheaToken().then(() => {
      cy.createByApiBusinessProcess('UNTITLED').then(id => {
        expect(id).to.not.be.undefined;
        expect(id).not.null;
        contextRecordId = id;
        // set context URL
        contextURL = `business-process/${contextRecordId}/details`;
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
        getNewUIFeatures
      );
    }
  }

  //#endregion

  //#region Hooks

  before(() => {
    loadFixtures();
  });

  beforeEach(() => {
    cy.trustArcCookies();
    cy.restoreLocalStorageCache();
    stubApiResponse_GetFeatureAll('NEW');
  });
  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  after(() => {
    if (CONFIGURATION.deleteAfterFixture === true) {
      if (contextRecordId) {
        cy.deleteByApiBusinessProcess(contextRecordId);
      }
      cy.deleteByApiEntities(entityIds);
    }
  });

  //#endregion

  //#region reusable-functions

  const selectorTags = '[data-cy="bp-tags-button"]';
  const selectorAttachments = '[data-cy="bp-attachments-button"]';
  const selectorCopy = '[data-cy="bp-copy-button"]';

  function verifyAndClick(
    selector: string,
    click: boolean = false,
    selectorVerifyExistence: string | null = null
  ) {
    const cyElement = {
      selector: selector,
      alias: '@element',
      text: ''
    };
    cy.get(cyElement.selector).as(Utilities.delAt(cyElement.alias));
    cy.get(cyElement.alias).should('be.visible');
    cy.get(cyElement.alias).should('be.enabled');

    if (click) {
      cy.get(cyElement.alias)
        .scrollIntoView()
        .click();
      if (selectorVerifyExistence) {
        selectorShouldExist(selectorVerifyExistence);
      }
    }
  }

  function isNotesAttachmentsTriggered() {
    const modalAttachments = 'ta-notes-attachments';
    verifyAndClick(selectorAttachments, true, modalAttachments);
    cy.modalCloseByIconButton(modalAttachments);

    const modalTags = 'ta-business-process-tags';
    verifyAndClick(selectorTags, true, modalTags);
    cy.modalCloseByIconButton(modalTags);
  }

  function clickBPStep(stepName: string) {
    const cyElement = {
      selector: '[data-cy="bp-nav-step"]',
      alias: '@element',
      text: stepName
    };

    cy.get(cyElement.selector).as(Utilities.delAt(cyElement.alias));
    cy.get(cyElement.alias)
      .first()
      .scrollIntoView();
    cy.get(cyElement.alias)
      .contains(cyElement.text)
      .should('be.visible');
    cy.get(cyElement.alias)
      .contains(cyElement.text)
      .click();
  }

  function isActive(stepName: string) {
    const cyElement = {
      selector: '[data-cy="bp-wizard-navigation"] .nav-link.active',
      alias: '@element',
      text: stepName
    };
    cy.get(cyElement.selector).as(Utilities.delAt(cyElement.alias));
    cy.get(cyElement.alias).contains(cyElement.text);
  }

  function isStatus(bpStatus: string) {
    const cyElement = {
      selector: '[data-cy="bp-owner-status"] [data-cy="dropdown-field-click"]',
      alias: '@element',
      text: bpStatus
    };
    cy.get(cyElement.selector).as(Utilities.delAt(cyElement.alias));
    cy.get(cyElement.alias).contains(cyElement.text);
  }

  function changeStatus(status: string) {
    selectDropDown('[data-cy="bp-owner-status"]', status);
  }

  function selectorShouldExist(selector: string) {
    const cyElement = {
      selector: selector,
      alias: '@element',
      text: ''
    };
    cy.get(cyElement.selector).as(Utilities.delAt(cyElement.alias));
    cy.get(cyElement.alias).should('exist');
  }

  //#endregion

  //#region New Navigation

  it('it should have breadcrumb', () => {
    const cyElement = {
      selector: '[data-cy="top-nav-all-business-process"]',
      alias: '@element',
      text: 'Business Processes'
    };

    cy.get(cyElement.selector).as(Utilities.delAt(cyElement.alias));
    cy.get(cyElement.alias).should('be.visible');
    cy.contains(cyElement.text);
  });

  it('it should have UNTITLED in BP name breadcrumb', () => {
    const cyElement = {
      selector: '[data-cy="top-nav-business-process-name"]',
      alias: '@element',
      text: 'UNTITLED'
    };

    cy.get(cyElement.selector).as(Utilities.delAt(cyElement.alias));
    cy.get(cyElement.alias).should('be.visible');
    cy.contains(cyElement.text);
  });

  it(`it should have the updated Business Process name ${contextRecordId} in breadcrumb`, () => {
    const cyElement = {
      selector: '[data-cy="top-nav-business-process-name"]',
      alias: '@element',
      text: contextRecordId
    };

    cy.updateByApiBusinessProcess(contextRecordId, contextRecordId);
    stubApiResponse_GetFeatureAll();
    cy.reload();

    cy.get(cyElement.selector).as(Utilities.delAt(cyElement.alias));
    cy.get(cyElement.alias).should('be.visible');
    cy.contains(cyElement.text);
  });

  it('it should have the toolbar with names of each BP step', () => {
    const cyElement = {
      selector: '[data-cy="bp-nav-step"]',
      alias: '@element',
      text: ''
    };

    cy.get(cyElement.selector).as(Utilities.delAt(cyElement.alias));
    cy.get(cyElement.alias).should('be.visible');

    cyElement.text = 'Details';
    cy.contains(cyElement.text).should('be.visible');

    cyElement.text = 'Systems Selection';
    cy.contains(cyElement.text).should('be.visible');

    cyElement.text = 'Build Data Flow';
    cy.contains(cyElement.text).should('be.visible');

    cyElement.text = 'Security & Risks';
    cy.contains(cyElement.text).should('be.visible');

    cyElement.text = 'Review';
    cy.contains(cyElement.text).should('be.visible');
  });

  it('it should have the attachments notes, share toolbar', () => {
    // notes
    verifyAndClick(selectorAttachments, false);

    // tags
    verifyAndClick(selectorTags, false);

    // copy
    verifyAndClick(selectorCopy, false);
  });

  it(`it should have the status dropdown and change to 'In review' in toolbar`, () => {
    // notes
    const cyElement_Status = {
      selector: '[data-cy="bp-owner-status"]',
      alias: '@element-attachments',
      text: ''
    };
    cy.get(cyElement_Status.selector).as(
      Utilities.delAt(cyElement_Status.alias)
    );
    cy.get(cyElement_Status.alias).should('exist');

    changeStatus('In review');
  });

  it('it should have highlighted DETAILS , working notes, attachments   in toolbar for details page', () => {
    // Wizard Navigation
    stubApiResponse_GetFeatureAll();
    cy.reload();
    const step = 'Details';
    isActive(step);
    selectorShouldExist('ta-details');
    isNotesAttachmentsTriggered();
    isStatus('In review');
    changeStatus('Revise');
  });

  it('it should have highlighted SYSTEMS SELECTION, working notes, attachments    in toolbar for systems-selection page', () => {
    const step = 'Systems Selection';
    clickBPStep(step);
    isActive(step);
    isStatus('Revise');
    selectorShouldExist('ta-systems-selection');

    isNotesAttachmentsTriggered();
  });

  it('it should have highlighted BUILD DATA FLOW, working notes, attachments   in toolbar for data-flow page', () => {
    const step = 'Build Data Flow';
    clickBPStep(step);
    isActive(step);
    isStatus('Revise');
    selectorShouldExist('ta-build-data-flow');

    isNotesAttachmentsTriggered();
  });

  it('it should have highlighted SECURITY & RISKS, working notes, attachments  in toolbar for security & risks page', () => {
    const step = 'Security & Risks';
    clickBPStep(step);
    isActive(step);
    isStatus('Revise');
    selectorShouldExist('ta-security-risks');
  });

  it('it should have highlighted REVIEW, working notes, attachments  in toolbar for review page', () => {
    const step = 'Review';
    clickBPStep(step);
    isActive(step);
    isStatus('Revise');
    selectorShouldExist('ta-review');

    isNotesAttachmentsTriggered();
  });

  //#endregion
});
