import * as Utilities from '../../../../support/functions/utilities';

context('RHEA>IT System>Details Form; fill fields', () => {
  const CONFIGURATION = Cypress.env('optional').dataInventory.ItSystems;
  const useCaseIdentifier = Utilities.utilGenerateUUID();
  const contextRecordPrefix = CONFIGURATION.recordPrefix;

  /**
   * USE CASE:
   *    Fill detail form
   * ASSOCIATED COMPONENTS:
   *    src/app/data-inventory/my-inventory/it-system/it-system-details/it-system-details.component.html
   * DESCRIPTION:
   *    Fill all the fields
   */

  //#region Delete Business Process

  //#endregion

  // #endregion

  //#region Hooks

  const entityIds: any[] = [];

  before(() => {
    cy.getAAAToken().then(() => {
      console.log('aaa token received');
    });
  });

  beforeEach(() => {
    cy.restoreLocalStorageCache();
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  after(() => {
    if (CONFIGURATION.deleteAfterFixture === true) {
      cy.deleteByApiEntities(entityIds);
    }
  });

  //#endregion

  //#region Create Third Parties & Company Affiliate

  it('should create entity and system PARTNER', () => {
    const partyType = 'PARTNER';
    const recordName = `${contextRecordPrefix}${partyType} ${useCaseIdentifier}`;
    cy.createByApiThirdParty(recordName, partyType).then(entityId => {
      entityIds.push({ id: entityId, entityType: partyType });
      cy.createByApiItSystem(
        `${contextRecordPrefix}${partyType} ${useCaseIdentifier} System`,
        entityId
      ).then(systemId => {
        entityIds.push({ id: systemId, entityType: 'IT_SYSTEM' });
      });
    });
  });

  it('should create entity and system Vendor', () => {
    const partyType = 'VENDOR';
    const recordName = `${contextRecordPrefix}${partyType} ${useCaseIdentifier}`;
    cy.createByApiThirdParty(recordName, partyType).then(entityId => {
      entityIds.push({ id: entityId, entityType: partyType });
      cy.createByApiItSystem(
        `${contextRecordPrefix}${partyType} ${useCaseIdentifier} System`,
        entityId
      ).then(systemId => {
        entityIds.push({ id: systemId, entityType: 'IT_SYSTEM' });
      });
    });
  });

  it('should create entity and system Customer', () => {
    const partyType = 'CUSTOMER';
    const recordName = `${contextRecordPrefix}${partyType} ${useCaseIdentifier}`;
    cy.createByApiThirdParty(recordName, partyType).then(entityId => {
      entityIds.push({ id: entityId, entityType: partyType });
      cy.createByApiItSystem(
        `${contextRecordPrefix}${partyType} ${useCaseIdentifier} System`,
        entityId
      ).then(systemId => {
        entityIds.push({ id: systemId, entityType: 'IT_SYSTEM' });
      });
    });
  });

  it('should create entity and system Service Provider', () => {
    const partyType = 'SERVICE_PROVIDER';
    const recordName = `${contextRecordPrefix}${partyType} ${useCaseIdentifier}`;
    cy.createByApiThirdParty(recordName, partyType).then(entityId => {
      entityIds.push({ id: entityId, entityType: partyType });
      cy.createByApiItSystem(
        `${contextRecordPrefix}${partyType} ${useCaseIdentifier} System`,
        entityId
      ).then(systemId => {
        entityIds.push({ id: systemId, entityType: 'IT_SYSTEM' });
      });
    });
  });

  it('should create entity and system Business Associate', () => {
    const partyType = 'BUSINESS_ASSOCIATE';
    const recordName = `${contextRecordPrefix}${partyType} ${useCaseIdentifier}`;
    cy.createByApiThirdParty(recordName, partyType).then(entityId => {
      entityIds.push({ id: entityId, entityType: partyType });
      cy.createByApiItSystem(
        `${contextRecordPrefix}${partyType} ${useCaseIdentifier} System`,
        entityId
      ).then(systemId => {
        entityIds.push({ id: systemId, entityType: 'IT_SYSTEM' });
      });
    });
  });

  it('should create entity and system COMPANY AFFILIATE', () => {
    const partyType = 'COMPANY_AFFILIATE';
    const recordName = `${contextRecordPrefix}${partyType} ${useCaseIdentifier}`;
    cy.getByApiBusinessStructureId().then(structureId => {
      if (structureId) {
        cy.createByApiCompanyAffiliate(recordName, structureId).then(
          entityId => {
            entityIds.push({ id: entityId, entityType: partyType });
            cy.createByApiItSystem(
              `${contextRecordPrefix}${partyType} ${useCaseIdentifier} System`,
              entityId
            ).then(systemId => {
              entityIds.push({ id: systemId, entityType: 'IT_SYSTEM' });
            });
          }
        );
      }
    });
  });

  //#endregion
});
