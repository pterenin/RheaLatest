import { ITSystem } from '../../../support/functions/data-inventory/it-system/forms-ui-models';
import {
  getDefaultUIFeatures,
  getNewUIFeatures
} from '../../../support/functions/shared';
/// <reference types="cypress" />

import { utilGenerateUUID } from '../../../support/functions/utilities';
import * as Utilities from '../../../support/functions/utilities';

context('RHEA - Data Inventory - Company Affiliate', () => {
  const CONFIGURATION = Cypress.env('optional').dataInventory.ItSystems;

  const redirectsDataInventory = {
    listing: 'data-inventory/my-inventory',
    addNewCompanyAffiliate:
      'data-inventory/my-inventory/company-affiliate/new?action=Add'
  };
  let redirectListing = false;
  let ui: ITSystem.ITSystemDetail;

  const jsonUIDef =
    '/data-inventory/it-system/definitions/form-details-def-ui.json';

  function loadFixtures() {
    cy.fixture(jsonUIDef).as('def-ui');
    cy.get('@def-ui').then(definitions => {
      ui = (definitions as unknown) as ITSystem.ITSystemDetail;
    });
  }

  before(() => {
    cy.loginAsAdministrator(
      {
        redirect: redirectListing
          ? redirectsDataInventory.listing
          : redirectsDataInventory.addNewCompanyAffiliate
      },
      getDefaultUIFeatures
    );
    loadFixtures();
  });

  beforeEach(() => {
    cy.trustArcCookies();
  });

  it('should display data inventory page', () => {
    cy.contains('Company Affiliate');
  });

  it('should display warning "One or more fields need attention" if fields are blank', () => {
    cy.contains('One or more fields need attention');
  });

  it('it should validate email error when email is not valid', () => {
    const email = ui.companyAffiliate.emailAddress;
    cy.get(email.selector).as(
      Utilities.delAt(ui.companyAffiliate.emailAddress.alias)
    );
    cy.get(email.alias).should('be.visible');
    const invalidEmailAddress = `abc@abc`;
    cy.get(email.alias)
      .type(invalidEmailAddress)
      .blur();
    cy.get(ui.companyAffiliate.emailAddressErrorMessage.selector).should(
      'be.visible'
    );
    cy.get(email.alias).clear();
  });

  it('should display error if name is empty and form is dirty', () => {
    cy.get('#companyName')
      .type('Company Affiliate 1')
      .clear();
    cy.get('#notes').click();
    cy.contains('This field is required.');
  });

  const recordName = `${CONFIGURATION.recordPrefix}${'Company Affiliate'}`;

  // Test creation of Company Affiliate and deletion
  it(`should fill fields and create record ${recordName}`, () => {
    cy.createCompanyAffiliate(recordName);
    redirectListing = true;
  });
});
