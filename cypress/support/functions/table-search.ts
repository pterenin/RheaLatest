//  Guidelines
//  Grid is combination of rows and cells, add following in html component file
//  data-cy tag for row have row index
//  associated columns have their own data-cy to identify the  column
//  recommended: attach 'data-cy-row-index' to the most searchable column for quickly identify the row
//

//#region TableColumns

function tableWithColumns(arrayOfColumnIds: string[]) {
  cy.get('.ta-table-head .ta-table-row')
    .first()
    .should('not.be.empty');

  // for (columnId in arrayOfColumnIds) {
  arrayOfColumnIds.forEach(columnId => {
    cy.get(`.ta-table-head ta-table-column #${columnId}`)
      .first()
      .should('not.be.empty');
  });
}

export function isRecordExistByName(selector: string, name: string) {
  cy.get(`.ta-table-body ${selector}:contains(${name})`);
}

export function selectRecordByName(
  selector: string,
  name: string,
  prefixRowCyId: string
) {
  cy.get(`.ta-table-body ${selector}:contains(${name})`).then($index => {
    cy.get(
      `[data-cy="${prefixRowCyId}-${$index.attr(
        'data-cy-row-index'
      )}"] ta-checkbox`
    ).click();
  });
}

//#endregion
