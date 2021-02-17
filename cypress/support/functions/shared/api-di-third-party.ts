/**
 *
 * @param name company name
 * @param businessStructureId Company affiliate structure optional
 */
export function createByApiCompanyAffiliate(
  name: string,
  businessStructureId: string
) {
  // verify JWT token exist
  const tokenAAA = localStorage.getItem('aaa-token');
  // tslint:disable-next-line: no-unused-expression
  expect(tokenAAA).not.null;

  const baseUrl = Cypress.config().baseUrl;
  const api = {
    method: 'POST',
    url: 'api/hub/company-affiliates/new',
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
      locations: [{ countryId: 'CA' }],
      name: `${name}`,
      note: ''
    }
  })
    .its('body')
    .then(body => {
      // tslint:disable-next-line: no-unused-expression
      expect(body.id).not.null;
      console.log(
        `%cCompany Affiliate:${name}- ${'Company Affiliate'} id: %o`,
        'color: #00e600',
        body.id
      );
      // console.log('%c%o', 'color: #00a3cc', body);
      return body.id;
    });
}

export function createByApiThirdParty(name: string, partyType: string) {
  // verify JWT token exist
  const tokenAAA = localStorage.getItem('aaa-token');
  // tslint:disable-next-line: no-unused-expression
  expect(tokenAAA).not.null;

  const baseUrl = Cypress.config().baseUrl;
  const api = {
    method: 'POST',
    url: 'api/hub/third-parties/new',
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
      id: 'new',
      name: `${name}`,
      industrySectorIds: [],
      type: `${partyType}`,
      locations: [{ countryId: 'CA' }],
      version: 0
    }
  })
    .its('body')
    .then(body => {
      // tslint:disable-next-line: no-unused-expression
      expect(body.id).not.null;
      console.log(
        `%cThird Party:${name}- ${partyType} id: %o`,
        'color: #00e600',
        body.id
      );
      // console.log('%c%o', 'color: #00a3cc', body);
      return body.id;
    });
}

export function createByApiItSystem(name: string, legalEntityId: string) {
  // verify JWT token exist
  const tokenAAA = localStorage.getItem('aaa-token');
  // tslint:disable-next-line: no-unused-expression
  expect(tokenAAA).not.null;

  const baseUrl = Cypress.config().baseUrl;
  const api = {
    method: 'POST',
    url: 'api/hub/it-systems/new',
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
      contactId: ``,
      name: `${name}`,
      notes: ``,
      legalEntityId: `${legalEntityId}`,
      locations: [{ countryId: `CA` }],
      description: ``,
      dataSubjectTypes: []
    }
  })
    .its('body')
    .then(body => {
      // tslint:disable-next-line: no-unused-expression
      expect(body.id).not.null;
      console.log(
        `%cThird Party:${name}- ${legalEntityId} id: %o`,
        'color: #00e600',
        body.id
      );
      // console.log('%c%o', 'color: #00a3cc', body);
      return body.id;
    });
}

export function deleteByApiEntity(id: string, entityType: string) {
  // verify JWT token exist
  const tokenAAA = localStorage.getItem('aaa-token');
  // tslint:disable-next-line: no-unused-expression
  expect(tokenAAA).not.null;

  const baseUrl = Cypress.config().baseUrl;
  const api = {
    method: 'DELETE',
    url: 'api/hub/base-records/records',
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
      records: [
        {
          id: id,
          entityType: entityType
        }
      ]
    }
  })
    .its('body')
    .then(body => {
      expect(body.hasErrors).eq(false);
      // console.log(
      //   `Business Process ${contextRecordId} Deleted %c \nResponse:%o`,
      //   'color:green',
      //   body
      // );
    });
}

export function deleteByApiEntities(
  entities: { id: string; entityType: string }[]
) {
  const isEntities = entities && entities.length > 0 ? true : false;
  cy.onlyOn(isEntities, () => {
    // verify JWT token exist
    const tokenAAA = localStorage.getItem('aaa-token');
    // tslint:disable-next-line: no-unused-expression
    expect(tokenAAA).not.null;

    const baseUrl = Cypress.config().baseUrl;
    const api = {
      method: 'DELETE',
      url: 'api/hub/base-records/records',
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
        records: entities
      }
    })
      .its('body')
      .then(body => {
        expect(body.hasErrors).eq(false);
        return 'deleted all';
        // console.log(
        //   `Business Process ${contextRecordId} Deleted %c \nResponse:%o`,
        //   'color:green',
        //   body
        // );
      });
  });
}

/**
 *
 * @param countryIdentifier Country name as per json format 'Canada (CA)'
 * @param businessStructure structure name
 */
export function getByApiBusinessStructureId(
  countryIdentifier: string = 'United States (US)',
  businessStructure: string = 'Business Corporation'
) {
  // set default location to United States

  // verify JWT token exist
  const tokenAAA = localStorage.getItem('aaa-token');
  // tslint:disable-next-line: no-unused-expression
  expect(tokenAAA).not.null;

  const baseUrl = Cypress.config().baseUrl;
  const api = {
    method: 'GET',
    url: 'api/hub/business-structures',
    alias: '@api'
  };

  cy.server();
  cy.request({
    method: api.method,
    url: `${baseUrl}/${api.url}`,
    auth: {
      bearer: tokenAAA
    }
  })
    .its('body')
    .then(body => {
      expect(body).to.have.property(countryIdentifier);
      let businessStructureObject = body[countryIdentifier].filter(
        (item: any) => {
          return item.businessStructure === businessStructure;
        }
      );

      expect(businessStructureObject.length).to.have.equal(1);
      businessStructureObject = businessStructureObject[0];

      expect(businessStructureObject).to.have.property('businessStructure');
      expect(businessStructureObject.businessStructure).to.equal(
        businessStructure
      );

      expect(businessStructureObject).to.have.property('id');
      assert.isNotNull(businessStructureObject.id, ' must have id');

      // console.log('%c%o', 'color: #00a3cc', body);
      // console.log('%c%o', 'color: #00a3cc', businessStructureObject);
      // console.log('%c%o', 'color: #00a3cc', businessStructureObject.id);

      return businessStructureObject.id;
    });
}
