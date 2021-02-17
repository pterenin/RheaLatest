import { getDefaultUIFeatures } from '../../support/functions/shared';
/// <reference types="cypress" />

import { utilGenerateUUID } from '../../support/functions/utilities';

context('RHEA - Data Inventory', () => {
  const nameThirdParty = `e2e DI Third Party TEST - ${utilGenerateUUID()}`;
  let isRecordCreated = false;
  before(() => {
    // Login and redirect to target page
    cy.loginAsAdministrator(
      {
        redirect: 'data-inventory/my-inventory'
      },
      getDefaultUIFeatures
    );
  });

  after(() => {
    // Delete recently created record from list
    //
    if (isRecordCreated) {
      cy.deleteEntityByName(nameThirdParty);
    }
  });

  beforeEach(() => {
    cy.trustArcCookies();
  });

  it('should display data inventory page', () => {
    cy.contains('Data Inventory');
  });

  it('should display data inventory records', () => {
    cy.selectAllConfigurableColumns();
    cy.get('.ta-table-head .ta-table-row')
      .first()
      .should('not.be.empty');
    cy.get('.ta-table-head ta-table-column#di-name')
      .first()
      .should('not.be.empty');
    cy.get('[data-cy="di-data-transfer"]')
      .first()
      .should('not.be.empty');
    cy.get('.ta-table-head ta-table-column#di-type')
      .first()
      .should('not.be.empty');
    cy.get('.ta-table-head ta-table-column#di-id')
      .first()
      .should('not.be.empty');
    cy.get('.ta-table-head ta-table-column#di-bp')
      .first()
      .should('not.be.empty');
    cy.get('.ta-table-head ta-table-column#di-contact')
      .first()
      .should('not.be.empty');
    cy.get('.ta-table-head ta-table-column#di-last-updated')
      .first()
      .should('not.be.empty');
  });

  it('should be searchable', () => {
    cy.get('ta-table-search input')
      .type(nameThirdParty)
      .type('{enter}');
  });

  it('should clear search when "x" is click', () => {
    cy.get('.ta-svg-icon-close').click();
    cy.get('ta-table-search input').clear();
    cy.get('ta-table-search input').type('{enter}');
  });

  it('should expand context menu and have list options', () => {
    cy.get('#addDropdown')
      .first()
      .click();
    cy.get('a.dropdown-item').contains('New Third Party');
    cy.get('a.dropdown-item').contains('New System');
    cy.get('a.dropdown-item').contains('New Company Affiliate');
    cy.get('a.dropdown-item').contains('Import Data');
  });
});
