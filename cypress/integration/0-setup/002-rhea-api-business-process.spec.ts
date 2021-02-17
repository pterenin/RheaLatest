import * as Utilities from '../../support/functions/utilities';
// tslint:disable: no-unused-expression

context('RHEA Licenses> Enable/Disable Licenses', () => {
  //#region Context

  const prefix = Cypress.env('optional').createBusinessProcess.recordPrefix;
  const useCaseIdentifier = Utilities.utilGenerateUUID();
  // record Id - Business Process
  let contextRecordId = '';

  //#endregion

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

  //#region Create Business Process

  it('RHEA-API> should create business process', () => {
    const businessProcessName = `${prefix}-${useCaseIdentifier}`;
    cy.getAAARheaToken().then(() => {
      cy.createByApiBusinessProcess(businessProcessName).then(id => {
        expect(id).to.not.be.undefined;
        expect(id).not.null;
        contextRecordId = id;
      });
    });
  });

  it('RHEA-API> should delete business process', () => {
    cy.deleteByApiBusinessProcess(contextRecordId).then(id => {
      expect(id).to.not.be.undefined;
      expect(id).not.null;
    });
  });

  //#endregion
});
