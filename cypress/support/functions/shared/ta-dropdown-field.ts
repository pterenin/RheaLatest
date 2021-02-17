/**
 * ta-dropdown-field
 * @param aliasParent  : attach a tag to actual ta-dropdown-field 'data-cy="location-country"'
 * @param search : specify search term to filter all options
 * @param item : find item in the the list and select it, if you don`t supply, by default try to find search parameter in filtered list
 */
export function searchAndSelectDropDown(
  aliasParent: string,
  search: string,
  item?: string
) {
  const clickDropDownButton =
    '[data-cy="dropdown-field-click"] ta-icon[icon="chevron-down"]';
  cy.get(aliasParent)
    .find(clickDropDownButton)
    .should('be.visible')
    .click();
  const textInputSearch = '[data-cy="dropdown-field-search"]  input';
  cy.get(aliasParent)
    .find(textInputSearch)
    .should('be.visible')
    .click()
    .type(search);

  if (!item) {
    item = search;
  }
  const selectFilteredOption = '[data-cy="dropdown-field-search-option"]';
  cy.get(aliasParent)
    .find(selectFilteredOption)
    .contains(item)
    .should('be.visible')
    .click();
}

/**
 * For non-searchable, non-categorical dropdown selection
 * @param aliasParent data-cy tag
 * @param item item to select in list
 */
export function selectDropDown(aliasParent: string, item: string) {
  const clickDropDownButton =
    '[data-cy="dropdown-field-click"] ta-icon[icon="chevron-down"]';
  cy.get(aliasParent)
    .find(clickDropDownButton)
    .should('be.visible')
    .click();
  const selectFilteredOption = '[data-cy="dropdown-field-search-option"]';
  cy.get(aliasParent)
    .find(selectFilteredOption)
    .contains(item)
    .scrollIntoView()
    .click();
}
