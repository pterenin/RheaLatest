import * as taTableSearch from './functions/table-search';
import * as modal from './functions/modal-verification';
import {
  ApplicationFeatures,
  ApiAccessToken,
  Contact
} from './functions/shared/models-api';

import * as auth from './functions/authentication/login-cookie';
import * as apiApplicationConfiguration from './functions/shared/api-app-features';

import * as DI from './functions/data-inventory/data-inventory';

import * as apiDIEntities from './functions/shared/api-di-entities-list';

import * as apiBusinessProcess from './functions/shared/api-business-process';
import * as apiDIPrimaryEntity from './functions/shared/api-di-primary-entity';
import * as apiDIThirdParty from './functions/shared/api-di-third-party';
import * as apiDIContact from './functions/shared/api-contact';

import * as LocationDropDown from './functions/shared/locations-dropdown';
import '@cypress/skip-test';

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      // localStorageCache
      saveLocalStorageCache(): void;
      restoreLocalStorageCache(): void;

      // login & Cookies
      loginAsAdministrator(options: any, features: any): Chainable<Window>;
      loginAsUser(options: any): Chainable<Window>;
      trustArcCookies(): void;

      /**
       * depreciated instead use getAAARheaToken()
       */
      getAAAToken(): Chainable<Window>;

      /**
       * gets and updates token
       * fetch token in local-storage key : 'aaa-rhea-token' or Cypress.env('oauth.rhea.token')
       */
      getAAARheaToken(): Chainable<ApiAccessToken>;
      /**
       * gets and updates token
       * fetch token in local-storage key : 'aaa-plutus-token' or Cypress.env('oauth.plutus.token')
       */
      getAAAPlutusToken(): Chainable<Window>;

      // Application wide - API
      /**
       * get Rhea Application Licenses from RHEA feature-flag API
       */
      getByApiApplicationFeaturesStatus(): Chainable<ApplicationFeatures>;
      /**
       * Enable or Disable any feature for Rhea Account through Plutus API,
       * this require plutus API token before executing this.
       * @param accountId Account Id
       * @param featureName Feature Name
       * @param enableOrDisable boolean (true to enable, false to disable)
       */
      updateByApiFeatureStatus(
        accountId: string,
        featureName: string,
        enableOrDisable: boolean
      ): Chainable<any>;

      // Business Process - API
      createByApiBusinessProcess(name: string): Chainable<string>;
      updateByApiBusinessProcess(id: string, name: string): Chainable<string>;
      deleteByApiBusinessProcess(id: string): Chainable<string>;

      // data inventory - API
      createByApiThirdParty(name: string, type: string): Chainable<string>;
      createByApiCompanyAffiliate(
        name: string,
        businessStructureId: string
      ): Chainable<string>;

      createByApiPrimaryEntity(
        name: string,
        businessStructureId?: string,
        contactId?: string
      ): Chainable<string>;

      getByApiEntities(
        searchCriteria: string,
        entityType: string
      ): Chainable<any>;

      deleteByApiPrimaryEntity(id: string): Chainable<string>;

      createByApiContact(contact: Contact): Chainable<string>;
      deleteByApiContact(contactId: string): Chainable<string>;

      createByApiItSystem(name: string, type: string): Chainable<string>;
      deleteByApiEntities(
        entities: { id: string; entityType: string }[]
      ): Chainable<string>;

      getByApiBusinessStructureId(
        countryIdentifier?: string,
        businessStructure?: string
      ): Chainable<string>;

      // data inventory
      cloneEntityByName(name: string): Chainable<string>;
      deleteEntityByName(name: string): void;
      createCompanyAffiliate(name: string): void;
      createThirdParty(name: string): void;

      // ta-table grid
      isRecordExistByName(elementSelector: string, name: string): void;
      selectRecordByName(
        elementSelector: string,
        name: string,
        prefixRowCyId: string
      ): void;

      // modal  verification
      modalVerification(modalSelector: string, isSubmitEnabled: boolean): void;
      modalCloseByIconButton(modalSelector: string): void;
      modalCloseByCancelButton(modalSelector: string): void;
      modalClickSubmit(modalSelector: string): void;
      modalTypeText(
        modalSelector: string,
        textInputSelector: string,
        typeText: string
      ): void;
      modalDeleteVerification(modalSelector: string): void;
      selectAllConfigurableColumns(): void;
    }
  }
}

//#region Local Storage

// tslint:disable-next-line: prefer-const
let LOCAL_STORAGE_MEMORY: any = {};

Cypress.Commands.add('saveLocalStorageCache', () => {
  Object.keys(localStorage).forEach(key => {
    LOCAL_STORAGE_MEMORY[key] = localStorage[key];
  });
});

Cypress.Commands.add('restoreLocalStorageCache', () => {
  Object.keys(LOCAL_STORAGE_MEMORY).forEach(key => {
    localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key]);
  });
});

//#endregion

//#region "login & TrustArc cookies"

Cypress.Commands.add('getAAAToken', auth.getAAAToken);
Cypress.Commands.add('getAAARheaToken', auth.getAAARheaToken);
Cypress.Commands.add('getAAAPlutusToken', auth.getAAAPlutusToken);
Cypress.Commands.add('loginAsAdministrator', auth.loginAsAdministrator);
Cypress.Commands.add('loginAsUser', auth.loginAsUser);
Cypress.Commands.add('trustArcCookies', auth.trustArcCookies);

