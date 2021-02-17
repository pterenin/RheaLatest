//
// https://docs.cypress.io/guides/guides/web-security.html#Disabling-Web-Security
// https://github.com/cypress-io/cypress/issues/944
//
export function createCompanyAffiliate(name: string) {
  // For Company Affiliate Type
  const cyConfigWaitDuration = Cypress.env('waitDuration');
  cy.wait(cyConfigWaitDuration);
  cy.get('#companyName').type(name);
  cy.get('ta-dropdown-field').each($el => {
    // Select last in each dropdown - minimal set of required fields
    // console.log($el);
    cy.wrap($el)
      .children()
      .last()
      .click()
      .within(el => {
        cy.wrap(el)
          .children()
          .last()
          .children()
          .last()
          .children()
          .last()
          .click();
      });
  });

  // Save Entity
  cy.get('button.ta-button.btn.btn-primary').click();
  cy.wait(cyConfigWaitDuration);
}

export function createThirdParty(name: string) {
  // Create Thrid Party
  const cyConfigWaitDuration = Cypress.env('waitDuration');
  cy.wait(cyConfigWaitDuration);
  cy.get('#vendorName').type(name);
  cy.get('ta-dropdown-field').each($el => {
    // Select last in each dropdown - minimal set of required fields
    // console.log($el);
    cy.wrap($el)
      .children()
      .last()
      .click()
      .within(el => {
        cy.wrap(el)
          .children()
          .last()
          .children()
          .last()
          .children()
          .last()
          .click();
      });
  });

  // Save Entity
  cy.get('button.ta-button.btn.btn-primary').click();
  cy.wait(cyConfigWaitDuration);
}

/**
 * Search and Clone the record
 * @param name Name of the Entity
 */
export function cloneEntityByName(name: string) {
  // search record
  cy.get('ta-table-search')
    .then($searchTable => {
      if ($searchTable.find('ta-table-search ta-icon[icon="close"]').length) {
        cy.get('ta-table-search ta-icon[icon="close"]').click({
          force: true,
          multiple: true
        });
      }
    })
    .type(name)
    .type('{enter}');
  cy.wait(3000);

  // click clone for first row returned
  cy.get(`.ta-table-cell-tools [data-cy="more-record-menu"]`)
    .first()
    .click()
    .then(() => {
      cy.get('button')
        .contains('Clone')
        .click();
    });

  // verify clone modal
  const modalSelector = 'ta-clone-record-inventory-modal';
  cy.modalVerification(modalSelector, true);

  // click attachments checkbox
  cy.get(`${modalSelector} ta-checkbox`)
    .contains('All attachments')
    .click();

  // click tags checkbox
  cy.get(`${modalSelector} ta-checkbox`)
    .contains('All tags')
    .click();

  cy.server();
  cy.route('POST', '**/clone').as('postRequestClone');

  // click clone
  cy.modalClickSubmit(modalSelector);

  // wait for clone request to complete
  cy.wait('@postRequestClone').then(xhr => {
    // tslint:disable: no-unused-expression
    console.log('%c%o', 'color: #807160', xhr);
    const body = xhr.responseBody as any;
    expect(body).to.be.not.undefined;
    expect(body.id).to.be.not.undefined;
    expect(body.id).not.null;
    return body.id;
  });
}

export function deleteEntityByName(name: string) {
  // cy.visit('data-inventory/my-inventory');
  const cyConfigWaitDuration = Cypress.env('waitDuration');
  // cy.wait(cyConfigWaitDuration);
  // console.log('delete entity by name');
  cy.get('.ta-table-body').within($body => {
    cy.get('.ta-table-row').each($row => {
      cy.wrap($row).within($$row => {
        cy.get('.data-inventory-name')
          .invoke('text')
          .then(text => {
            if (text.toString().trim() === name) {
              cy.get('ta-table-cell.ta-table-cell-tools').within($el => {
                cy.wrap($el)
                  .click()
                  .within($$el => {
                    cy.wrap($$el)
                      .children()
                      .first()
                      .children()
                      .last()
                      .children()
                      .children()
                      .last() // Select last, i.e. "Delete" (first is "Edit")
                      .click(); // Click delete button
                  });
              });
            }
          });
      });
    });
  });
  cy.wait(cyConfigWaitDuration);
  cy.get('ta-confirm-delete-content').contains('Confirm Delete');
  cy.get('ta-confirm-delete-content button.ta-button.btn.btn-primary').click();
}

// export function createEntityByTypeAndName(type: string, name: string) {
//   // For Third Party Type
//   if (type === 'third-party') {
//     cy.visit('data-inventory/my-inventory/third-party/new?action=Add');
//     cy.wait(cyConfigWaitDuration);
//     cy.get('#vendorName').type(name);
//     cy.get('ta-dropdown-field').each($el => {
//       // Select last in each dropdown - minimal set of required fields
//       console.log($el);
//       cy.wrap($el)
//         .children()
//         .last()
//         .click()
//         .within(el => {
//           cy.wrap(el)
//             .children()
//             .last()
//             .children()
//             .last()
//             .children()
//             .last()
//             .click();
//         });
//     });

//     // Save Entity
//     cy.get('button.ta-button.btn.btn-primary').click();
//     cy.wait(cyConfigWaitDuration);
//   } else if (type === 'company-affiliate') {
//     // For Company Affiliate Type
//     cy.visit('data-inventory/my-inventory/company-affiliate/new?action=Add');
//     cy.wait(cyConfigWaitDuration);
//     cy.get('#companyName').type(name);
//     cy.get('ta-dropdown-field').each($el => {
//       // Select last in each dropdown - minimal set of required fields
//       console.log($el);
//       cy.wrap($el)
//         .children()
//         .last()
//         .click()
//         .within(el => {
//           cy.wrap(el)
//             .children()
//             .last()
//             .children()
//             .last()
//             .children()
//             .last()
//             .click();
//         });
//     });

//     // Save Entity
//     cy.get('button.ta-button.btn.btn-primary').click();
//     cy.wait(cyConfigWaitDuration);
//   } else {
//     throw new Error('Unsupported entity type');
//   }
// }
