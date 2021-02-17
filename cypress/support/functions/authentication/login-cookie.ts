import { utilGetDateTimeString } from '../utilities';
import { ApiAccessToken } from '../shared';

const cyConfigWaitDuration = Cypress.env('waitDuration');
const clearSessionStorage = (win: any) => win.sessionStorage.clear();

export function loginAsAdministrator(options: any, features: any = null) {
  if (features) {
    login(options, 'administrator', features);
  } else {
    login(options, 'administrator');
  }
}

export function loginAsUser(options: any, features: any = null) {
  if (features) {
    login(options, 'user', features);
  } else {
    login(options, 'user');
  }
}

export function login(
  options: any,
  userRole?: 'administrator' | 'user',
  features?: any
) {
  const envAccount: any = Cypress.env('account');
  const account =
    userRole && userRole === 'user' ? envAccount.user : envAccount.admin;

  const cyConfigEmail = account.username;
  const cyConfigPassword = account.password;
  const cyConfigDefaultPath = Cypress.env('defaultPath');

  const email = options.email || cyConfigEmail;
  const pass = cyConfigPassword;
  const path = options.redirect || cyConfigDefaultPath;
  const baseUrl = Cypress.config().baseUrl;
  const url = baseUrl + '/' + path;

  cy.server();

  if (options.apiDependency) {
    cy.route('GET', options.apiDependency).as('apiDependency');
  }
  if (features) {
    cy.route('GET', '**/feature-flag/all', features);
  }
  cy.visit(`${envAccount.loginUrl}${encodeURIComponent(url)}`);

  if (window.location.origin === baseUrl) {
    if (features) {
      cy.route('GET', '**/feature-flag/all', features);
    }
    cy.visit(url, { onBeforeLoad: clearSessionStorage });

    if (options.apiDependency) {
      cy.wait('@apiDependency');
    }
  } else {
    cy.on('uncaught:exception', (err, runnable) => {
      expect(err.message).to.include('something about the error');
      return false;
    });

    cy.get('input[id="form1InputEmail"]').type(email);
    cy.get('img[class="card-img-top"]').click();
    cy.get('a[data-slide="next"]')
      // .should('be.enabled')
      .click();
    cy.get('input[id="form2InputPassword"]')
      // .should('be.enabled')
      .type(pass);
    cy.get('button[type=submit]').click();
  }
}

export function trustArcCookies() {
  Cypress.Cookies.defaults({
    preserve: ['session_state', 'SESSION']
  });
}

export function getAAAToken() {
  localStorage.removeItem('aaa-token');
  const oauth = Cypress.env('oauth').rhea;
  const url =
    `${oauth.url}` +
    `client_id=${encodeURIComponent(oauth.params.client_id)}` +
    `&client_secret=${encodeURIComponent(oauth.params.client_secret)}` +
    `&grant_type=${encodeURIComponent(oauth.params.grant_type)}` +
    `&scopes=${encodeURIComponent(oauth.params.scopes)}` +
    `&username=${encodeURIComponent(oauth.params.username)}` +
    `&password=${encodeURIComponent(oauth.params.password)}`;
  const aliasJwtToken = '@jwt-token';
  cy.server();
  cy.request('POST', url)
    .its('body')
    .then(body => {
      window.localStorage.setItem('aaa-token', body.access_token);
      window.localStorage.setItem(
        'aaa-token-updated-at',
        utilGetDateTimeString()
      );
      cy.saveLocalStorageCache();
      console.log(`%c token:`, 'color:orange;');
      console.log(body.access_token);
    });
}

/**
 * This fetches the Rhea Token using oauth.rhea credentials in cypress.env.json
 * you can access the rhea-token through browser local storage `aaa-rhea-token` or `aaa-token`(depreciated)
 * or you can get using cypress environment variable Cypress.env('oauth.rhea.token')
 */
export function getAAARheaToken() {
  localStorage.removeItem('aaa-token');
  const oauth = Cypress.env('oauth').rhea;
  const url =
    `${oauth.url}` +
    `client_id=${encodeURIComponent(oauth.params.client_id)}` +
    `&client_secret=${encodeURIComponent(oauth.params.client_secret)}` +
    `&grant_type=${encodeURIComponent(oauth.params.grant_type)}` +
    `&scopes=${encodeURIComponent(oauth.params.scopes)}` +
    `&username=${encodeURIComponent(oauth.params.username)}` +
    `&password=${encodeURIComponent(oauth.params.password)}`;
  // const aliasJwtToken = '@jwt-token';
  cy.server();
  cy.request('POST', url)
    .its('body')
    .then(body => {
      const tokenAAA = body as ApiAccessToken;
      window.localStorage.setItem('aaa-rhea-token', JSON.stringify(tokenAAA));
      cy.saveLocalStorageCache();

      Cypress.env('oauth.rhea.token', tokenAAA);

      // this local-storage item added temporarily in order to keep test working
      // until all getAAAToken implementation across tests replaced with getAAARheaToken
      window.localStorage.setItem('aaa-token', body.access_token);

      // return body as ApiAccessToken;
    });
}

/**
 * This fetches the Plutus Token using oauth.plutus credentials in cypress.env.json
 * you can access the rhea-token through browser local storage `aaa-plutus-token`
 * or you can get using cypress environment variable Cypress.env('oauth.plutus.token')
 */
export function getAAAPlutusToken() {
  localStorage.removeItem('aaa-plutus-token');
  const oauth = Cypress.env('oauth').plutus;
  const url =
    `${oauth.url}` +
    `client_id=${encodeURIComponent(oauth.params.client_id)}` +
    `&client_secret=${encodeURIComponent(oauth.params.client_secret)}` +
    `&grant_type=${encodeURIComponent(oauth.params.grant_type)}` +
    `&scopes=${encodeURIComponent(oauth.params.scopes)}` +
    `&username=${encodeURIComponent(oauth.params.username)}` +
    `&password=${encodeURIComponent(oauth.params.password)}`;
  const aliasJwtToken = '@jwt-token';
  cy.server();
  cy.request('POST', url)
    .its('body')
    .then(body => {
      const tokenAAA = body as ApiAccessToken;
      window.localStorage.setItem('aaa-plutus-token', JSON.stringify(tokenAAA));
      cy.saveLocalStorageCache();

      Cypress.env('oauth.plutus.token', tokenAAA);

      // return body as ApiAccessToken;
    });
}
