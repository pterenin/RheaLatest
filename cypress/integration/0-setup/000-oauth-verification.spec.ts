import { ApiAccessToken } from '../../support/functions/shared';

// tslint:disable: no-unused-expression

context('OAuth> credentials verification', () => {
  //#region Hooks

  before(() => {});

  beforeEach(() => {
    cy.restoreLocalStorageCache();
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  after(() => {});

  //#endregion

  //#region AAA API tokens

  it('RHEA-token> should get a Rhea token from API ', () => {
    cy.getAAARheaToken().then(() => {
      const token = Cypress.env('oauth.rhea.token') as ApiAccessToken;
      expect(token).to.not.be.undefined;
    });
  });

  it('RHEA-token> should be valid token in browser local storage ', () => {
    const tokenString = localStorage.getItem('aaa-rhea-token');
    expect(tokenString).to.not.be.undefined;
    expect(tokenString).not.null;

    const tokenAAA = JSON.parse(tokenString as string) as ApiAccessToken;
    expect(tokenAAA).to.not.be.undefined;

    expect(tokenAAA).not.null;
    expect(tokenAAA.accountId).not.null;
    expect(tokenAAA.access_token).not.null;
    expect(tokenAAA.userId).not.null;
    expect(tokenAAA.email).not.null;
    expect(tokenAAA.firstName).not.null;
  });

  it('RHEA-token> from environment ', () => {
    const token = Cypress.env('oauth.rhea.token');
    expect(token).not.null;
  });

  it('PLUTUS-token> should get a Plutus token from API ', () => {
    cy.getAAAPlutusToken().then(() => {
      const token = Cypress.env('oauth.plutus.token') as ApiAccessToken;
      expect(token).to.not.be.undefined;
    });
  });

  it('PLUTUS-token> should be valid token in browser local storage ', () => {
    const tokenString = localStorage.getItem('aaa-plutus-token');
    expect(tokenString).not.null;
    const tokenAAA = JSON.parse(tokenString as string) as ApiAccessToken;
    expect(tokenAAA).to.not.be.undefined;

    expect(tokenAAA).not.null;
    expect(tokenAAA.accountId).not.null;
    expect(tokenAAA.access_token).not.null;
    expect(tokenAAA.userId).not.null;
    expect(tokenAAA.email).not.null;
    expect(tokenAAA.firstName).not.null;
  });

  it('PLUTUS-token> from environment ', () => {
    const token = Cypress.env('oauth.plutus.token');
    expect(token).not.null;
  });

  //#endregion
});
