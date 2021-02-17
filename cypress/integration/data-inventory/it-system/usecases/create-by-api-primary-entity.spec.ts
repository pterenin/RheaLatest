import * as Utilities from '../../../../support/functions/utilities';
import { Contact } from '../../../../support/functions/shared';

context('RHEA>IT System> owned by Primary Entity', () => {
  const CONFIGURATION = Cypress.env('optional').dataInventory.ItSystems;
  const useCaseIdentifier = Utilities.utilGenerateUUID();
  const contextRecordPrefix = CONFIGURATION.recordPrefix;

  /**
   * USE CASE:
   *    Fill detail form
   * ASSOCIATED COMPONENTS:
   *    cypress/integration/data-inventory/it-system/usecases/create-by-api-primary-entity.spec.ts
   * DESCRIPTION:
   *    Create Primary Entity and associated dependencies and create system owned by Primary Entity.
   */

  //#region Hooks

  const entityIds: any[] = [];

  before(() => {
    cy.getAAAToken().then(() => {});
  });

  beforeEach(() => {
    cy.restoreLocalStorageCache();
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  after(() => {});

  //#endregion

  //#region Create Primary Entity and owned by Systems

  let businessStructureId: string;
  let contactId: string;
  let primaryEntityId: string;
  const partyType = 'PRIMARY_ENTITY';

  it('should get Business Structure', () => {
    cy.getByApiBusinessStructureId().then(structureId => {
      businessStructureId = structureId;
    });
  });

  it('should create Contact', () => {
    const defaultContact: Contact = {
      address: '111 Sutter Street, Suite 600',
      city: 'San Francisco',
      email: 'trustarc-info@trustarc.com',
      fullName: 'TrustArc Inc.',
      // id: 'string',
      location: {
        countryId: 'US',
        countryRegionId: null,
        globalRegionId: 'NORTH_AMERICA',
        stateOrProvinceId: 'US_CA'
      },
      phone: '+1 415 520 3490',
      version: 0,
      zip: '94104'
    };

    cy.createByApiContact(defaultContact).then(id => {
      contactId = id;
    });
  });

  xit('should create Primary Entity ', () => {
    cy.log(`businessStructureId: ${businessStructureId}`).skipOn(
      Utilities.isNullOrUndefinedOrEmpty(businessStructureId)
    );
    cy.log(`contactId: ${contactId}`).skipOn(
      Utilities.isNullOrUndefinedOrEmpty(contactId)
    );

    const recordName = `${contextRecordPrefix}${partyType} ${useCaseIdentifier}`;
    cy.createByApiPrimaryEntity(
      recordName,
      businessStructureId,
      contactId
    ).then(entityId => {
      primaryEntityId = entityId;
    });
  });

  xit('should create System Owned by Primary Entity ', () => {
    cy.log(`primaryEntityId: ${primaryEntityId}`).skipOn(
      Utilities.isNullOrUndefinedOrEmpty(primaryEntityId)
    );

    cy.createByApiItSystem(
      `${contextRecordPrefix}${partyType} ${useCaseIdentifier} System`,
      primaryEntityId
    ).then(systemId => {
      entityIds.push({ id: systemId, entityType: 'IT_SYSTEM' });
    });
  });

  xit('should delete System Owned by Primary Entity ', () => {
    const entityId = entityIds && entityIds.length > 0 ? entityIds[0] : null;
    cy.log(`deleting primaryEntityId: ${entityId}`).skipOn(
      Utilities.isNullOrUndefinedOrEmpty(entityId)
    );

    cy.deleteByApiEntities(entityIds).then(result => {});
  });

  xit('should delete Primary Entity ', () => {
    cy.log(`primaryEntityId: ${primaryEntityId}`).skipOn(
      Utilities.isNullOrUndefinedOrEmpty(primaryEntityId)
    );

    cy.deleteByApiPrimaryEntity(primaryEntityId).then(result => {});
  });

  it('should delete Contact Id ', () => {
    cy.log(`contactId: ${contactId}`).skipOn(
      Utilities.isNullOrUndefinedOrEmpty(contactId)
    );

    cy.deleteByApiContact(contactId).then(result => {});
  });

  //#endregion

  //#region Delete All Primary Entities of Use Case Identifier in the Account

  it(`should delete all Primary Entities having in name ${useCaseIdentifier}`, () => {
    // getByApiEntities; only filters by name only meantime.
    cy.getByApiEntities(useCaseIdentifier, partyType).then(result => {
      if (result) {
        const primaryEntities = result as { id: string; entityType: string }[];
        primaryEntities.forEach(pe => {
          // console.log('%c %s: %s', 'color: #cc0036', pe.id, pe.entityType);
          if (pe.entityType === partyType) {
            cy.deleteByApiPrimaryEntity(pe.id);
          }
        });
      }
    });
  });

  //#endregion
});
