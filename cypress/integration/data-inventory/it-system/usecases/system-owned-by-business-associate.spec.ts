import * as Utilities from '../../../../support/functions/utilities';
import * as LocationDropDown from '../../../../support/functions/shared/locations-dropdown';
import * as SubjectNameDropDown from '../../../../support/functions/data-inventory/it-system/data-subject-dropdown';
import * as CategoricalDropDown from '../../../../support/functions/shared/categorical-dropdown';
import { selectRegionCountries } from '../../../../support/functions/shared/ta-location-modal-content';
import { selectDropDown } from '../../../../support/functions/shared/ta-dropdown-field';
// Models
import { ITSystem } from '../../../../support/functions/data-inventory/it-system/forms-ui-models';
import { ITSystemDetailAPI } from '../../../../support/functions/data-inventory/it-system/forms-api-models';
import { CreateRheaItSystems } from '../../../../support/functions/data-inventory/it-system/forms-data-models';
import { CyAPI } from '../../../../support/functions/shared/models-api';
import { getDefaultUIFeatures } from '../../../../support/functions/shared';

context('RHEA>IT System>Details Form; fill fields', () => {
  const CONFIGURATION = Cypress.env('optional').dataInventory.ItSystems;
  const contextRecordPrefix = CONFIGURATION.recordPrefix;
  const useCaseIdentifier = Utilities.utilGenerateUUID();
  const entityIds: any[] = [];
  /**
   * USE CASE:
   *    Fill detail form
   * ASSOCIATED COMPONENTS:
   *    src/app/data-inventory/my-inventory/it-system/it-system-details/it-system-details.component.html
   * DESCRIPTION:
   *    Fill all the fields
   */

  // URL to redirect after login or valid Cookies
  const fixtureURL = 'data-inventory/my-inventory/it-system/new?action=Add';

  // record Id
  let contextRecordId = '';

  // JSON files for UI Definitions, API and Data in fixtures
  const jsonUIDef =
    '/data-inventory/it-system/definitions/form-details-def-ui.json';
  const jsonAPIDef =
    '/data-inventory/it-system/definitions/form-details-def-api.json';
  const jsonData =
    '/data-inventory/it-system/use-cases/system-owned-by-business-associate.json';

  let ui: ITSystem.ITSystemDetail;
  let api: ITSystemDetailAPI;
  let data: CreateRheaItSystems;

  //#region Delete Business Process

  function deleteItSystem(itSystemId: string) {
    // should from fixture
    const apiCRUD = {
      delete: {
        method: 'DELETE',
        url: 'api/hub/base-records/records',
        alias: '@delete'
      }
    };
    const baseUrl = Cypress.config().baseUrl;

    // --------------------

    // verify JWT token exist
    const tokenAAA = localStorage.getItem('aaa-token');
    // tslint:disable-next-line: no-unused-expression
    expect(tokenAAA).not.null;

    // Delete Business Process
    cy.server();
    cy.request({
      method: apiCRUD.delete.method,
      url: `${baseUrl}/${apiCRUD.delete.url}`,
      auth: {
        bearer: tokenAAA
      },
      body: {
        records: [
          {
            id: itSystemId,
            entityType: 'IT_SYSTEM'
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

  //#endregion

  // #region Load Fixtures

  function loadFixturesAndNavigate() {
    // Loading Definitions
    cy.fixture(jsonUIDef).as('def-ui');
    cy.get('@def-ui').then(definitions => {
      ui = (definitions as unknown) as ITSystem.ITSystemDetail;
    });

    // Loading Data
    cy.fixture(jsonData).as('data');
    cy.get('@data').then(dataF => {
      data = (dataF as unknown) as CreateRheaItSystems;
    });

    // Loading API
    cy.fixture(jsonAPIDef).as('def-api');
    cy.get('@def-api').then(apis => {
      api = (apis as unknown) as ITSystemDetailAPI;

      cy.getAAAToken().then(() => {
        console.log('aaa token received');
        cy.loginAsAdministrator(
          {
            redirect: fixtureURL
          },
          getDefaultUIFeatures
        );
      });
    });
  }

  // #endregion

  //#region Hooks

  before(() => {
    loadFixturesAndNavigate();
  });

  beforeEach(() => {
    cy.trustArcCookies();
    cy.restoreLocalStorageCache();
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  after(() => {
    if (CONFIGURATION.deleteAfterFixture === true && contextRecordId) {
      deleteItSystem(contextRecordId);
      cy.deleteByApiEntities(entityIds);
    }
  });

  //#endregion

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

  it('form - should display page titles', () => {
    cy.get('div .heading').contains('System');
    cy.get('div .sub-heading').contains('Details');
  });

  it('form fill - type System Name, Description, Notes', () => {
    cy.get(ui.systemName.selector).as(Utilities.delAt(ui.systemName.alias));
    cy.get(ui.description.selector).as(Utilities.delAt(ui.description.alias));
    cy.get(ui.notes.selector).as(Utilities.delAt(ui.notes.alias));

    cy.get(ui.systemName.alias).type('{selectall}{backspace}');
    cy.get(ui.systemName.alias).type(
      `${CONFIGURATION.recordPrefix}${data.data.name}`
    );

    cy.get(ui.description.alias).type(data.data.description);
    cy.get(ui.notes.alias).type(data.data.notes);
  });

  it('form fill - select System Owned by', function() {
    const systemOwner = data.data.ownerName;

    cy.get(ui.ownedBy.selector).as(Utilities.delAt(ui.ownedBy.alias));
    cy.get(ui.ownedBy.alias)
      .click()
      .within($element => {
        CategoricalDropDown.selectItemOfCategory(
          systemOwner.search === '%'
            ? CONFIGURATION.recordPrefix
            : systemOwner.search,
          systemOwner.category,
          0
        );
      });
  });

  it('form fill - select System Hosted Locations', function() {
    const hostingLocationsData = data.data.locations;

    cy.get(ui.hostingLocations.selector).as(
      Utilities.delAt(ui.hostingLocations.alias)
    );
    cy.get(ui.hostingLocations.alias).should('exist');
    cy.get(ui.hostingLocations.alias).within($hostingLocations => {
      hostingLocationsData.forEach((location, index) => {
        if (index === 0) {
          // default index showing on load of page
          LocationDropDown.selectLocation(0, location.country, location.states);
        } else {
          LocationDropDown.addAndSelectLocation(
            location.country,
            location.states
          );
        }
        // todo: edit regions
      });
    });
  });

  it('form fill - select Data-Subjects', () => {
    const dataSubjectsData = data.data.dataSubjects;

    cy.get(ui.dataSubjects.selector).as(Utilities.delAt(ui.dataSubjects.alias));
    cy.get(ui.dataSubjects.alias).should('exist');
    cy.get(ui.dataSubjects.alias).within($dataSubject => {
      dataSubjectsData.forEach(subject => {
        //  on default load: one Data Subject row is showing by default
        //  info : currently only supporting the selection of default subject selection
        const selectSubjectAtIndex = 0;

        SubjectNameDropDown.searchAndSelectSubjectName(
          selectSubjectAtIndex,
          subject.subjectName
        );

        // todo - add new data subject
        // todo - remove data subject at index
      });
    });

    // ui-def
    const modalSelector = 'ta-location-modal-content';
    const modalAlias = '@ta-location-modal-content';
    cy.modalVerification(modalSelector, true);

    cy.get(modalSelector).as(Utilities.delAt(modalAlias));
    cy.get(modalAlias)
      .find('ta-location')
      .within($modal => {
        dataSubjectsData.forEach((subject, index) => {
          subject.locations.forEach(location => {
            selectRegionCountries(location.region, location.countries);
          });
        });
      });
    cy.modalClickSubmit(modalSelector);
  });

  it('form fill - select volume of data subjects', function() {
    cy.get(ui.volumeOfDataSubjectRecords.selector).as(
      Utilities.delAt(ui.volumeOfDataSubjectRecords.alias)
    );
    cy.get(ui.volumeOfDataSubjectRecords.alias).should('exist');
    selectDropDown(
      ui.volumeOfDataSubjectRecords.alias,
      data.data.volumeOfDataSubjectRecords
    );
  });

  // // TODO
  // it('form fill - create contact', function() {
  //   // TODO: create contact information
  // });

  it('click Next; should call api and receive 200 response', () => {
    const cyApi = {
      postRequests: {
        method: 'POST',
        url: '/api/hub/it-systems/new',
        alias: '@postRequest'
      }
    };

    cy.server();
    cy.route(cyApi.postRequests.method, cyApi.postRequests.url).as(
      Utilities.delAt(cyApi.postRequests.alias)
    );

    const cyElement = {
      selector: '[data-cy="save"]',
      alias: '@save',
      text: 'save'
    };

    cy.get(cyElement.selector).as(Utilities.delAt(cyElement.alias));
    cy.get(cyElement.alias).should('be.visible');
    cy.get(cyElement.alias).click();

    cy.wait(cyApi.postRequests.alias).then(xhr => {
      // console.log(
      //   `Business Process ${contextRecordId} Background Updated %c \nResponse:%o`,
      //   'color:green',
      //   xhr
      // );
      expect(xhr.status, 'Valid Response').eq(200);
      contextRecordId = (xhr.response.body as any).id;
      expect(xhr.response.body, `Response Object has id `).to.have.property(
        'id'
      );
      console.log(
        `System Id :%c%o`,
        'color:green',
        (xhr.response.body as any).id
      );
    });
  });
});
