// Shared
import * as Utilities from '../../../../support/functions/utilities';
import { Page } from '../../../../support/functions/shared/models-ui';
import { CategoryItemWithLocations } from '../../../../support/functions/shared/models-data';

// Models
import {
  ApplicationFeatures,
  ApiAccessToken,
  ApplicationFeaturesEnum,
  getPreviousUIFeatures
} from '../../../../support/functions/shared/index';
import { BusinessProcess } from '../../../../support/functions/business-process/subjects/forms-ui-models';
import { BusinessProcessAPI } from '../../../../support/functions/business-process/subjects/forms-api-models';
import { BusinessProcessData } from '../../../../support/functions/business-process/subjects/forms-data-models';

// functions
import { selectDataUserTypes } from '../../../../support/functions/business-process/subjects/select-subject-recipient';
// tslint:disable: no-unused-expression

context('RHEA>BP>Subjects Form; fill fields and Save', () => {
  const CONFIGURATION = Cypress.env('optional').createBusinessProcess;
  const useCaseIdentifier = Utilities.utilGenerateUUID();
  const entityIds: any[] = [];
  /**
   * USE CASE:
   *    Fill detail form
   * ASSOCIATED COMPONENTS:
   *    src/app/business-processes/create-bp/step-3/step-3.component.html
   * DESCRIPTION:
   *    Fill all the fields
   *    creates new business process, give it name specific to the fixture and then clicks next to proceed to subjects page.
   *    selects data subjects and recipients from the fixture provided data
   */

  //#region Context

  let applicationConfigurationFeatureStatus: ApplicationFeatures;

  // URL to redirect after login or valid Cookies
  let contextURL = '';

  // record Id - Business Process
  let contextRecordId = '';

  // if search term '%' specified for system, this will replace with this text.
  const searchPrefix = Cypress.env('optional').createBusinessProcess
    .recordPrefix;

  // related to component
  let ui: BusinessProcess.Subjects;
  let api: BusinessProcessAPI.Subjects;
  let data: BusinessProcessData.Subjects;

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
    'business-processes/subjects/definitions/form-subjects-def-api.json';

  const jsonUIDef =
    '/business-processes/subjects/definitions/form-subjects-def-ui.json';

  const jsonData = '/business-processes/subjects/form-subjects-data.json';

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
      ui = (definitions as unknown) as BusinessProcess.Subjects;
    });

    // Loading Data
    cy.fixture(jsonData).as('data');
    cy.get('@data').then(dataF => {
      data = (dataF as unknown) as BusinessProcessData.Subjects;
    });

    // Loading API
    cy.fixture(jsonAPIDef).as('def-api');
    cy.get('@def-api').then(apis => {
      api = (apis as unknown) as BusinessProcessAPI.Subjects;
    });

    // Loading CRUD API
    cy.fixture(jsonCRUDApiBusinessProcess).as('def-api');
    cy.get('@def-api').then(apis => {
      apiCRUD = (apis as unknown) as BusinessProcessAPI.CRUD;

      // create business process and navigate to first form
      createBusinessProcess();
    });
  }

  function loadApplicationConfiguration() {
    if (!applicationConfigurationFeatureStatus) {
      // Application Configuration  - Features and Licenses Status
      cy.getByApiApplicationFeaturesStatus().then(status => {
        if (status) {
          applicationConfigurationFeatureStatus = status;
        }
      });
    }
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
        // set context URL
        contextURL = `business-process/${contextRecordId}/subjects`;
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
    loadApplicationConfiguration();
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

  it('form Subjects - should display title', () => {
    cy.skipOn(
      applicationConfigurationFeatureStatus.RHEA_NEW_UI_STEPS_34_LICENSE
    );

    cy.get(ui.title.selector).as(Utilities.delAt(ui.title.alias));
    cy.get(ui.title.alias).should('be.visible');
    cy.get(ui.title.alias).should('not.be.empty');
  });

  it('form fill - add Data Subjects of Health Care', function() {
    cy.skipOn(
      applicationConfigurationFeatureStatus.RHEA_NEW_UI_STEPS_34_LICENSE
    );

    const selections: CategoryItemWithLocations[] = data.data.subjects.filter(
      selection => {
        return selection.category === 'Health Care';
      }
    );

    selectDataUserTypes(ui.selectDataSubject, selections, searchPrefix);
  });

  it('form fill - add Data Subjects Employment', function() {
    cy.skipOn(
      applicationConfigurationFeatureStatus.RHEA_NEW_UI_STEPS_34_LICENSE
    );

    const selections = data.data.subjects.filter(selection => {
      return selection.category === 'Employment';
    });
    selectDataUserTypes(ui.selectDataSubject, selections, searchPrefix);
  });

  it('form fill - add Data Subjects Customers', function() {
    cy.skipOn(
      applicationConfigurationFeatureStatus.RHEA_NEW_UI_STEPS_34_LICENSE
    );

    const selections = data.data.subjects.filter(selection => {
      return selection.category === 'Customers';
    });
    selectDataUserTypes(ui.selectDataSubject, selections, searchPrefix);
  });

  it('form fill - add Data Subjects; if specified in any other category', function() {
    cy.skipOn(
      applicationConfigurationFeatureStatus.RHEA_NEW_UI_STEPS_34_LICENSE
    );

    // select all except these
    const except = ['Health Care', 'Customers', 'Employment'];
    const selections = data.data.subjects.filter(selection => {
      console.log(' found in category', except.indexOf(selection.category) < 0);
      return except.indexOf(selection.category) < 0;
    });
    if (selections && selections.length > 0) {
      selectDataUserTypes(ui.selectDataSubject, selections, searchPrefix);
    }
  });

  it('form fill - add Data Recipients Corporate', function() {
    cy.skipOn(
      applicationConfigurationFeatureStatus.RHEA_NEW_UI_STEPS_34_LICENSE
    );

    const selections = data.data.recipients.filter(selection => {
      return selection.category === 'Corporate';
    });

    selectDataUserTypes(ui.selectDataRecipient, selections, searchPrefix);
  });

  it('form fill - add Data Recipients Education', function() {
    cy.skipOn(
      applicationConfigurationFeatureStatus.RHEA_NEW_UI_STEPS_34_LICENSE
    );

    const selections = data.data.recipients.filter(selection => {
      return selection.category === 'Education';
    });
    selectDataUserTypes(ui.selectDataRecipient, selections, searchPrefix);
  });

  it('form fill - add Data Recipients; if specified in any other category', function() {
    cy.skipOn(
      applicationConfigurationFeatureStatus.RHEA_NEW_UI_STEPS_34_LICENSE
    );

    // select all except these
    const except = ['Corporate', 'Education'];
    const selections = data.data.recipients.filter(selection => {
      console.log(' found in category', except.indexOf(selection.category) < 0);
      return except.indexOf(selection.category) < 0;
    });
    if (selections && selections.length > 0) {
      selectDataUserTypes(ui.selectDataRecipient, selections, searchPrefix);
    }
  });

  it('click next should take to next form', () => {
    cy.skipOn(
      applicationConfigurationFeatureStatus.RHEA_NEW_UI_STEPS_34_LICENSE
    );

    cy.get(uiPage.next.selector).as(Utilities.delAt(uiPage.next.alias));
    cy.get(uiPage.next.alias)
      .should('be.visible')
      .click();
  });

  it('should be on step-4 IT-Systems ', () => {
    cy.skipOn(
      applicationConfigurationFeatureStatus.RHEA_NEW_UI_STEPS_34_LICENSE
    );

    const cyElement = {
      selector: '[data-cy="title-it-systems"]',
      alias: '@next-page-title'
    };
    cy.get(cyElement.selector).as(Utilities.delAt(cyElement.alias));
    cy.get(cyElement.alias).should('exist');
  });

  it('click back; should navigate back to step 3: Subjects', () => {
    cy.skipOn(
      applicationConfigurationFeatureStatus.RHEA_NEW_UI_STEPS_34_LICENSE
    );

    cy.get(uiPage.back.selector).as(Utilities.delAt(uiPage.back.alias));
    cy.get(uiPage.back.alias)
      .should('be.visible')
      .click();

    cy.get(ui.title.selector).as(Utilities.delAt(ui.title.alias));
    cy.get(ui.title.alias).should('be.visible');
    cy.get(ui.title.alias).should('not.be.empty');
  });
});