//#endregion

//#region Application wide  - API

// Features Enable Status(Configuration)
Cypress.Commands.add(
  'getByApiApplicationFeaturesStatus',
  apiApplicationConfiguration.getByApiApplicationFeaturesStatus
);
Cypress.Commands.add(
  'updateByApiFeatureStatus',
  apiApplicationConfiguration.updateByApiFeatureStatus
);

//#endregion

//#region Business Process - API
Cypress.Commands.add(
  'createByApiBusinessProcess',
  apiBusinessProcess.createByApiBusinessProcess
);
Cypress.Commands.add(
  'updateByApiBusinessProcess',
  apiBusinessProcess.updateByApiBusinessProcessName
);
Cypress.Commands.add(
  'deleteByApiBusinessProcess',
  apiBusinessProcess.deleteByApiBusinessProcess
);
//#endregion

//#region Data Inventory - API
Cypress.Commands.add(
  'createByApiPrimaryEntity',
  apiDIPrimaryEntity.createByApiPrimaryEntity
);
Cypress.Commands.add(
  'deleteByApiPrimaryEntity',
  apiDIPrimaryEntity.deleteByApiPrimaryEntity
);

Cypress.Commands.add('createByApiContact', apiDIContact.createByApiContact);

Cypress.Commands.add('deleteByApiContact', apiDIContact.deleteByApiContact);

Cypress.Commands.add('getByApiEntities', apiDIEntities.getByApiEntities);

// Cypress.Commands.add('deleteByApiEntities', apiDIPrimayEntity.);

Cypress.Commands.add(
  'createByApiThirdParty',
  apiDIThirdParty.createByApiThirdParty
);
Cypress.Commands.add(
  'createByApiCompanyAffiliate',
  apiDIThirdParty.createByApiCompanyAffiliate
);
Cypress.Commands.add(
  'createByApiItSystem',
  apiDIThirdParty.createByApiItSystem
);
Cypress.Commands.add(
  'deleteByApiEntities',
  apiDIThirdParty.deleteByApiEntities
);

// GET
Cypress.Commands.add(
  'getByApiBusinessStructureId',
  apiDIThirdParty.getByApiBusinessStructureId
);

//#endregion

//#region Data Inventory

Cypress.Commands.add('deleteEntityByName', DI.deleteEntityByName);
Cypress.Commands.add('cloneEntityByName', DI.cloneEntityByName);
Cypress.Commands.add('createCompanyAffiliate', DI.createCompanyAffiliate);
Cypress.Commands.add('createThirdParty', DI.createThirdParty);

//#endregion

//#region Search/Select row in Ta-Table

/**
 * verifies if the record of content exist in ta-table
 */
Cypress.Commands.add('isRecordExistByName', (elementSelector, name) => {
  return taTableSearch.isRecordExistByName(elementSelector, name);
});

/**
 * selects checkbox of row header where name(content) exist in ta-table
 */
Cypress.Commands.add(
  'selectRecordByName',
  (elementSelector, name, prefixRowCyId) => {
    return taTableSearch.selectRecordByName(
      elementSelector,
      name,
      prefixRowCyId
    );
  }
);

//#endregion

//#region Modal

/**
 * verifies Modal for Add have title tag and buttons with default state; close, Cancel, Submit: (disabled,visible)
 */
Cypress.Commands.add('modalVerification', (modalSelector, isSubmitEnabled) => {
  return modal.modalVerification(modalSelector, isSubmitEnabled);
});

/**
 * verifies Modal should be closed by right top cancel icon button click
 */
Cypress.Commands.add('modalCloseByIconButton', modalSelector => {
  return modal.modalCloseByIconButton(modalSelector);
});

/**
 * verifies Modal should be closed be closed by cancel button click
 */
Cypress.Commands.add('modalCloseByCancelButton', modalSelector => {
  return modal.modalCloseByCancelButton(modalSelector);
});

/**
 * verifies Modal submit(save/edit) button is enabled and click
 */
Cypress.Commands.add('modalClickSubmit', modalSelector => {
  return modal.modalClickSubmit(modalSelector);
});

/**
 * type text in modal input
 */
Cypress.Commands.add(
  'modalTypeText',
  (modalSelector, textInputSelector, typeText) => {
    return modal.modalTypeText(modalSelector, textInputSelector, typeText);
  }
);

/**
 * verifies Modal for Delete have title tag and buttons with default state; close:enabled, Cancel:enabled, Submit: enabled
 */
Cypress.Commands.add('modalDeleteVerification', modalSelector => {
  return modal.modalDeleteVerification(modalSelector);
});

//#endregion

/**
 Selects all configurbale columns in the table
 */
Cypress.Commands.add(
  'selectAllConfigurableColumns',
  (configDropDownSelector?, configFormAttr?) => {
    cy.get('#inventory-icon-column-config').click();
    cy.get('[data-cy="columns-config-form"]').within(() => {
      cy.get('input').each(ele => {
        cy.wrap(ele).check({ force: true });
      });
    });
  }
);

// Convert this to a module instead of script (allows import/export)

export {};
