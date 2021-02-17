import { getDefaultUIFeatures } from '../../../support/functions/shared';
/// <reference types="cypress" />

import { utilGenerateUUID } from '../../../support/functions/utilities';
const cyConfigWaitDuration = Cypress.env('waitDuration');
context('RHEA - Data Inventory - Third Party', () => {
  const CONFIGURATION = Cypress.env('optional').dataInventory.ItSystems;

  const redirectsDataInventory = {
    listing: 'data-inventory/my-inventory',
    addNewThirdParty: 'data-inventory/my-inventory/third-party/new?action=Add'
  };
  let redirectListing = false;

  before(() => {
    cy.loginAsAdministrator(
      {
        redirect: redirectListing
          ? redirectsDataInventory.listing
          : redirectsDataInventory.addNewThirdParty
      },
      getDefaultUIFeatures
    );
  });

  beforeEach(() => {
    cy.trustArcCookies();
  });

  it('should display data inventory page', () => {
    cy.contains('Third Party');
  });

  it('should display warning "One or more fields need attention" if fields are blank', () => {
    cy.contains('One or more fields need attention');
  });

  it('should display error if name is empty and form is dirty', () => {
    cy.get('#vendorName')
      .type('Third Party 1')
      .clear();
    cy.get('#dropdownBasic1').click();
    cy.contains('This field is required.');
  });

  it('should display proper options for selected dropdowns', () => {
    cy.get('ta-dropdown-field').each(($el, index, $list) => {
      // Only 4 "ta-dropdown-field" elements should be present
      expect($list.length).to.equal(4);

      // Check options for "Type of Third Party"
      if (index === 0) {
        cy.wrap($el)
          .children()
          .last()
          .click()
          .within(el => {
            cy.wrap(el)
              .children()
              .last()
              .contains('Partner');
            cy.wrap(el)
              .children()
              .last()
              .contains('Vendor');
            cy.wrap(el)
              .children()
              .last()
              .contains('Customer');
            cy.wrap(el)
              .children()
              .last()
              .contains('Service Provider');
            cy.wrap(el)
              .children()
              .last()
              .contains('Business Associate');
          });
        cy.wrap($el)
          .children()
          .last()
          .click(); // close dropdown
      }
      // Check options for "Data Controller or Processor"
      if (index === 1) {
        cy.wrap($el)
          .children()
          .last()
          .click()
          .within(el => {
            cy.wrap(el)
              .children()
              .last()
              .contains('Data Controller');
            cy.wrap(el)
              .children()
              .last()
              .contains('Data Processor');
            cy.wrap(el)
              .children()
              .last()
              .contains('Data Controller & Data Processor');
            cy.wrap(el)
              .children()
              .last()
              .contains('Joint Data Controller');
            cy.wrap(el)
              .children()
              .last()
              .contains('Joint Data Controller & Data Processor');
            cy.wrap(el)
              .children()
              .last()
              .contains('Not Applicable');
            cy.wrap(el)
              .children()
              .last()
              .contains('Not Determined');
          });
        cy.wrap($el)
          .children()
          .last()
          .click(); // close dropdown
      }
    });
  });

  const recordName = `${CONFIGURATION.recordPrefix}${'Third Party'}`;

  it(`should fill fields and create record ${recordName}`, () => {
    cy.createThirdParty(recordName);
    redirectListing = true;
  });
});
