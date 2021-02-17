import * as Utilities from './../utilities';
import { selectRegionCountries } from './ta-location-modal-content';
import { CyAPI } from './models-api';

/**
 * src/app/shared/components/async-categorical-dropdown/async-categorical-dropdown.component.html
 */

export function selectItemOfCategory(
  searchTerm: string,
  categoryName: string,
  itemIndex?: number
) {
  const cyApi: CyAPI = {
    method: 'GET',
    url: '/api/hub/**',
    alias: '@getRequests'
  };
  cy.server();
  cy.route(cyApi.method, cyApi.url).as(Utilities.delAt(cyApi.alias));

  const selectorCategorySearch = '[data-cy="categorical-dropdown-search"]';
  cy.get(selectorCategorySearch)
    .first()
    .scrollIntoView()
    .type(searchTerm);

  cy.wait(cyApi.alias).then(xhr => {
    expect(xhr.status, 'Valid Response').eq(200);
  });

  const waitTime = Cypress.env('waitDurationCategoryDropDown');
  cy.wait(waitTime);

  cy.route(cyApi.method, cyApi.url).as(Utilities.delAt(cyApi.alias));
  // select category
  const selectorCategories = '[data-cy="categorical-dropdown-categories"]';
  cy.get(selectorCategories)
    .contains(categoryName)
    .scrollIntoView()
    .should('be.visible')
    .click({ force: true });

  cy.wait(cyApi.alias).then(xhr => {
    expect(xhr.status, 'Valid Response').eq(200);
  });

  // verify if items has any thing to select
  const selectorCategoryItems =
    '[data-cy="categorical-dropdown-category-items"]';
  cy.get(selectorCategoryItems).should('have.length.greaterThan', 0);

  // select the first item
  cy.get(selectorCategoryItems)
    .should('be.visible')
    .contains(searchTerm)
    .should('be.visible')
    .click({ force: true });
}

export function selectItemsOfCategories(
  parentSelector: string,
  selections: { searchPrefix: string; category: string }[]
) {
  cy.get(parentSelector)
    .should('be.visible')
    .within(element => {
      const selectedItemsDropDown =
        '[data-cy="selected-items-container-dropdown"]';
      cy.get(selectedItemsDropDown).click();

      selections.forEach(select => {
        console.log('%c selection %o', 'color: #ff6600', select);

        const searchInputSelector = '[data-cy="categorical-view-search-input"]';
        cy.get(searchInputSelector)
          .click()
          .type('{selectall}{backspace}');

        cy.get(searchInputSelector)
          .click()
          .type(select.searchPrefix);

        const categoriesSelector = '[data-cy="categories"]';
        cy.get(categoriesSelector)
          .contains(select.category)
          .scrollIntoView()
          .click();

        const itemsSelector = '[data-cy="categories-items"]';
        cy.get(itemsSelector)
          .contains(select.searchPrefix)
          .scrollIntoView()
          .click();
      });
    });
}

export function selectItemsOfCategory(
  selections: { searchPrefix: string; category: string }[]
) {
  selections.forEach(select => {
    // console.log('%c selection %o', 'color: #ff6600', select);

    const searchInputSelector = '[data-cy="categorical-view-search-input"]';
    cy.get(searchInputSelector)
      .click()
      .type('{selectall}{backspace}');

    cy.get(searchInputSelector)
      .click()
      .type(select.searchPrefix);

    const categoriesSelector = '[data-cy="categories"]';
    cy.get(categoriesSelector)
      .contains(select.category)
      .scrollIntoView()
      .click();

    const itemsSelector = '[data-cy="categories-items"]';
    cy.get(itemsSelector)
      .contains(select.searchPrefix)
      .scrollIntoView()
      .click();
  });
}

export function selectItemOfCategoryAndLocations(
  parentSelector: string,
  searchTerm: string,
  categoryName: string,
  locations: any,
  itemIndex: number
) {
  cy.get(parentSelector)
    .should('be.visible')
    .within(element => {
      const selectedItemsDropDown =
        '[data-cy="selected-items-container-dropdown"]';
      cy.get(selectedItemsDropDown).click();

      const searchInputSelector = '[data-cy="categorical-view-search-input"]';
      cy.get(searchInputSelector)
        .click()
        .type('{selectall}{backspace}');

      cy.get(searchInputSelector)
        .click()
        .type(searchTerm);

      const categoriesSelector = '[data-cy="categories"]';
      cy.get(categoriesSelector)
        .contains(categoryName)
        .scrollIntoView()
        .click();

      const itemsSelector = '[data-cy="categories-items"]';
      cy.get(itemsSelector)
        .contains(searchTerm)
        .scrollIntoView()
        .click();
    });

  // location modal def
  const modalSelector = 'ta-location-modal-content';
  const modalAlias = '@ta-location-modal-content';
  cy.modalVerification(modalSelector, false);

  cy.get(modalSelector).as(Utilities.delAt(modalAlias));
  cy.get(modalAlias)
    .find('ta-location')
    .within($modal => {
      locations.forEach((location: any) => {
        selectRegionCountries(location.region, location.countries);
      });
    });
  cy.modalClickSubmit(modalSelector);
}

export function selectItemOfCategoryAndLocationsForDataFlow(
  parentSelector: string,
  searchTerm: string,
  categoryName: string,
  locations: any,
  itemIndex: number
) {
  cy.get(parentSelector)
    .should('exist')
    .within(element => {
      const selectedItemsDropDown =
        '[data-cy="data-flow-dropdown-open-button"]';
      cy.get(selectedItemsDropDown).click();

      const searchInputSelector = '[data-cy="categorical-view-search-input"]';
      cy.get(searchInputSelector)
        .click()
        .type('{selectall}{backspace}');

      cy.get(searchInputSelector)
        .click()
        .type(searchTerm);

      const categoriesSelector = '[data-cy="categories"]';
      cy.get(categoriesSelector)
        .contains(categoryName)
        .scrollIntoView()
        .click();

      const itemsSelector = '[data-cy="categories-items"]';
      cy.get(itemsSelector)
        .contains(searchTerm)
        .scrollIntoView()
        .click();
    });

  // location modal def
  const modalSelector = 'ta-popover-window  #modal-save';
  const modalAlias = '@ta-popover-window-save';
  cy.get(modalSelector).as(Utilities.delAt(modalAlias));
  cy.get(modalAlias).click();

  // todo: add/edit locations as step#5 get updated with same subject reselection
}
