import { ApiAccessToken } from '.';

// tslint:disable: no-unused-expression

/**
 * creates Business Process from API
 * @param name Business Process Name
 */
export function createByApiBusinessProcess(name: string = 'E2E-CYPRESS-BP') {
  // verify JWT token exist
  const tokenAAA = Cypress.env('oauth.rhea.token') as ApiAccessToken;
  expect(tokenAAA).not.null;

  const baseUrl = Cypress.config().baseUrl;
  const api = {
    method: 'POST',
    url: 'api/hub/business-processes',
    alias: '@api'
  };

  cy.server();
  cy.request({
    method: api.method,
    url: `${baseUrl}/${api.url}`,
    auth: {
      bearer: tokenAAA.access_token
    }
  })
    .its('body')
    .then(body => {
      expect(body.id).to.be.not.undefined;
      expect(body.id).not.null;
      updateByApiBusinessProcessName(body.id, name);
    });
}
export function updateByApiBusinessProcessName(id: string, name: string) {
  // verify JWT token exist
  const tokenAAA = Cypress.env('oauth.rhea.token') as ApiAccessToken;
  expect(tokenAAA).not.null;

  const baseUrl = Cypress.config().baseUrl;
  const api = {
    method: 'PUT',
    url: `api/hub/business-processes/${id}/details`,
    alias: '@api'
  };

  cy.server();
  cy.request({
    method: api.method,
    url: `${baseUrl}/${api.url}`,
    auth: {
      bearer: tokenAAA.access_token
    },
    body: {
      id: `${id}`,
      version: 1,
      name: name,
      description: `id: ${id} BP Name: ${name}`,
      dataSubjectVolumeId: null
    }
  })
    .its('body')
    .then(body => {
      expect(body.id).to.be.not.undefined;
      expect(body.id).not.null;
      // console.log('%c BP ID:%s DETAIL ID:%s', 'color: #408059', id, body.id);

      return id;
    });
}

export function deleteByApiBusinessProcess(businessProcessId: string) {
  // verify JWT token exist
  const tokenAAA = Cypress.env('oauth.rhea.token') as ApiAccessToken;
  expect(tokenAAA).not.null;

  const baseUrl = Cypress.config().baseUrl;
  const api = {
    method: 'DELETE',
    url: 'api/hub/base-records/records',
    alias: '@api-delete'
  };

  cy.server();
  cy.request({
    method: api.method,
    url: `${baseUrl}/${api.url}`,
    auth: {
      bearer: tokenAAA.access_token
    },
    body: {
      records: [
        {
          id: businessProcessId,
          entityType: 'BUSINESS_PROCESS'
        }
      ]
    }
  })
    .its('body')
    .then(body => {
      // console.log('%c BP ID: %s', 'color: #735656', businessProcessId);
      // console.log('%cDELETE BI Response %o', 'color: #735656', body);
      expect(body.hasErrors).eq(false);
    });
}
