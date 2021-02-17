import * as Utilities from '../../../../support/functions/utilities';
import { selectDropDown } from '../../../../support/functions/shared/ta-dropdown-field';
// Models
import { BusinessProcess } from '../../../../support/functions/business-process/owner/forms-ui-models';
import { BusinessProcessAPI } from '../../../../support/functions/business-process/owner/forms-api-models';
import { BusinessProcessData } from '../../../../support/functions/business-process/owner/forms-data-models';

import { Page } from '../../../../support/functions/shared/models-ui';
import { ApplicationFeatures } from '../../../../support/functions/shared/models-api';
import {
  ApiAccessToken,
  ApplicationFeaturesEnum,
  getPreviousUIFeatures,
  stubApiResponse_GetFeatureAll
} from '../../../../support/functions/shared';
// tslint:disable: no-unused-expression

context('RHEA>BP>Owner Form; fill fields and Save', () => {
  const CONFIGURATION = Cypress.env('optional').createBusinessProcess;
  const useCaseIdentifier = Utilities.utilGenerateUUID();
  const contextRecordPrefix = CONFIGURATION.recordPrefix;
  const entityIds: any[] = [];
  /**
   * USE CASE:
   *    Fill detail form
   * ASSOCIATED COMPONENTS:
   *    src/app/business-processes/create-bp/step-2/step-2.component.html
   * DESCRIPTION:
   *    Fill all the fields
   *    creates new business process, give it name specific to the fixture and then clicks next to proceed to owner page.
   */

  //#region Context

  let applicationConfigurationFeatureStatus: ApplicationFeatures;

  // URL to redirect after login or valid Cookies
  let contextURL = '';

  // record Id - Business Process
  let contextRecordId = '';

  // related to component
  let ui: BusinessProcess.Owner;
  let api: BusinessProcessAPI.Owner;
  let data: BusinessProcessData.Owner;

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
    'business-processes/owner/definitions/form-owner-def-api.json';

  const jsonUIDef =
    '/business-processes/owner/definitions/form-owner-def-ui.json';

  const jsonData = '/business-processes/owner/form-owner-data.json';

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
      ui = (definitions as unknown) as BusinessProcess.Owner;
    });

    // Loading Data
    cy.fixture(jsonData).as('data');
    cy.get('@data').then(dataF => {
      data = (dataF as unknown) as BusinessProcessData.Owner;
    });

    // Loading API
    cy.fixture(jsonAPIDef).as('def-api');
    cy.get('@def-api').then(apis => {
      api = (apis as unknown) as BusinessProcessAPI.Owner;
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

  //#region Create Record Enable/Disable License, Login and Redirect to URL

  function createBusinessProcess() {
    cy.getAAARheaToken().then(() => {
      const bpName = `${CONFIGURATION.recordPrefix}${data.data.processName} ${useCaseIdentifier}`;
      cy.createByApiBusinessProcess(bpName).then(id => {
        expect(id).to.not.be.undefined;
        expect(id).not.null;
        contextRecordId = id;
        // set context URL
        contextURL = `business-process/${contextRecordId}/owner`;
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

  it('should create entity COMPANY AFFILIATE', () => {
    // FE is showing the US - Entity Types only
    cy.getByApiBusinessStructureId(
      'United States (US)',
      'Business Corporation'
    ).then((businessStructureId: string) => {
      const partyType = 'COMPANY_AFFILIATE';
      const recordName = `${contextRecordPrefix}${partyType} ${useCaseIdentifier}`;
      cy.createByApiCompanyAffiliate(recordName, businessStructureId).then(
        entityId => {
          entityIds.push({ id: entityId, entityType: partyType });
        }
      );
    });
  });

  xit('form Owner - should display Owner titles', () => {
    cy.get(ui.title.selector).as(Utilities.delAt(ui.title.alias));
    cy.get(ui.title.alias).should('be.visible');
    cy.get(ui.title.alias).should('not.be.empty');
  });

  xit('form fill - select Organization ', () => {
    cy.get(ui.entity.selector).as(Utilities.delAt(ui.entity.alias));
    cy.get(ui.entity.alias).should('exist');
    selectDropDown(ui.entity.alias, useCaseIdentifier);
  });

  xit('form fill - select Organization Role', () => {
    cy.get(ui.entityRole.selector).as(Utilities.delAt(ui.entityRole.alias));
    cy.get(ui.entityRole.alias).should('exist');
    selectDropDown(ui.entityRole.alias, data.data.entityRole);
  });

  xit('form fill - type Owner Name, Email', () => {
    cy.get(ui.fullName.selector).as(Utilities.delAt(ui.fullName.alias));
    cy.get(ui.fullName.alias).type(`${data.data.fullName} ${contextRecordId}`);

    cy.get(ui.email.selector).as(Utilities.delAt(ui.email.alias));
    cy.get(ui.email.selector).should('be.visible');
    cy.get(ui.email.alias).type(`${data.data.email}`);
  });

  xit('form fill - select Department', () => {
    cy.get(ui.department.selector).as(Utilities.delAt(ui.department.alias));
    cy.get(ui.department.alias).should('exist');
    selectDropDown(ui.department.alias, data.data.department);
  });

  xit('click Next; should call api and receive 200 response', () => {
    cy.server();
    cy.route(
      api.putOwner.method,
      api.putOwner.url.replace('{id}', contextRecordId)
    ).as(Utilities.delAt(api.putOwner.alias));

    stubApiResponse_GetFeatureAll('PREVIOUS');
    cy.get(uiPage.next.selector).as(Utilities.delAt(uiPage.next.alias));
    cy.get(uiPage.next.alias)
      .should('be.visible')
      .click();

    cy.wait(api.putOwner.alias).then(xhr => {
      expect(xhr.status, 'Valid Response').eq(200);
      expect(
        xhr.response.body,
        `Response Object has${contextRecordId} `
      ).to.have.property('id', contextRecordId);
    });
  });

  it('navigate back to step 2: Owner', () => {
    cy.skipOn(
      applicationConfigurationFeatureStatus.RHEA_NEW_UI_STEPS_34_LICENSE
    );
    cy.get(uiPage.back.selector).as(Utilities.delAt(uiPage.back.alias));
    cy.get(uiPage.back.alias)
      .should('be.visible')
      .click();
  });
});
