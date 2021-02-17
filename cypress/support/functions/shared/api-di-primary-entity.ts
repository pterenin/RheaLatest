// e2e-test profile must be enabled in the API

/**
 * creates primary entity, e2e-test profile must be enabled in the API
 * @param name Primary Entity Name
 * @param businessStructureId Primary structure
 * @param contactId Contact Id
 */
export function createByApiPrimaryEntity(
  name: string,
  businessStructureId: string,
  contactId: string
) {
  // default values
  const defaultValue = {
    countryId: 'CA',
    entityRole: 'Data Controller',
    notes: 'created by e2e-Cypress'
  };

  // verify JWT token exist
  const tokenAAA = localStorage.getItem('aaa-token');

  // tslint:disable-next-line: no-unused-expression
  expect(tokenAAA).not.null;

  const baseUrl = Cypress.config().baseUrl;
  const api = {
    method: 'POST',
    url: 'api/hub/primary-entities/e2e/new',
    alias: '@api'
  };

  cy.server();
  cy.request({
    method: api.method,
    url: `${baseUrl}/${api.url}`,
    auth: {
      bearer: tokenAAA
    },
    body: {
      version: -1,
      businessStructureId: `${businessStructureId}`,
      industrySectorIds: [],
      contactId: contactId,
      locations: [{ countryId: defaultValue.countryId }],
      companyAddressId: contactId,
      name: `${name}`,
      note: defaultValue.notes,
      entityRole: defaultValue.entityRole
    }
  })
    .its('body')
    .then(body => {
      // tslint:disable-next-line: no-unused-expression
      expect(body.id).not.null;
      // console.log('%c%o', 'color: #00a3cc', body);
      return body.id;
    });
}

export function deleteByApiPrimaryEntity(id: string) {
  // verify JWT token exist
  const tokenAAA = localStorage.getItem('aaa-token');
  // tslint:disable-next-line: no-unused-expression
  expect(tokenAAA).not.null;

  const baseUrl = Cypress.config().baseUrl;
  const api = {
    method: 'DELETE',
    url: 'api/hub/primary-entities/e2e',
    alias: '@api'
  };

  cy.server();
  cy.request({
    method: api.method,
    url: `${baseUrl}/${api.url}/${id}`,
    auth: {
      bearer: tokenAAA
    }
  })
    .its('body')
    .then(body => {
      expect(body.hasErrors).eq(undefined);
      // console.log('%c%o', 'color: #00a3cc', body);
    });
}
