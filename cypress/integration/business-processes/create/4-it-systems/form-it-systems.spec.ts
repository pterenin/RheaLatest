import * as Utilities from '../../../../support/functions/utilities';
// Models
import {
  ApplicationFeatures,
  ApplicationFeaturesEnum,
  ApiAccessToken,
  getPreviousUIFeatures
} from '../../../../support/functions/shared/index';
import { BusinessProcess } from '../../../../support/functions/business-process/it-systems/forms-ui-models';
import { BusinessProcessAPI } from '../../../../support/functions/business-process/it-systems/forms-api-models';
import { BusinessProcessData } from '../../../../support/functions/business-process/it-systems/forms-data-models';

import { Page } from '../../../../support/functions/shared/models-ui';

// system specific
import { selectSystems } from '../../../../support/functions/business-process/it-systems/add-system';

// tslint:disable: no-unused-expression
context('RHEA>BP>IT Systems Form; fill fields and Save', () => {
  const CONFIGURATION = Cypress.env('optional').createBusinessProcess;
  const useCaseIdentifier = Utilities.utilGenerateUUID();
  const contextRecordPrefix = CONFIGURATION.recordPrefix;
  const entityIds: any[] = [];
  /**
   * USE CASE:
   *    Fill detail form
   * ASSOCIATED COMPONENTS:
   *    src/app/business-processes/create-bp/step-4/step-4.component.html
   * DESCRIPTION:
   *    Fill all the fields
   *    creates new business process, give it name specific to the fixture and then clicks next to proceed to owner page.
   * Selection Behavior:
   *  cypress/support/functions/business-process/
   *
   */
  //#region Context

  let applicationConfigurationFeatureStatus: ApplicationFeatures;

  // URL to redirect after login or valid Cookies
  let contextURL = '';

  // record Id - Business Process
  let contextRecordId = '';

  // if search term '%' specified for system, this will replace with this text.
  // cypress/fixtures/business-processes/it-systems/form-it-systems-data.json
  const searchPrefix = Cypress.env('optional').createBusinessProcess
    .recordPrefix;

  // related to component
  let ui: BusinessProcess.ItSystems;
  let api: BusinessProcessAPI.ItSystems;
  let data: BusinessProcessData.ItSystems;

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
    'business-processes/it-systems/definitions/form-it-systems-def-api.json';

  const jsonUIDef =
    '/business-processes/it-systems/definitions/form-it-systems-def-ui.json';

  const jsonData = '/business-processes/it-systems/form-it-systems-data.json';

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
      ui = (definitions as unknown) as BusinessProcess.ItSystems;
    });

    // Loading Data
    cy.fixture(jsonData).as('data');
    cy.get('@data').then(dataF => {
      data = (dataF as unknown) as BusinessProcessData.ItSystems;
      // console.log('%c %o', 'color: #f2ceb6', data);
    });

    // Loading API
    cy.fixture(jsonAPIDef).as('def-api');
    cy.get('@def-api').then(apis => {
      api = (apis as unknown) as BusinessProcessAPI.ItSystems;
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
        contextURL = `business-process/${contextRecordId}/it-systems`;
        loginAndRedirect('admin', contextURL);
      });
    });
  }

  function setAppropriateLicensesForContext() {
    cy.getAAAPlutusToken().then(() => {
      const token = Cypress.env('oauth.rhea.token') as ApiAccessToken;
      cy.updateByApiFeatureStatus(
        token.accountId,
        ApplicationFeaturesEnum.RHEA_NEW_UI_STEPS_34_LICENSE,
        false
      ).then(() => {
        // verify license status
        cy.getByApiApplicationFeaturesStatus().then(features => {
          expect(features.RHEA_NEW_UI_STEPS_34_LICENSE).to.be.false;

          // set context URL
          contextURL = `business-process/${contextRecordId}/it-systems`;
          loginAndRedirect('admin', contextURL);
        });
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

  //#region Create Third Parties & Company Affiliate

  it('should create entity and system PARTNER', () => {
    cy.skipOn(
      applicationConfigurationFeatureStatus.RHEA_NEW_UI_STEPS_34_LICENSE
    );

    const partyType = 'PARTNER';
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

  it('should create entity and system Vendor', () => {
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

  it('should create entity and system Customer', () => {
    cy.skipOn(
      applicationConfigurationFeatureStatus.RHEA_NEW_UI_STEPS_34_LICENSE
    );

    const partyType = 'CUSTOMER';
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

  it('should create entity and system Service Provider', () => {
    cy.skipOn(
      applicationConfigurationFeatureStatus.RHEA_NEW_UI_STEPS_34_LICENSE
    );

    const partyType = 'SERVICE_PROVIDER';
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

  it('should create entity and system Business Associate', () => {
    cy.skipOn(
      applicationConfigurationFeatureStatus.RHEA_NEW_UI_STEPS_34_LICENSE
    );

    const partyType = 'BUSINESS_ASSOCIATE';
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

  it('should create entity and system COMPANY AFFILIATE', () => {
    cy.skipOn(
      applicationConfigurationFeatureStatus.RHEA_NEW_UI_STEPS_34_LICENSE
    );

    cy.getByApiBusinessStructureId(
      'United States (US)',
      'Business Corporation'
    ).then((businessStructureId: string) => {
      const partyType = 'COMPANY_AFFILIATE';
      const recordName = `${contextRecordPrefix}${partyType} ${useCaseIdentifier}`;
      cy.createByApiCompanyAffiliate(recordName, businessStructureId).then(
        entityId => {
          entityIds.push({ id: entityId, entityType: partyType });
          cy.createByApiItSystem(
            `${contextRecordPrefix}${partyType} ${useCaseIdentifier} System`,
            entityId
          ).then(systemId => {
            entityIds.push({ id: systemId, entityType: 'IT_SYSTEM' });
          });
        }
      );
    });
  });

  //#endregion

  it('form Systems - should display title', () => {
    cy.skipOn(
      applicationConfigurationFeatureStatus.RHEA_NEW_UI_STEPS_34_LICENSE
    );

    cy.get(ui.title.selector).as(Utilities.delAt(ui.title.alias));
    cy.get(ui.title.alias).should('be.visible');
    cy.get(ui.title.alias).should('not.be.empty');
  });

  // it('form fill - add system - by Primary Entity', function() {
  //   const selections = data.data.systems.filter(selection => {
  //     return selection.category === 'Primary Entity';
  //   });

  //   selectSystems(
  //     ui.selectSystem,
  //     ui.modalAddItSystem,
  //     selections,
  //     searchPrefix
  //   );
  // });

  it('form fill - add system - by Vendor', function() {
    cy.skipOn(
      applicationConfigurationFeatureStatus.RHEA_NEW_UI_STEPS_34_LICENSE
    );

    const selections = data.data.systems.filter(selection => {
      return selection.category === 'Vendor';
    });
    selectSystems(
      ui.selectSystem,
      ui.modalAddItSystem,
      selections,
      useCaseIdentifier
    );
  });

  it('form fill - add system - by Partner', function() {
    cy.skipOn(
      applicationConfigurationFeatureStatus.RHEA_NEW_UI_STEPS_34_LICENSE
    );

    const selections = data.data.systems.filter(selection => {
      return selection.category === 'Partner';
    });
    selectSystems(
      ui.selectSystem,
      ui.modalAddItSystem,
      selections,
      useCaseIdentifier
    );
  });

  it('form fill - add system - by Service Provider', function() {
    cy.skipOn(
      applicationConfigurationFeatureStatus.RHEA_NEW_UI_STEPS_34_LICENSE
    );

    const selections = data.data.systems.filter(selection => {
      return selection.category === 'Service Provider';
    });
    selectSystems(
      ui.selectSystem,
      ui.modalAddItSystem,
      selections,
      useCaseIdentifier
    );
  });

  it('form fill - add system - by Business Associate', function() {
    cy.skipOn(
      applicationConfigurationFeatureStatus.RHEA_NEW_UI_STEPS_34_LICENSE
    );

    const selections = data.data.systems.filter(selection => {
      return selection.category === 'Business Associate';
    });
    selectSystems(
      ui.selectSystem,
      ui.modalAddItSystem,
      selections,
      useCaseIdentifier
    );
  });

  it('form fill - add system - by Company Affiliate', function() {
    cy.skipOn(
      applicationConfigurationFeatureStatus.RHEA_NEW_UI_STEPS_34_LICENSE
    );

    const selections = data.data.systems.filter(selection => {
      return selection.category === 'Company Affiliate';
    });
    selectSystems(
      ui.selectSystem,
      ui.modalAddItSystem,
      selections,
      useCaseIdentifier
    );
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

  it('should be on step-5 Data-Flow ', () => {
    cy.skipOn(
      applicationConfigurationFeatureStatus.RHEA_NEW_UI_STEPS_34_LICENSE
    );

    const nextPage = '[data-cy="title-data-flow"]';
    cy.get(nextPage).as(Utilities.delAt(ui.title.alias));
    cy.get(ui.title.alias).should('exist');
  });

  it('click back; should navigate back to step 4: It-Systems', () => {
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
