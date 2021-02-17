/**
 * returns list of all Entities in DI as `{id:string, entityType:string}[]`
 * @param searchCriteria search text in name
 * @param entityType entity type: TBI
 */
export function getByApiEntities(
  searchCriteria: string,
  entityType: string = ''
) {
  const requestBody = {
    page: 0,
    size: 25,
    search: `${searchCriteria}`,
    sortField: 'lastModified',
    sortDirection: 'DESC',
    // meantime: filters and values have no impact on the search
    filters: {
      operand: 'AND',
      filters: [
        {
          fieldName: 'recordType',
          values: ['CompanyEntity', 'ThirdParty', 'ItSystem']
        }
      ]
    }
  };

  // verify JWT token exist
  const tokenAAA = localStorage.getItem('aaa-token');
  // tslint:disable-next-line: no-unused-expression
  expect(tokenAAA).not.null;

  const baseUrl = Cypress.config().baseUrl;
  const api = {
    method: 'POST',
    url: 'api/hub/search/base-records/filters',
    alias: '@api'
  };

  cy.server();
  cy.request({
    method: api.method,
    url: `${baseUrl}/${api.url}`,
    auth: {
      bearer: tokenAAA
    },
    body: requestBody
  })
    .its('body')
    .then(body => {
      assert.isNotNull(body.content, ' must have property');
      // console.log('%c%o', 'color: #00a3cc', body);
      const records = body.content as { id: string; entityType: string }[];
      return records;
    });
}
