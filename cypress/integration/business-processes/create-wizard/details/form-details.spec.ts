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
  getNewUIFeatures
} from '../../../../support/functions/shared';
// tslint:disable: no-unused-expression

context('RHEA>BP>Details; fill fields and Save', () => {
  const CONFIGURATION = Cypress.env('optional').createBusinessProcess;
  const useCaseIdentifier = Utilities.utilGenerateUUID();
  const contextRecordPrefix = CONFIGURATION.recordPrefix;
  const entityIds: any[] = [];
  /**
   * USE CASE:
   *    Details Form
   * ASSOCIATED COMPONENTS:
   *    src/app/business-processes/business-process-wizard/details/details.component.html
   * DESCRIPTION:
   *    Fill all the fields
   */

  //#region Context
  // URL to redirect after login or valid Cookies
  let contextURL = '';

  // record Id - Business Process
  let contextRecordId = '';

  // related to component
  let ui: BPUi.Details;
  let data: BPData.Details;

  // related to module
  let apiCRUD: BusinessProcessAPI.CRUD;

  // common page elements to verify and trigger
  let uiPage: Page;

  const baseUrl = Cypress.config().baseUrl;
  //#endregion

  //#region Load Fixtures

  // JSON files for UI Definitions, API and Data in fixtures
  const jsonCRUDApiBusinessProcess =
    'business-processes/create-wizard/details/definitions/form-details-def-api.json';
  const jsonUIDef =
    '/business-processes/create-wizard/details/definitions/form-details-def-ui.json';
  const jsonData =
    '/business-processes/create-wizard/details/form-details-data.json';

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
      ui = (definitions as unknown) as BPUi.Details;
    });

    // Loading Data
    cy.fixture(jsonData).as('data');
    cy.get('@data').then(dataF => {
      data = (dataF as unknown) as BPData.Details;
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
        //  set context URL
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

  //#region Details Form

  it('It should have the new navigation', () => {
    cy.get(ui.navigation.selector).as(Utilities.delAt(ui.navigation.alias));
    cy.get(ui.navigation.alias).should('be.visible');
  });

  it('It should have Basic Detail Title', () => {
    const cyElement = ui.title;
    cy.get(cyElement.selector).as(Utilities.delAt(cyElement.alias));
    cy.get(cyElement.alias).should('be.visible');
    cy.get(cyElement.alias).should('not.be.empty');
  });

  it('It should have tags button', () => {
    const cyElement = ui.tagsButton;
    cy.get(cyElement.selector).as(Utilities.delAt(cyElement.alias));
    cy.get(cyElement.alias).should('be.visible');
  });

  it('It should open tags modal after tags button is clicked', () => {
    const cyElement = ui.tagsButton;
    const tagsModalElement = ui.tagsModal;
    cy.get(cyElement.selector).as(Utilities.delAt(cyElement.alias));
    cy.get(cyElement.alias)
      .should('be.visible')
      .click();

    cy.get(tagsModalElement.selector).as(
      Utilities.delAt(tagsModalElement.alias)
    );
    cy.get(tagsModalElement.alias).should('be.visible');

    cy.modalCloseByIconButton('ta-business-process-tags');
  });

  it('It should have attachments button', () => {
    const cyElement = ui.attachmentsButton;
    cy.get(cyElement.selector).as(Utilities.delAt(cyElement.alias));
    cy.get(cyElement.alias).should('be.visible');
  });

  it('It should open attachments modal after attachments button is clicked', () => {
    const cyElement = ui.attachmentsButton;
    const attachmentsModal = ui.attachmentsModal;
    cy.get(cyElement.selector).as(Utilities.delAt(cyElement.alias));
    cy.get(cyElement.alias)
      .should('be.visible')
      .click();

    cy.get(attachmentsModal.selector).as(
      Utilities.delAt(attachmentsModal.alias)
    );
    cy.get(attachmentsModal.alias).should('be.visible');
    cy.modalCloseByIconButton('ta-notes-attachments');
  });

  it('It should have forms', () => {
    cy.get(ui.formDetails.selector).as(Utilities.delAt(ui.formDetails.alias));
    cy.get(ui.formDetails.alias).should('be.visible');
  });

  it('form fill - type System Name, Description, Notes', () => {
    cy.get(ui.processName.selector).as(Utilities.delAt(ui.processName.alias));
    cy.get(ui.processName.alias).should('be.visible');
    cy.get(ui.processName.alias).type('{selectall}{backspace}');
    cy.get(ui.processName.alias).type(
      `${data.data.processName} ${contextRecordId}`
    );

    cy.get(ui.description.selector).as(Utilities.delAt(ui.description.alias));
    cy.get(ui.description.selector).should('be.visible');
    cy.get(ui.description.alias).type(
      `${CONFIGURATION.recordPrefix}${data.data.description} ${contextRecordId}`
    );
  });

  it('It should have card title Owning Organization and Contact', () => {
    cy.get(ui.owingOrganizationsTitle.selector).as(
      Utilities.delAt(ui.owingOrganizationsTitle.alias)
    );
    cy.get(ui.owingOrganizationsTitle.alias).should('be.visible');
  });

  it('It should have empty page Owning Organization and Contact', () => {
    cy.get(ui.emptyOwingOrganizationsAndContacts.selector).as(
      Utilities.delAt(ui.emptyOwingOrganizationsAndContacts.alias)
    );
    cy.get(ui.emptyOwingOrganizationsAndContacts.alias).should('be.visible');
  });

  it('It should have "add owner" button', () => {
    cy.get(ui.addOwnerButton.selector).as(
      Utilities.delAt(ui.addOwnerButton.alias)
    );
    cy.get(ui.addOwnerButton.alias).should('be.visible');
  });

  it('It should open new owner modal after add owner button is clicked', () => {
    cy.get(ui.addOwnerButton.selector).as(
      Utilities.delAt(ui.addOwnerButton.alias)
    );
    cy.get(ui.addOwnerButton.alias)
      .should('be.visible')
      .click();
    cy.get(ui.addEditOwnerModalDef.addEditOwnerModal.selector).as(
      Utilities.delAt(ui.addEditOwnerModalDef.addEditOwnerModal.alias)
    );
    cy.get(ui.addEditOwnerModalDef.addEditOwnerModal.alias).should(
      'be.visible'
    );
  });

  it('form fill - select  Role', () => {
    const role = ui.addEditOwnerModalDef.ownerDef.role;
    cy.get(role.selector).as(Utilities.delAt(role.alias));
    cy.get(role.alias).should('exist');
    selectDropDown(role.alias, data.data.owner.role);
  });

  it('it should validate email error when email is not valid', () => {
    const email = ui.addEditOwnerModalDef.ownerDef.email;
    cy.get(email.selector).as(Utilities.delAt(email.alias));
    cy.get(email.selector).should('be.visible');
    cy.get(email.alias)
      .type(`${data.data.owner.wrongEmail}`)
      .blur();
    cy.get('.bp-owner-email-error').should('be.visible');
  });

  it('form fill - type Owner Name, Email', () => {
    const fullName = ui.addEditOwnerModalDef.ownerDef.fullName;
    const email = ui.addEditOwnerModalDef.ownerDef.email;
    cy.get(fullName.selector).as(Utilities.delAt(fullName.alias));
    cy.get(fullName.alias).type(
      `${data.data.owner.fullName} ${contextRecordId}`
    );

    cy.get(email.selector).as(Utilities.delAt(email.alias));
    cy.get(email.selector).should('be.visible');
    cy.get(email.alias).clear();
    cy.get(email.alias).type(`${data.data.owner.email}`);
  });

  it('form fill - select Department', () => {
    const department = ui.addEditOwnerModalDef.ownerDef.department;
    cy.get(department.selector).as(Utilities.delAt(department.alias));
    cy.get(department.alias).should('exist');
    selectDropDown(department.alias, data.data.owner.department);
  });

  it('form fill - select Company Affiliate', () => {
    const company = ui.addEditOwnerModalDef.ownerDef.company;
    cy.get(company.selector).as(Utilities.delAt(company.alias));
    cy.get(company.alias).should('exist');
    selectDropDown(company.alias, data.data.owner.company);
  });

  it('click Add; should create a new owner, close modal and show the new record in the table', () => {
    cy.get(ui.addEditOwnerModalDef.addOwnerModalButton.selector).as(
      Utilities.delAt(ui.addEditOwnerModalDef.addOwnerModalButton.alias)
    );
    cy.get(ui.addEditOwnerModalDef.addOwnerModalButton.alias)
      .should('be.visible')
      .click();

    cy.get(ui.table.selector).as(Utilities.delAt(ui.table.alias));
    cy.get(ui.table.alias).should('exist');

    cy.get(
      `${ui.table.selector} [data-cy='${data.data.owner.fullName} ${contextRecordId}']`
    )
      .first()
      .should('not.be.empty');
  });

  //#endregion
});
