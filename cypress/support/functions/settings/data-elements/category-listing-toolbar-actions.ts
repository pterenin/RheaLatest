export function toolbarAliases() {
  // Toolbar - icon buttons
  cy.get('[data-cy="toolbar-admin-edit"]').as('toolbar-admin-edit');
  cy.get('[data-cy="toolbar-admin-show-hide"]').as('toolbar-admin-show-hide');

  cy.get('[data-cy="toolbar-admin-more"]').as('toolbar-admin-more');
  cy.get('[data-cy="toolbar-admin-more-unlink"]').as(
    'toolbar-admin-more-unlink'
  );
  cy.get('[data-cy="toolbar-admin-more-delete"]').as(
    'toolbar-admin-more-delete'
  );

  // Toolbar - add New
  cy.get('[data-cy="toolbar-admin-add-new"]').as('toolbar-admin-add-new');
  cy.get('[data-cy="toolbar-admin-add-new-category"]').as(
    'toolbar-admin-add-new-category'
  );
  cy.get('[data-cy="toolbar-admin-add-new-data-element"]').as(
    'toolbar-admin-add-new-data-element'
  );
}

export function toolbarClickAddCategory() {
  cy.get('@toolbar-admin-add-new').then(() => {
    cy.get('@toolbar-admin-add-new').click();
    cy.get('@toolbar-admin-add-new-category').should('be.visible');
    cy.get('@toolbar-admin-add-new-category').click();
  });
}

export function toolbarClickEditCategory() {
  cy.get('@toolbar-admin-add-new').should('be.visible');
  cy.get('@toolbar-admin-add-new').should('be.enabled');
  cy.get('@toolbar-admin-edit').click();
}

export function toolbarClickDelete() {
  cy.get('@toolbar-admin-more').then(() => {
    cy.get('@toolbar-admin-more').click();
    cy.get('@toolbar-admin-more-delete').should('be.enabled');
    cy.get('@toolbar-admin-more-delete').click();
  });
}
