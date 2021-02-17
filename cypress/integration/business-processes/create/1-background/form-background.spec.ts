import * as Utilities from '../../../../support/functions/utilities';
import { selectDropDown } from '../../../../support/functions/shared/ta-dropdown-field';
// Models
import { BusinessProcess } from '../../../../support/functions/business-process/background/forms-ui-models';
import { BusinessProcessAPI } from '../../../../support/functions/business-process/background/forms-api-models';
import { BusinessProcessData } from '../../../../support/functions/business-process/background/forms-data-models';

import { Page } from '../../../../support/functions/shared/models-ui';
import {
  ApiAccessToken,
  ApplicationFeaturesEnum,
  getNewUIFeatures,
  getPreviousUIFeatures
} from '../../../../support/functions/shared';
// tslint:disable: no-unused-expression

context('RHEA>BP>Background Form; fill fields and Save', () => {
  const CONFIGURATION = Cypress.env('optional').createBusinessProcess;
  /**
   * USE CASE:
   *    Fill detail form
   * ASSOCIATED COMPONENTS:
   *    src/app/business-processes/create-bp/step-1/step-1.component.html
   * DESCRIPTION:
   *    Fill all the fields
   */

  //#region Context
  // URL to redirect after login or valid Cookies
  let contextURL = '';

  // record Id - Business Process
  let contextRecordId = '';

  // if search term '%' specified for system, this will replace with this text.
  const searchPrefix = Cypress.env('optional').createBusinessProcess
    .recordPrefix;

  // related to component
  let ui: BusinessProcess.Background;
  let api: BusinessProcessAPI.Background;
  let data: BusinessProcessData.Background;

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
  const jsonAPIDef =
    'business-processes/background/definitions/form-background-def-api.json';

  const jsonUIDef =
    '/business-processes/background/definitions/form-background-def-ui.json';

  const jsonData = '/business-processes/background/form-background-data.json';

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
      ui = (definitions as unknown) as BusinessProcess.Background;
    });

    // Loading Data
    cy.fixture(jsonData).as('data');
    cy.get('@data').then(dataF => {
      data = (dataF as unknown) as BusinessProcessData.Background;
    });

    // Loading API
    cy.fixture(jsonAPIDef).as('def-api');
    cy.get('@def-api').then(apis => {
      api = (apis as unknown) as BusinessProcessAPI.Background;
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
    cy.getAAARheaToken().then(() => {
      cy.createByApiBusinessProcess('UNTITLED').then(id => {
        expect(id).to.not.be.undefined;
        expect(id).not.null;
        contextRecordId = id;
        // set context URL
        contextURL = `business-process/${contextRecordId}/background`;
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
  //#endregion

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

  it('form - should display page titles', () => {
    cy.get(ui.title.selector).as(Utilities.delAt(ui.title.alias));
    cy.get(ui.title.alias).should('be.visible');
    cy.get(ui.title.alias).should('not.be.empty');
  });

  it('form fill - type System Name, Description, Notes', () => {
    cy.get(ui.processName.selector).as(Utilities.delAt(ui.processName.alias));
    cy.get(ui.processName.alias).should('be.visible');
    cy.get(ui.processName.alias).type('{selectall}{backspace}');
    cy.get(ui.processName.alias).type(
      `${searchPrefix} ${data.data.processName} ${contextRecordId}`
    );

    cy.get(ui.description.selector).as(Utilities.delAt(ui.description.alias));
    cy.get(ui.description.selector).should('be.visible');
    cy.get(ui.description.alias).type(
      `${CONFIGURATION.recordPrefix}${data.data.description} ${contextRecordId}`
    );

    cy.get(ui.attachments.selector).click();
    cy.get(ui.notes.selector).as(Utilities.delAt(ui.notes.alias));
    cy.get(ui.notes.selector).should('be.visible');
    cy.get(ui.notes.alias).type(`${data.data.notes} ${contextRecordId}`);
    cy.get(ui.modalClose.selector).click();
  });

  it('form fill - select range of people involved from list', function() {
    cy.get(ui.peopleRange.selector).as(Utilities.delAt(ui.peopleRange.alias));
    cy.get(ui.peopleRange.alias).should('exist');
    selectDropDown(ui.peopleRange.alias, data.data.peopleRanges);
  });

  xit('click Next; should call api and receive 200 response', () => {
    // Create Business Process
    cy.server();
    cy.route(
      api.putBackground.method,
      api.putBackground.url.replace('{id}', contextRecordId)
    ).as(Utilities.delAt(api.putBackground.alias));

    cy.get(uiPage.next.selector).as(Utilities.delAt(uiPage.next.alias));
    cy.get(uiPage.next.alias)
      .should('be.enabled')
      .click();

    cy.wait(api.putBackground.alias).then(xhr => {
      // console.log(
      //   `Business Process ${contextRecordId} Background Updated %c \nResponse:%o`,
      //   'color:green',
      //   xhr
      // );
      expect(xhr.status, 'Valid Response').eq(200);
      expect(
        xhr.response.body,
        `Response Object has${contextRecordId} `
      ).to.have.property('id', contextRecordId);
    });
  });

  xit('navigate back to step 1: Background', () => {
    const cyElement = {
      selector: '[data-cy="back"]',
      alias: '@back',
      text: 'back'
    };

    cy.get(cyElement.selector).as(Utilities.delAt(cyElement.alias));
    cy.get(cyElement.alias).should('be.visible');
    cy.get(cyElement.alias).click();
  });
});
