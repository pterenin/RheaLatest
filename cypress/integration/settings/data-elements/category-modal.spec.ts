/// <reference types="Cypress" />
import { utilGenerateUUID } from '../../../support/functions/utilities';
import {
  toolbarAliases,
  toolbarClickAddCategory,
  toolbarClickDelete
} from '../../../support/functions/settings/data-elements/category-listing-toolbar-actions';
import { Page } from '../../../support/functions/shared/models-ui';
import { getDefaultUIFeatures } from '../../../support/functions/shared';

context.skip('RHEA>Settings>Data Elements>Category CRUD', () => {
  const cyConfigWaitDuration = Cypress.env('waitDuration');

  const modalCyAddNewCustomCategory = {
    modalSelector: 'ta-custom-category-modal',
    fields: {
      categoryName: '[data-cy="category"]'
    }
  };
  const customCategoryName = `_e2e-custom-category-${utilGenerateUUID()}`;

  const modalCyDeleteCustomCategory = {
    modalSelector: 'ta-confirm-delete-content',
    fields: {
      categoryName: '[data-cy="category"]'
    }
  };

  // common page elements to verify and trigger
  let uiPage: Page;

  //#region Load Fixtures

  function loadFixtures() {
    // Loading Common Elements for Page
    const jsonPageUI = 'page-def-ui.json';
    cy.fixture(jsonPageUI).as('page-def-ui');
    cy.get('@page-def-ui').then(definitions => {
      uiPage = (definitions as unknown) as Page;
    });

    cy.getAAARheaToken().then(() => {
      // Login and redirect to target page
      cy.loginAsAdministrator(
        {
          redirect: 'settings/data-elements/categories'
        },
        getDefaultUIFeatures
      );
    });
  }

  //#endregion

  before(() => {
    loadFixtures();
  });

  beforeEach(() => {
    cy.trustArcCookies();
    toolbarAliases();
  });

  //#region functions

  function addNewCategory(categoryName: string) {
    // open modal
    toolbarClickAddCategory();

    // input field should be empty
    cy.get(`${modalCyAddNewCustomCategory.fields.categoryName}`).should(
      'be.empty'
    );

    // Type text
    cy.modalTypeText(
      modalCyAddNewCustomCategory.modalSelector,
      modalCyAddNewCustomCategory.fields.categoryName,
      categoryName
    );

    // save button should be enabled on entered text
    cy.modalClickSubmit(modalCyAddNewCustomCategory.modalSelector);

    cy.wait(cyConfigWaitDuration);

    let isRecordCreated = false;
    cy.get(`.ta-table-body`).then($tableBody => {
      if (
        $tableBody.find(
          `[data-cy="category-name"]:contains(${customCategoryName})`
        )
      ) {
        isRecordCreated = true;
      }
      expect(isRecordCreated).to.be.true;
    });
  }

  //#endregion

  //#region Add New Custom Category

  xit(`Modal- add new Category - open modal, Verify 'Title', 'cancel, close
      and save' buttons exist and close/cancel is working`, () => {
    toolbarClickAddCategory();

    cy.modalVerification(modalCyAddNewCustomCategory.modalSelector, false);
    cy.modalCloseByIconButton(modalCyAddNewCustomCategory.modalSelector);

    toolbarClickAddCategory();
    cy.modalCloseByCancelButton(modalCyAddNewCustomCategory.modalSelector);
  });

  xit(`Modal- add new Category - create new record ${customCategoryName}  and verify it is showing in list`, () => {
    addNewCategory(customCategoryName);
  });

  //#endregion

  //#region Delete Custom Category

  xit(`Modal- delete custom Category - open modal, Verify 'Title',
      'cancel, close and delete' button exist and close/cancel is working`, () => {
    // selects previously created record
    cy.selectRecordByName(
      '[data-cy=category-name]',
      customCategoryName,
      'categories-record'
    );

    // open delete modal
    toolbarClickDelete();

    cy.modalDeleteVerification(modalCyDeleteCustomCategory.modalSelector);
    cy.modalCloseByIconButton(modalCyDeleteCustomCategory.modalSelector);

    toolbarClickDelete();
    cy.modalCloseByCancelButton(modalCyDeleteCustomCategory.modalSelector);
  });

  xit(`Modal- delete custom Category - delete record ${customCategoryName}`, () => {
    // open delete modal
    toolbarClickDelete();
    cy.modalClickSubmit(modalCyDeleteCustomCategory.modalSelector);
  });

  //#endregion
});
