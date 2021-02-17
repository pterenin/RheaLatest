import * as Utilities from '../../../../support/functions/utilities';
import * as CategoricalDropDown from '../../../../support/functions/shared/categorical-dropdown';
import { CyDescription } from '../../data-inventory/it-system/forms-ui-models';

/**
 *
 * @param selections list of the systems to select from async drop down
 * @param searchPrefix if search term in selections system is '%' this will replace with this text
 */
export function selectSystems(
  cySelectSystemElement: CyDescription,
  cyModalSystemElement: CyDescription,
  selections: any[],
  searchPrefix: string
) {
  selections.forEach(select => {
    addSystem(
      cySelectSystemElement,
      cyModalSystemElement,
      select.searchPrefix === '%' ? searchPrefix : select.searchPrefix,
      select.category
    );
  });
}

export function addSystem(
  cySelectSystemElement: CyDescription,
  cyModalSystemElement: CyDescription,
  systemSearchTerm: string,
  systemCategoryName: string,
  systemSelectIndexFromFilteredItems?: number
) {
  const cyApi = {
    postRequests: {
      method: 'POST',
      url: '/api/hub/**',
      alias: '@postRequest'
    }
  };

  cy.server();
  cy.route(cyApi.postRequests.method, cyApi.postRequests.url).as(
    Utilities.delAt(cyApi.postRequests.alias)
  );

  const selector = cySelectSystemElement.selector;
  const alias = cySelectSystemElement.alias;

  // ------------------------------------------------------------------
  cy.get(selector).as(Utilities.delAt(alias));
  cy.get(alias)
    .click()
    .within($element => {
      // async categorical drop down selection
      CategoricalDropDown.selectItemOfCategory(
        systemSearchTerm,
        systemCategoryName,
        systemSelectIndexFromFilteredItems
          ? systemSelectIndexFromFilteredItems
          : 0
      );
    });
  // ------------------------------------------------------------------
  // modal selection
  // following code expects the modal is visible
  // ------------------------------------------------------------------

  // replace --- with ui-def ---
  const modalSelector = cyModalSystemElement.selector;
  const modalAlias = cyModalSystemElement.alias;
  // replace --- with ui-def ---

  // cy.modalVerification(modalSelector, true);
  cy.modalVerification(modalSelector, true);
  cy.get(modalSelector).as(Utilities.delAt(modalAlias));
  cy.get(modalAlias)
    .within($modal => {
      // console.log($modal);
    })
    .then(x => {
      cy.modalClickSubmit(modalSelector);
    });

  cy.wait(cyApi.postRequests.alias).then(xhr => {
    expect(xhr.status, 'Valid Response').eq(200);
  });
}
