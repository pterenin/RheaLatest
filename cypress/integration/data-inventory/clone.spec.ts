import * as Utilities from '../../support/functions/utilities';
// Models
import {
  ApplicationFeatures,
  ApplicationFeaturesEnum,
  ApiAccessToken,
  getDefaultUIFeatures
} from '../../support/functions/shared/index';

import { Page } from '../../support/functions/shared/models-ui';

context('RHEA>Data Inventory>create and clone', () => {
  const CONFIGURATION = Cypress.env('optional').dataInventory.ItSystems;
  const useCaseIdentifier = Utilities.utilGenerateUUID();
  const contextRecordPrefix = CONFIGURATION.recordPrefix;
  const entityIds: any[] = [];

  //#region Context

  let applicationConfigurationFeatureStatus: ApplicationFeatures;

  // URL to redirect after login or valid Cookies
  let contextURL = '';

  // record Id - Business Process
  let contextRecordId = '';

  // common page elements to verify and trigger
  let uiPage: Page;

  const baseUrl = Cypress.config().baseUrl;
  //#endregion

  //#region Load Fixtures

  function loadFixtures() {
    // Loading Common Elements for Page
    const jsonPageUI = 'page-def-ui.json';
    cy.fixture(jsonPageUI).as('page-def-ui');
    cy.get('@page-def-ui').then(definitions => {
      uiPage = (definitions as unknown) as Page;
    });

    cy.getAAARheaToken().then(() => {
      contextURL = 'data-inventory/my-inventory';
      loginAndRedirect('admin', contextURL);
    });
  }

  //#endregion

  //#endregion

  //#region Login and Redirect to URL

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
        getDefaultUIFeatures
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
    if (CONFIGURATION.deleteAfterFixture === true) {
      if (contextRecordId) {
        cy.deleteByApiBusinessProcess(contextRecordId);
      }
      cy.deleteByApiEntities(entityIds);
    }
  });

  //#endregion

  //#region clone functions IT System

  function cloneInventoryType(recordName: string) {
    cy.log('creating clone');
    cy.wait(3000);
    cy.get(`[data-cy="my-inventory-table"]`).then(() => {
      cy.cloneEntityByName(recordName).then(() => {
        verifyClonedRecordExits(recordName);
      });
    });
  }

  function verifyClonedRecordExits(recordName: string) {
    cy.get('.ta-svg-icon-close').click();
    cy.get('ta-table-search input').clear();
    cy.server();
    cy.route('POST', '/api/hub/search/base-records/*').as(
      'postFilterRequestSearch'
    );

    // search record
    cy.get('ta-table-search')
      .then($searchTable => {
        if ($searchTable.find('ta-table-search ta-icon[icon="close"]').length) {
          cy.get('ta-table-search ta-icon[icon="close"]').click({
            force: true,
            multiple: true
          });
        }
      })
      .type(`Clone - ${recordName}`)
      .type('{enter}');

    cy.wait('@postFilterRequestSearch');
    cy.wait(10000);
    let isCloned = false;
    cy.get(`.ta-table-body`).then($tableBody => {
      if ($tableBody.find('.item-name').length) {
        isCloned = true;
      }
      cy.log(`is Cloned ${isCloned}`);
      expect(isCloned).to.be.true;
    });
  }

  function accessToAddNewMenu(option: number) {
    cy.wait(3000);
    cy.get('#addDropdown')
      .first()
      .click();
    cy.get('a.dropdown-item')
      .eq(option)
      .click();
  }

  //#endregion

  //#region Create and clone entity by type

  it('should create and clone Third Party', () => {
    const recordName = `Third Party - ${contextRecordPrefix} ${useCaseIdentifier}`;
    accessToAddNewMenu(0);
    cy.createThirdParty(recordName);
    cy.wait(10000);
    cloneInventoryType(recordName);
  });

  xit('should create and clone Company Affiliate', () => {
    const recordName = `Company Affiliate - ${contextRecordPrefix} ${useCaseIdentifier}`;
    accessToAddNewMenu(2);
    cy.createCompanyAffiliate(recordName);
    cy.wait(10000);
    cloneInventoryType(recordName);
  });

  xit('should create and clone It-System', () => {
    const partyType = 'PARTNER';
    const recordName = `${contextRecordPrefix}${partyType} ${useCaseIdentifier}`;
    cy.createByApiThirdParty(recordName, partyType).then(entityId => {
      entityIds.push({
        id: entityId,
        entityType: partyType
      });
      cy.createByApiItSystem(
        `${contextRecordPrefix}${partyType} ${useCaseIdentifier} System`,
        entityId
      ).then(systemId => {
        entityIds.push({
          id: systemId,
          entityType: 'IT_SYSTEM'
        });
        cy.get('.ta-svg-icon-close').click();
        cy.get('ta-table-search input').clear();
        cy.wait(3000);
        cloneInventoryType(recordName);
      });
    });
  });

  //#endregion
});
