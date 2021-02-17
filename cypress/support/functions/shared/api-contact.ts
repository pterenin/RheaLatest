import { Contact } from './models-api';

/**
 * Create a contact from Contacts controller
 * @param contact Contact object
 */
export function createByApiContact(contact: Contact) {
  // verify JWT token exist
  const tokenAAA = localStorage.getItem('aaa-token');
  // tslint:disable-next-line: no-unused-expression
  expect(tokenAAA).not.null;

  const baseUrl = Cypress.config().baseUrl;
  const api = {
    method: 'POST',
    url: 'api/hub/contacts',
    alias: '@api'
  };

  cy.server();
  cy.request({
    method: api.method,
    url: `${baseUrl}/${api.url}`,
    auth: {
      bearer: tokenAAA
    },
    body: contact
  })
    .its('body')
    .then(body => {
      expect(body).to.have.property('id');
      assert.isNotNull(body.id, ' must have id');

      // console.log('%c%o', 'color: #00a3cc', body);
      return body.id;
    });
}

/**
 * Create a contact from Contacts controller
 * @param contactId id of Contact to remove
 */
export function deleteByApiContact(contactId: string) {
  // verify JWT token exist
  const tokenAAA = localStorage.getItem('aaa-token');
  // tslint:disable-next-line: no-unused-expression
  expect(tokenAAA).not.null;

  const baseUrl = Cypress.config().baseUrl;
  const api = {
    method: 'DELETE',
    url: 'api/hub/contacts',
    alias: '@api'
  };

  cy.server();
  cy.request({
    method: api.method,
    url: `${baseUrl}/${api.url}/${contactId}`,
    auth: {
      bearer: tokenAAA
    }
  })
    .its('body')
    .then(body => {
      // console.log('%c%o', 'color: #00a3cc', body)
      expect(body.hasErrors).eq(undefined);
      return body.id;
    });
}
