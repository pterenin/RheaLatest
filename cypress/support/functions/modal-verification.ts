// Guidelines
// every modal will have Title, buttons (Close, Cancel, Submit(Save/Edit/Delete) )
// Each tag action button will have associated cypress tag 'data-cy' and convention 'modal-[associated action]'

export const modalCy = {
  title: '[data-cy="modal-title"]',
  close: '[data-cy="modal-close"]',
  cancel: '[data-cy="modal-cancel"]',
  submit: '[data-cy="modal-submit"]'
};

//#region Modal

export function modalVerification(
  modalSelector: string,
  isSubmitEnabled: boolean = false
) {
  // modal verifications
  // verify modal has title
  cy.get(`${modalSelector} ${modalCy.title}`).should('not.be.empty');

  // verify modal have cancel ,save and close button
  cy.get(`${modalSelector}  ${modalCy.close}`).should('be.visible');
  cy.get(`${modalSelector}  ${modalCy.cancel}`).should('be.visible');
  cy.get(`${modalSelector}  ${modalCy.submit}`).should('be.visible');

  if (isSubmitEnabled) {
    // save button should be disabled
    cy.get(`${modalSelector} ${modalCy.submit}`).should('be.enabled');
  } else {
    cy.get(`${modalSelector} ${modalCy.submit}`).should('be.disabled');
  }
}

export function modalCloseByIconButton(modalSelector: string) {
  // cancel icon in header should close the modal
  cy.get(`${modalSelector} ${modalCy.close}`).click();
  cy.get(`${modalSelector}`).should('not.exist');
}

export function modalCloseByCancelButton(modalSelector: string) {
  // Cancel button in footer should close the modal
  cy.get(`${modalSelector} ${modalCy.cancel}`).click();
  cy.get(`${modalSelector} `).should('not.exist');
}

export function modalTypeText(
  modalSelector: string,
  textInputSelector: string,
  typeText: string
) {
  cy.get(`${modalSelector} ${textInputSelector}`).type(typeText);
}

export function modalClickSubmit(modalSelector: string) {
  cy.get(`${modalSelector} ${modalCy.submit}`).should('be.enabled');
  cy.get(`${modalSelector} ${modalCy.submit}`).click();
}

export function modalDeleteVerification(modalSelector: string) {
  // modal verifications
  // verify modal has title
  cy.get(`${modalSelector} ${modalCy.title}`).should('not.be.empty');

  // // verify modal have cancel ,save and close button
  cy.get(`${modalSelector}  ${modalCy.close}`).should('be.visible');
  cy.get(`${modalSelector}  ${modalCy.cancel}`).should('be.visible');
  cy.get(`${modalSelector}  ${modalCy.submit}`).should('be.visible');

  // // save button should be disabled
  cy.get(`${modalSelector} ${modalCy.submit}`).should('be.enabled');
}

//#endregion
