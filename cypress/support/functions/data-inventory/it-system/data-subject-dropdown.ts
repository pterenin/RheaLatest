import { delAt } from './../../utilities';
import { searchAndSelectDropDown } from './../../shared/ta-dropdown-field';

export function searchAndSelectSubjectName(
  rowIndex: number,
  selectItem: string
) {
  const selectorParent = `ta-dropdown-field[data-cy="data-subject-name-${rowIndex}"]`;
  const aliasParent = '@data-subject-name';

  cy.get(selectorParent).as(delAt(aliasParent));
  cy.get(aliasParent).should('exist');
  // console.log(`%c exist: %o %o`, 'color:orange;', selectorParent);
  cy.get(aliasParent).within($ds => {
    searchAndSelectDropDown(aliasParent, selectItem, selectItem);
  });
}
