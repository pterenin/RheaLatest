// Shared
import * as Utilities from '../../../../support/functions/utilities';

// Models
import {
  ApplicationFeatures,
  ApiAccessToken,
  ApplicationFeaturesEnum,
  getPreviousUIFeatures
} from '../../../../support/functions/shared/index';
import { BusinessProcessAPI } from '../../../../support/functions/business-process/subjects/forms-api-models';

import { Page } from '../../../../support/functions/shared/models-ui';

// -------------------  Business Process Models
import * as BPUi from '../../../../support/functions/business-process/namespace-business-process-ui';
import * as BPApi from '../../../../support/functions/business-process/namespace-business-process-api';
import * as BPData from '../../../../support/functions/business-process/namespace-business-process-data';

// Subjects
import { selectDataUserTypes as Step3Selection } from '../../../../support/functions/business-process/subjects/select-subject-recipient';

// Systems
import { selectSystems } from '../../../../support/functions/business-process/it-systems/add-system';

// Data-Flow
import { selectDataUserTypes as Step5Selection } from '../../../../support/functions/business-process/data-flow/select-subject-recipient';

// tslint:disable: no-unused-expression
context('RHEA>BP>Data Flow Form; fill fields and Save', () => {
  const CONFIGURATION = Cypress.env('optional').createBusinessProcess;
  const useCaseIdentifier = Utilities.utilGenerateUUID();
  const contextRecordPrefix = CONFIGURATION.recordPrefix;
  const entityIds: any[] = [];
  /**
   * USE CASE:
   *    Fill detail form
   * ASSOCIATED COMPONENTS:
   *    src/app/business-processes/create-bp/step-5/step-5.component.html
   * DESCRIPTION:
   *    creates new business process, give it name specific to the fixture and clicks subjects page.
   *    load fixtures(Data) from data-flow and definitions from subjects
   *    fill data
   *    load fixtures(Data) from data-flow and definitions from systems
   *    fill data
   *    move to step 5
   *    fill data
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

  function loadFixtures() {
    // Loading Common Elements for Page
    const jsonPageUI = 'page-def-ui.json';
    cy.fixture(jsonPageUI).as('page-def-ui');
    cy.get('@page-def-ui').then(definitions => {
      uiPage = (definitions as unknown) as Page;
    });

    loadFixtures_Subjects();
    loadFixtures_IT_Systems();
    loadFixtures_DataFlow();

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
        console.log(status);
        if (status) {
          applicationConfigurationFeatureStatus = status;
        }
      });
    }
  }

  //#endregion

  //#region Enable/Disable License, Login and Redirect to URL

  function createBusinessProcess() {
    const bpName = `${CONFIGURATION.recordPrefix} ${useCaseIdentifier}`;
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
    if (CONFIGURATION.deleteAfterFixture === true) {
      if (contextRecordId) {
        cy.deleteByApiBusinessProcess(contextRecordId);
      }

      cy.deleteByApiEntities(entityIds);
    }
  });

  //#endregion

  // related to component -- will be moved at end as the final data of data-flow will be here.
  let ui_Subjects: BPUi.Subjects;
  let api_Subjects: BusinessProcessAPI.Subjects;
  let data_Subjects: BPData.Subjects;

  //#region Step#3 Subjects/Recipients Selection

  //#region Setup

  // // related to component
  // let ui_Subjects: BusinessProcess.Subjects;
  // let api_Subjects: BusinessProcessAPI.Subjects;
  // let data_Subjects: BusinessProcessData.Subjects;

  // fixtures
  const jsonAPIDef_Subjects =
    'business-processes/subjects/definitions/form-subjects-def-api.json';

  const jsonUIDef_Subjects =
    '/business-processes/subjects/definitions/form-subjects-def-ui.json';

  const jsonData_Subjects =
    '/business-processes/data-flow/form-subjects-data.json';

  function loadFixtures_Subjects() {
    // Loading Definitions
    cy.fixture(jsonUIDef_Subjects).as('def-ui');
    cy.get('@def-ui').then(definitions => {
      ui_Subjects = (definitions as unknown) as BPUi.Subjects;
    });

    // Loading Data
    cy.fixture(jsonData_Subjects).as('data');
    cy.get('@data').then(dataF => {
      data_Subjects = (dataF as unknown) as BPData.Subjects;
    });

    // Loading API
    cy.fixture(jsonAPIDef_Subjects).as('def-api');
    cy.get('@def-api').then(apis => {
      api_Subjects = (apis as unknown) as BusinessProcessAPI.Subjects;
    });
  }

  //#endregion

  it('Subjects - form Subjects - should display title', () => {
    cy.skipOn(
      applicationConfigurationFeatureStatus.RHEA_NEW_UI_STEPS_34_LICENSE
    );

    cy.get(ui_Subjects.title.selector).as(
      Utilities.delAt(ui_Subjects.title.alias)
    );
    cy.get(ui_Subjects.title.alias).should('be.visible');
    cy.get(ui_Subjects.title.alias).should('not.be.empty');
  });

  it('Subjects - form fill - add Data Subjects; if specified in any other category', function() {
    cy.skipOn(
      applicationConfigurationFeatureStatus.RHEA_NEW_UI_STEPS_34_LICENSE
    );

    // select all except these
    const except = ['~']; // ['Health Care', 'Customers', 'Employment'];
    const selections = data_Subjects.data.subjects.filter(selection => {
      console.log(' found in category', except.indexOf(selection.category) < 0);
      return except.indexOf(selection.category) < 0;
    });
    if (selections && selections.length > 0) {
      Step3Selection(ui_Subjects.selectDataSubject, selections, searchPrefix);
    }
  });

  it('Subjects - form fill - add Data Recipients; if specified in any other category', function() {
    cy.skipOn(
      applicationConfigurationFeatureStatus.RHEA_NEW_UI_STEPS_34_LICENSE
    );

    // select all except these
    const except = ['']; // ['Corporate', 'Education'];
    const selections = data_Subjects.data.recipients.filter(selection => {
      console.log(' found in category', except.indexOf(selection.category) < 0);
      return except.indexOf(selection.category) < 0;
    });
    if (selections && selections.length > 0) {
      Step3Selection(ui_Subjects.selectDataRecipient, selections, searchPrefix);
    }
  });

  it('Subjects - click next should take to next form', () => {
    cy.skipOn(
      applicationConfigurationFeatureStatus.RHEA_NEW_UI_STEPS_34_LICENSE
    );

    cy.get(uiPage.next.selector).as(Utilities.delAt(uiPage.next.alias));
    cy.get(uiPage.next.alias)
      .should('be.visible')
      .click();
  });

  //#endregion

  //#region Step#4 Systems Selection

  it('Systems - should be on step-4 IT-Systems ', () => {
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

  //#region SETUP

  // // // related to component
  let ui_IT_Systems: BPUi.ItSystems;
  let api_IT_Systems: BPApi.ItSystems;
  let data_IT_Systems: BPData.ItSystems;

  // JSON files for UI Definitions, API and Data in fixtures
  const jsonAPIDef_IT_Systems =
    'business-processes/it-systems/definitions/form-it-systems-def-api.json';

  const jsonUIDef_IT_Systems =
    '/business-processes/it-systems/definitions/form-it-systems-def-ui.json';

  const jsonData_IT_Systems =
    '/business-processes/data-flow/form-it-systems-data.json';

  function loadFixtures_IT_Systems() {
    // Loading Definitions
    cy.fixture(jsonUIDef_IT_Systems).as('def-ui');
    cy.get('@def-ui').then(definitions => {
      ui_IT_Systems = (definitions as unknown) as BPUi.ItSystems;
    });

    // Loading Data
    cy.fixture(jsonData_IT_Systems).as('data');
    cy.get('@data').then(dataF => {
      data_IT_Systems = (dataF as unknown) as BPData.ItSystems;
      // console.log('%c %o', 'color: #f2ceb6', data);
    });

    // Loading API
    cy.fixture(jsonAPIDef_IT_Systems).as('def-api');
    cy.get('@def-api').then(apis => {
      api_IT_Systems = (apis as unknown) as BPApi.ItSystems;
    });
  }

  //#endregion

  it('Systems - should create entity and system Vendor', () => {
    cy.skipOn(
      applicationConfigurationFeatureStatus.RHEA_NEW_UI_STEPS_34_LICENSE
    );

    const partyType = 'VENDOR';
    const recordName = `${contextRecordPrefix}${partyType} ${useCaseIdentifier}`;
    cy.createByApiThirdParty(recordName, partyType).then(entityId => {
      entityIds.push({ id: entityId, entityType: partyType });
      cy.createByApiItSystem(
        `${contextRecordPrefix}${partyType} ${useCaseIdentifier} System`,
        entityId
      ).then(systemId => {
        entityIds.push({ id: systemId, entityType: 'IT_SYSTEM' });
      });
    });
  });

  it('Systems - form fill - add system - by Vendor', function() {
    cy.skipOn(
      applicationConfigurationFeatureStatus.RHEA_NEW_UI_STEPS_34_LICENSE
    );

    const selections = data_IT_Systems.data.systems.filter(selection => {
      return selection.category === 'Vendor';
    });
    selectSystems(
      ui_IT_Systems.selectSystem,
      ui_IT_Systems.modalAddItSystem,
      selections,
      useCaseIdentifier
    );
  });

  it('Systems - click next should take to next form', () => {
    cy.skipOn(
      applicationConfigurationFeatureStatus.RHEA_NEW_UI_STEPS_34_LICENSE
    );

    cy.get(uiPage.next.selector).as(Utilities.delAt(uiPage.next.alias));
    cy.get(uiPage.next.alias)
      .should('be.visible')
      .click();
  });

  //#endregion

  //#region Step#5 Data Flows

  it('Data Flow - should be on step-5 Data Flow', () => {
    cy.skipOn(
      applicationConfigurationFeatureStatus.RHEA_NEW_UI_STEPS_34_LICENSE
    );

    const cyElement = {
      selector: '[data-cy="title-data-flow"]',
      alias: '@next-page-title-data-flow'
    };
    cy.get(cyElement.selector).as(Utilities.delAt(cyElement.alias));
    cy.get(cyElement.alias).should('exist');
  });

  //#region SETUP

  // related to component
  let ui_DataFlow: BPUi.DataFlow;
  let data_DataFlow: BPData.DataFlow;

  // JSON files for UI Definitions, API and Data in fixtures
  const jsonAPIDef_DataFlow =
    'business-processes/data-flow/definitions/form-data-flow-def-api.json';

  const jsonUIDef_DataFlow =
    '/business-processes/data-flow/definitions/form-data-flow-def-ui.json';

  const jsonData_DataFlow =
    '/business-processes/data-flow/form-data-flow-data.json';

  function loadFixtures_DataFlow() {
    // Loading Definitions
    cy.fixture(jsonUIDef_DataFlow).as('def-ui');
    cy.get('@def-ui').then(definitions => {
      ui_DataFlow = (definitions as unknown) as BPUi.DataFlow;
    });

    // Loading Data
    cy.fixture(jsonData_DataFlow).as('data');
    cy.get('@data').then(dataF => {
      data_DataFlow = (dataF as unknown) as BPData.DataFlow;
    });
  }

  //#endregion

  it('Data Flow - form fill - select receives information from DATA SUBJECT ', function() {
    cy.skipOn(
      applicationConfigurationFeatureStatus.RHEA_NEW_UI_STEPS_34_LICENSE
    );

    const selections = data_DataFlow.data.subjects;
    Step5Selection(ui_DataFlow.selectDataSubject, selections, searchPrefix);
  });

  it('Data Flow - form fill - select sends information from DATA RECIPIENTS ', function() {
    cy.skipOn(
      applicationConfigurationFeatureStatus.RHEA_NEW_UI_STEPS_34_LICENSE
    );

    const selections = data_DataFlow.data.recipients;
    Step5Selection(ui_DataFlow.selectDataRecipient, selections, searchPrefix);
  });

  it('Data Flow - click next should take to next form', () => {
    cy.skipOn(
      applicationConfigurationFeatureStatus.RHEA_NEW_UI_STEPS_34_LICENSE
    );

    cy.get(uiPage.next.selector).as(Utilities.delAt(uiPage.next.alias));
    cy.get(uiPage.next.alias)
      .should('be.visible')
      .click();
  });

  it('Security and Risk - should be on step-6 Security and Risk ', () => {
    cy.skipOn(
      applicationConfigurationFeatureStatus.RHEA_NEW_UI_STEPS_34_LICENSE
    );

    const cyElement = {
      selector: '[data-cy="title-security-risk"]',
      alias: '@next-page-title'
    };
    cy.get(cyElement.selector).as(Utilities.delAt(cyElement.alias));
    cy.get(cyElement.alias).should('exist');
  });

  it('Security and Risk - click back to DATA FLOW', () => {
    cy.skipOn(
      applicationConfigurationFeatureStatus.RHEA_NEW_UI_STEPS_34_LICENSE
    );

    console.log(uiPage);
    cy.get(uiPage.back.selector).as(Utilities.delAt(uiPage.back.alias));
    cy.get(uiPage.back.alias)
      .should('be.visible')
      .click();
  });

  //#endregion
});
