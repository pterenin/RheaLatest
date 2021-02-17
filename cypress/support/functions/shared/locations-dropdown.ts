import { delAt } from '../utilities';

/**
 * src/app/shared/components/input-location/input-location.component.html
 * use this methods as within the container e.g parent container data-cy='hosting-locations'
 */

//#region Locations

export function addAndSelectLocation(country: string, states: string[]) {
  const selectorLocation = `[data-cy^="location-row"]`;
  const aliasLocations = '@locations';

  cy.get(selectorLocation).as(delAt(aliasLocations));
  cy.get(aliasLocations).should('exist');
  cy.get(aliasLocations).then($list => {
    const index = $list.length;
    const selectorActionAddLocation = '[data-cy="location-action-add"]';
    const aliasActionAddLocation = '@location-action-add';

    cy.get(selectorActionAddLocation).as(delAt(aliasActionAddLocation));
    cy.get(aliasActionAddLocation).click();
    cy.get(aliasLocations)
      .should('be.visible')
      .click();

    selectLocation(index, country, states);
  });
}

export function selectLocation(
  rowIndex: number,
  country: string,
  states: string[]
) {
  // select country
  const selectorLocationCountry = `ta-dropdown-field[data-cy="location-country-${rowIndex}"]`;
  const aliasLocationCountry = '@location-country';
  cy.get(selectorLocationCountry).as(delAt(aliasLocationCountry));
  cy.get(aliasLocationCountry).should('exist');
  cy.get(aliasLocationCountry).within($country => {
    const clickSearch =
      '[data-cy="dropdown-field-click"] ta-icon[icon="chevron-down"]';
    cy.get(aliasLocationCountry)
      .find(clickSearch)
      .should('be.visible')
      .click();

    const textInputSearch = '[data-cy="dropdown-field-search"]  input';
    cy.get(aliasLocationCountry)
      .find(textInputSearch)
      .should('be.visible')
      .click()
      .type(country);

    const selectFilteredOption = '[data-cy="dropdown-field-search-option"]';
    cy.get(aliasLocationCountry)
      .find(selectFilteredOption)
      .contains(country)
      .should('be.visible')
      .click();
  });

  const selectorLocationState = `ta-dropdown-field[data-cy="location-state-${rowIndex}"]`;
  const aliasLocationState = '@location-country';
  cy.get(selectorLocationState).as(delAt(aliasLocationState));
  cy.get(aliasLocationState).should('exist');
  cy.get(aliasLocationState).within($state => {
    states.forEach(state => {
      const clickSearch =
        '[data-cy="dropdown-field-click"] ta-icon[icon="chevron-down"]';
      cy.get(aliasLocationState)
        .find(clickSearch)
        .should('be.visible')
        .click();

      const textInputSearch = '[data-cy="dropdown-field-search"]  input';
      cy.get(aliasLocationState)
        .find(textInputSearch)
        .should('be.visible')
        .click()
        .type(state);

      const selectFilteredOption = '[data-cy="dropdown-field-search-option"]';
      cy.get(aliasLocationState)
        .find(selectFilteredOption)
        .contains(state)
        .should('be.visible')
        .click();
    });
  });
}

export function removeLocation(rowIndex: number) {
  const selectorRemoveLocation = `[data-cy="location-action-delete-${rowIndex}"]`;
  const aliasRemoveLocation = '@location-action-remove';
  cy.get(selectorRemoveLocation).as(delAt(aliasRemoveLocation));
  cy.get(aliasRemoveLocation)
    .should('be.visible')
    .click();
}

//#endregion
