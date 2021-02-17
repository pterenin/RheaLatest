import { getDefaultUIFeatures } from '../../../support/functions/shared';
/// <reference types="cypress" />
// @ts-check
import {
  toolbarAliases,
  toolbarClickAddCategory,
  toolbarClickDelete
} from './../../../support/functions/settings/data-elements/category-listing-toolbar-actions';

context.skip('RHEA>Settings>Data Elements>Category List', () => {
  before(() => {
    // Login and redirect to target page
    cy.loginAsAdministrator(
      {
        redirect: 'settings/data-elements'
      },
      getDefaultUIFeatures
    );
  });

  beforeEach(() => {
    cy.trustArcCookies();
    toolbarAliases();
  });

  it('should display Categories page', () => {
    cy.contains('Categories');
  });

  //#region toolbar

  it('Toolbar - should have View dropdown contains options All, Hidden, Visible', () => {
    cy.get('[data-cy="toolbar-view"]').as('toolbar-view');
    cy.get('[data-cy="toolbar-view-all"]').as('toolbar-view-all');
    cy.get('[data-cy="toolbar-view-hidden"]').as('toolbar-view-hidden');
    cy.get('[data-cy="toolbar-view-visible"]').as('toolbar-view-visible');

    cy.get('@toolbar-view').should('be.visible');
    cy.get('@toolbar-view').click();

    cy.get('@toolbar-view-all').should('be.visible');
    cy.get('@toolbar-view-hidden').should('be.visible');
    cy.get('@toolbar-view-visible').should('be.visible');
  });

  it('Toolbar - should have All Categories dropdown contains options All Categories, Custom Categories, Default Categories', () => {
    cy.get('[data-cy="toolbar-viewType"]').as('toolbar-viewType');
    cy.get('[data-cy="toolbar-viewType-category-all"]').as(
      'toolbar-viewType-category-all'
    );
    cy.get('[data-cy="toolbar-viewType-category-custom"]').as(
      'toolbar-viewType-category-custom'
    );
    cy.get('[data-cy="toolbar-viewType-category-default"]').as(
      'toolbar-viewType-category-default'
    );

    cy.get('@toolbar-viewType').should('be.visible');
    cy.get('@toolbar-viewType').click();

    cy.get('@toolbar-viewType-category-all').should('be.visible');
    cy.get('@toolbar-viewType-category-custom').should('be.visible');
    cy.get('@toolbar-viewType-category-default').should('be.visible');
  });

  it("Toolbar - 'Edit, Show Hide, Unlink, Delete' should be disabled", () => {
    cy.get('@toolbar-admin-edit').should('be.disabled');
    cy.get('@toolbar-admin-show-hide').should('be.disabled');
    cy.get('@toolbar-admin-more-unlink').should('be.disabled');
    cy.get('@toolbar-admin-more-delete').should('be.disabled');
    //
  });

  it("Toolbar - 'More' should be visible and on click shows 'Unlink, Delete' buttons", () => {
    cy.get('@toolbar-admin-more').should('be.visible');
    cy.get('@toolbar-admin-more-unlink').should('not.visible');
    cy.get('@toolbar-admin-more-delete').should('not.visible');

    cy.get('@toolbar-admin-more').click();
    cy.get('@toolbar-admin-more-unlink').should('be.visible');
    cy.get('@toolbar-admin-more-delete').should('be.visible');
  });

  it("Toolbar - 'Add New' button should be visible and on click shows 'Add New Category, Add New Data Element' buttons as visible and enabled", () => {
    cy.get('@toolbar-admin-add-new').should('be.visible');
    cy.get('@toolbar-admin-add-new').should('be.enabled');

    cy.get('@toolbar-admin-add-new-category').should('not.visible');
    cy.get('@toolbar-admin-add-new-data-element').should('not.visible');

    cy.get('@toolbar-admin-add-new').click();

    cy.get('@toolbar-admin-add-new-category').should('be.visible');
    cy.get('@toolbar-admin-add-new-category').should('be.enabled');

    cy.get('@toolbar-admin-add-new-data-element').should('be.visible');
    cy.get('@toolbar-admin-add-new-data-element').should('be.enabled');
  });

  //#endregion

  //#region Table Columns

  it('Data Table - should have columns Name, Data Type, Number of Linked Records', () => {
    cy.get('.ta-table-head .ta-table-row')
      .first()
      .should('not.be.empty');
    cy.get('[data-cy="category-columnHead-category"]')
      .first()
      .should('not.be.empty');
    cy.get('[data-cy="category-columnHead-dataType"]')
      .first()
      .should('not.be.empty');
    cy.get('[data-cy="category-columnHead-numberOfLinkedRecords"]')
      .first()
      .should('not.be.empty');
  });
  //#endregion

  //#region Toolbar behaviour on selection

  // it("Toolbar - should enable 'Show/Hide' as any non-custom category selection and vice versa", () => {
  //   // select and unselect record and verify behaviour

  //   cy.get('@toolbar-admin-show-hide').should('be.disabled');

  //   // select
  //   cy.get('[data-cy="categories-record-0"] ta-checkbox')
  //     .first()
  //     .click();
  //   cy.get('@toolbar-admin-show-hide').should('be.enabled');
  //   cy.get('@toolbar-admin-add-new').should('be.disabled');

  //   // deselect
  //   cy.get('[data-cy="categories-record-0"] ta-checkbox')
  //     .first()
  //     .click();
  //   cy.get('@toolbar-admin-show-hide').should('be.disabled');
  //   cy.get('@toolbar-admin-add-new').should('be.enabled');
  // });

  //#endregion
});
