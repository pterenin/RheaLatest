import * as Utilities from './../utilities';
/**
 * src/app/shared/components/location-modal-content/location-modal-content.component.html
 */
export function selectRegionCountries(region: string, countries: string[]) {
  // click region
  const selectorRegion = '[data-cy="modal-location-region"]';
  const aliasRegion = '@modal-location-region';
  cy.get(selectorRegion).as(Utilities.delAt(aliasRegion));
  cy.get(aliasRegion)
    .contains(region)
    .should('be.visible')
    .click();

  const selectorCountry = '[data-cy="modal-location-country"]';
  const aliasCountry = '@modal-location-country';
  cy.get(selectorCountry).as(Utilities.delAt(aliasCountry));
  countries.forEach(country => {
    cy.get(aliasCountry)
      .contains(country)
      .scrollIntoView();

    cy.get(aliasCountry)
      .contains(country)
      .should('be.visible')
      .click();
  });

  cy.get(aliasRegion)
    .contains(region)
    .scrollIntoView();

  cy.get(aliasRegion)
    .contains(region)
    .should('be.visible')
    .click();
}
