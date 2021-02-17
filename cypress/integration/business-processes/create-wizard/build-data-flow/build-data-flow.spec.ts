import * as Utilities from '../../../../support/functions/utilities';
import * as CategoricalDropDown from '../../../../support/functions/shared/categorical-dropdown';
import * as LocationDropDown from '../../../../support/functions/shared/locations-dropdown';
import * as SubjectNameDropDown from '../../../../support/functions/data-inventory/it-system/data-subject-dropdown';
import { selectRegionCountries } from '../../../../support/functions/shared/ta-location-modal-content';
import { selectDropDown } from '../../../../support/functions/shared/ta-dropdown-field';
// Models
import { BuildDataFlowAPI } from '../../../../support/functions/business-process/create-wizard/build-data-flow/build-data-flow-api-models';
import { Page } from '../../../../support/functions/shared/models-ui';
// ItSystems Models
import { ITSystem } from '../../../../support/functions/data-inventory/it-system/forms-ui-models';
import { ITSystemDetailAPI } from '../../../../support/functions/data-inventory/it-system/forms-api-models';
import { CreateRheaItSystems } from '../../../../support/functions/data-inventory/it-system/forms-data-models';

// -------------------  Business Process Models
import * as BPUi from '../../../../support/functions/business-process/create-wizard/namespace-business-process-ui';
import * as BPData from '../../../../support/functions/business-process/create-wizard/namespace-business-process-data';
import { getNewUIFeatures } from '../../../../support/functions/shared';
import { ApplicationFeatures } from '../../../../support/functions/shared/models-api';

context('RHEA>BP>Build data flow; validate systems graph and map', () => {
  const CONFIGURATION = Cypress.env('optional').createBusinessProcess;
  const useCaseIdentifier = Utilities.utilGenerateUUID();
  const contextRecordPrefix = CONFIGURATION.recordPrefix;
  const entityIds: any[] = [];
  const cyConfigWaitDuration = Cypress.env('waitDuration');
  /**
   * USE CASE:
   *    build data flow
   * ASSOCIATED COMPONENTS:
   *    src/app/business-processes/business-process-wizard/build-data-flow/build-data-flow.component.ts
   * DESCRIPTION:
   *    validate systems graph and map
   */

  //#region Context
  // feature flags
  let applicationConfigurationFeatureStatus: ApplicationFeatures;

  // URL to redirect after login or valid Cookies
  let contextURL = '';

  // record Id - Business Process
  let contextRecordId = '';

  // related to component
  let ui: BPUi.BuildDataFlow;
  let data: BPData.Details;

  // related to module
  let api: BuildDataFlowAPI.API;

  // common page elements to verify and trigger
  let uiPage: Page;

  const baseUrl = Cypress.config().baseUrl;
  //#endregion

  //#region Load Fixtures

  // JSON files for UI Definitions, API and Data in fixtures
  const jsonAPIBuildDataFlow =
    '/business-processes/create-wizard/build-data-flow/definitions/build-data-flow-def-api.json';
  const jsonUIDef =
    '/business-processes/create-wizard/build-data-flow/definitions/build-data-flow-def-ui.json';
  const jsonData =
    '/business-processes/create-wizard/details/form-details-data.json';

  // JSON files for UI Definitions, API and Data in fixtures
  const jsonUIDefItSystem =
    '/data-inventory/it-system/definitions/form-details-def-ui.json';
  const jsonAPIDefItSystem =
    '/data-inventory/it-system/definitions/form-details-def-api.json';
  const jsonDataItSystem =
    '/data-inventory/it-system/use-cases/system-owned-by-vendor.json';

  let uiItSystem: ITSystem.ITSystemDetail;
  let apiItSystem: ITSystemDetailAPI;
  let dataItSystem: CreateRheaItSystems;

  function loadFixtures() {
    // Loading Definitions it_system
    cy.fixture(jsonUIDefItSystem).as('def-ui');
    cy.get('@def-ui').then(definitions => {
      uiItSystem = (definitions as unknown) as ITSystem.ITSystemDetail;
    });

    // Loading Data it_system
    cy.fixture(jsonDataItSystem).as('data');
    cy.get('@data').then(dataF => {
      dataItSystem = (dataF as unknown) as CreateRheaItSystems;
    });

    // Loading API it_system
    cy.fixture(jsonAPIDefItSystem).as('def-api');
    cy.get('@def-api').then(apis => {
      apiItSystem = (apis as unknown) as ITSystemDetailAPI;
    });

    // Loading Common Elements for Page
    const jsonPageUI = 'page-def-ui.json';
    cy.fixture(jsonPageUI).as('page-def-ui');
    cy.get('@page-def-ui').then(definitions => {
      uiPage = (definitions as unknown) as Page;
    });

    // Loading Definitions
    cy.fixture(jsonUIDef).as('def-ui');
    cy.get('@def-ui').then(definitions => {
      ui = (definitions as unknown) as BPUi.BuildDataFlow;
    });

    // Loading API
    cy.fixture(jsonAPIBuildDataFlow).as('def-api');
    cy.get('@def-api').then(apis => {
      api = (apis as unknown) as BuildDataFlowAPI.API;
      // create business process and navigate to first form
      createBusinessProcess();
    });
  }

  function loadApplicationConfiguration() {
    if (!applicationConfigurationFeatureStatus) {
      // Application Configuration  - Features and Licenses Status
      cy.getByApiApplicationFeaturesStatus().then(status => {
        if (status) {
          applicationConfigurationFeatureStatus = status;
        }
      });
    }
  }

  //#endregion

  //#region Enable/Disable License, Login and Redirect to URL

  function createBusinessProcess() {
    cy.getAAARheaToken().then(() => {
      cy.createByApiBusinessProcess('UNTITLED').then(id => {
        console.info(id);
        expect(id).to.not.be.undefined;
        expect(id).not.null;
        contextRecordId = id;
        //  set context URL
        contextURL = `business-process/${contextRecordId}/systems-selection`;
        loginAndRedirect('admin', contextURL);
      });
    });
  }

  function loginAndRedirect(loginAs: 'admin' | 'user', redirectUrl: string) {
    // login based on user role
    if (loginAs === 'user') {
      cy.loginAsUser({
        redirect: redirectUrl
      });
    } else {
      cy.loginAsAdministrator(
        {
          redirect: redirectUrl
        },
        getNewUIFeatures
      );
    }
  }

  //#endregion

  //#region Hooks

  before(() => {
    loadFixtures();
  });

  beforeEach(() => {
    cy.trustArcCookies();
    cy.restoreLocalStorageCache();
    loadApplicationConfiguration();
  });
  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  after(() => {
    if (CONFIGURATION.deleteAfterFixture === true) {
      if (contextRecordId) {
        cy.deleteByApiBusinessProcess(contextRecordId);
      }
      cy.deleteByApiEntities(entityIds);
    }
  });

  //#endregion

  //#region setup

  it('should create entity and system Vendor', () => {
    const partyType = 'VENDOR';
    const recordName = `${contextRecordPrefix}${partyType} ${useCaseIdentifier}`;
    cy.createByApiThirdParty(recordName, partyType).then(entityId => {
      entityIds.push({ id: entityId, entityType: partyType });
    });
  });

  it('should add new system under BP', () => {
    const cyElement = ui.addSystemButton;
    cy.get(cyElement.selector).as(Utilities.delAt(cyElement.alias));
    cy.get(cyElement.alias)
      .should('be.visible')
      .click();
  });

  it('form - should display page titles', () => {
    cy.get('h3.ta-new-system-record').contains('Add New System Record');
  });

  it('form fill - type System Name, Description, Notes', () => {
    cy.get(uiItSystem.systemName.selector).as(
      Utilities.delAt(ui.systemName.alias)
    );
    cy.get(uiItSystem.description.selector).as(
      Utilities.delAt(uiItSystem.description.alias)
    );
    cy.get(uiItSystem.notes.selector).as(
      Utilities.delAt(uiItSystem.notes.alias)
    );

    cy.get(ui.systemName.alias).type('{selectall}{backspace}');
    cy.get(ui.systemName.alias).type(
      `${CONFIGURATION.recordPrefix}${dataItSystem.data.name}`
    );

    cy.get(uiItSystem.description.alias).type(dataItSystem.data.description);
    cy.get(uiItSystem.notes.alias).type(dataItSystem.data.notes);
  });

  it('form fill - select System Owned by', function() {
    const systemOwner = dataItSystem.data.ownerName;

    cy.get(uiItSystem.ownedBy.selector).as(
      Utilities.delAt(uiItSystem.ownedBy.alias)
    );
    cy.get(uiItSystem.ownedBy.alias)
      .click()
      .within($element => {
        CategoricalDropDown.selectItemOfCategory(
          systemOwner.search === '%' ? contextRecordPrefix : systemOwner.search,
          systemOwner.category,
          0
        );
      });
  });

  it('form fill - select System Hosted Locations', function() {
    const hostingLocationsData = dataItSystem.data.locations;

    cy.get(uiItSystem.hostingLocations.selector).as(
      Utilities.delAt(uiItSystem.hostingLocations.alias)
    );
    cy.get(uiItSystem.hostingLocations.alias).should('exist');
    cy.get(uiItSystem.hostingLocations.alias).within($hostingLocations => {
      hostingLocationsData.forEach((location, index) => {
        if (index === 0) {
          LocationDropDown.selectLocation(0, location.country, location.states);
        } else {
          LocationDropDown.addAndSelectLocation(
            location.country,
            location.states
          );
        }
      });
    });
  });

  it('form fill - select Data-Subjects', () => {
    const dataSubjectsData = dataItSystem.data.dataSubjects;

    cy.get(uiItSystem.dataSubjects.selector).as(
      Utilities.delAt(uiItSystem.dataSubjects.alias)
    );
    cy.get(uiItSystem.dataSubjects.alias).should('exist');
    cy.get(uiItSystem.dataSubjects.alias).within($dataSubject => {
      dataSubjectsData.forEach(subject => {
        const selectSubjectAtIndex = 0;
        SubjectNameDropDown.searchAndSelectSubjectName(
          selectSubjectAtIndex,
          subject.subjectName
        );
      });
    });

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
    cy.get(uiItSystem.volumeOfDataSubjectRecords.selector).as(
      Utilities.delAt(uiItSystem.volumeOfDataSubjectRecords.alias)
    );
    cy.get(uiItSystem.volumeOfDataSubjectRecords.alias).should('exist');
    selectDropDown(
      uiItSystem.volumeOfDataSubjectRecords.alias,
      dataItSystem.data.volumeOfDataSubjectRecords
    );
  });

  it('should save the system ', () => {
    const cyElement = ui.saveSystemButton;

    cy.get(cyElement.selector).as(Utilities.delAt(cyElement.alias));
    cy.get(cyElement.alias)
      .should('be.visible')
      .click();
    cy.wait(1000);
    cy.get('.ta-modal-confirmation-basic').then(() => {
      cy.get('.ta-modal-confirmation-basic .btn-primary')
        .should('be.visible')
        .click();
    });
    cy.wait(1000);
  });

  it('should select data elements', () => {
    cy.get('#tabDataElementsAdded')
      .should('be.visible')
      .click();
    cy.wait(1000);
    const dataElementsTable = ui.dataElementsTable;
    cy.get(dataElementsTable.selector).as(
      Utilities.delAt(dataElementsTable.alias)
    );
    cy.get(dataElementsTable.alias)
      .find('.ta-checkbox-lb')
      .first()
      .click();
  });

  it('should click next, save changes and navigate to Build Data Flow page', () => {
    cy.get(uiPage.next.selector).as(Utilities.delAt(uiPage.next.alias));
    cy.get(uiPage.next.alias)
      .should('be.enabled')
      .click();

    cy.get('.ta-modal-confirmation').then(() => {
      cy.get('.ta-modal-confirmation .btn-primary')
        .should('be.visible')
        .click();
    });
    cy.wait(1000);
  });

  ////#endregion

  //#region Build Data Flow
  it('should select first system and validate selection on right side', () => {
    cy.get('#sidebar-accordion-container')
      .find('ta-system-record-item-component')
      .first()
      .click();

    cy.wait(1000);
    cy.get('#sidebar-accordion-container')
      .find('ta-system-record-item-component')
      .first()
      .find('[data-cy="system-name"]')
      .then(element => {
        const cyElement = ui.tableSystemName;
        cy.get(cyElement.selector).as(Utilities.delAt(cyElement.alias));
        cy.get(cyElement.alias).then(systemNameOnTable => {
          expect(element.text()).to.equal(systemNameOnTable.text());
        });
      });
  });

  it('should select data subjects and systems from send data to system table', () => {
    const cyElement = ui.dataSubjectSendingTable;
    cy.get(cyElement.selector).as(Utilities.delAt(cyElement.alias));
    cy.get(cyElement.alias).should('be.visible');

    const systemTable = ui.SystemSendingTable;
    cy.get(systemTable.selector).as(Utilities.delAt(systemTable.alias));
    cy.get(systemTable.alias).should('be.visible');

    const cySelectAllCheckbox = ui.selectAllDataTransfer;
    cy.get(cySelectAllCheckbox.selector).as(
      Utilities.delAt(cySelectAllCheckbox.alias)
    );
    cy.get(cySelectAllCheckbox.alias)
      .first()
      .should('be.visible')
      .click();

    cy.get(cySelectAllCheckbox.alias)
      .last()
      .should('be.visible')
      .click();
  });

  it('Should validate cancel', () => {
    const cyElement = ui.cancelDataTransferTable;
    cy.get(cyElement.selector).as(Utilities.delAt(cyElement.alias));
    cy.get(cyElement.alias)
      .should('be.visible')
      .click();
    cy.wait(1000);
    cy.get('.badge-default')
      .first()
      .then(badge => {
        expect(badge.text()).to.equal('0');
      });
  });

  it('should select data subjects and systems from send data to system table', () => {
    const cyElement = ui.dataSubjectSendingTable;
    cy.get(cyElement.selector).as(Utilities.delAt(cyElement.alias));
    cy.get(cyElement.alias).should('be.visible');

    const systemTable = ui.SystemSendingTable;
    cy.get(systemTable.selector).as(Utilities.delAt(systemTable.alias));
    cy.get(systemTable.alias).should('be.visible');

    const cySelectAllCheckbox = ui.selectAllDataTransfer;
    cy.get(cySelectAllCheckbox.selector).as(
      Utilities.delAt(cySelectAllCheckbox.alias)
    );
    cy.get(cySelectAllCheckbox.alias)
      .first()
      .should('be.visible')
      .click();

    cy.get(cySelectAllCheckbox.alias)
      .last()
      .should('be.visible')
      .click();
  });

  it('should save data transfers', () => {
    const cyElement = ui.saveDataTransferTable;
    cy.get(cyElement.selector).as(Utilities.delAt(cyElement.alias));
    cy.get(cyElement.alias)
      .should('be.visible')
      .click();
    cy.wait(cyConfigWaitDuration);
    cy.get('.badge-default')
      .first()
      .then(badge => {
        expect(badge.text()).to.not.equal('0');
      });
  });

  it('should validate graph', () => {
    cy.get('[data-cy="view-data-flow-options"] ul li')
      .first()
      .click();
    cy.wait(cyConfigWaitDuration);
    cy.get('.joint-viewport').then(jointViewPort => {
      expect(
        jointViewPort.find('[data-type="standard.TextBlock"]').length
      ).to.be.greaterThan(2);
    });
  });

  it('should validate map', () => {
    cy.get('[data-cy="view-data-flow-options"] ul li')
      .last()
      .click();
    cy.wait(cyConfigWaitDuration);
    cy.get('.highcharts-container ').then(mapContainer => {
      expect(
        mapContainer.find('.highcharts-series-group g').length
      ).to.be.greaterThan(0);
    });
  });

  it('should validate collapse', () => {
    const cyElement = ui.collapseExpandButton;
    cy.get(cyElement.selector).as(Utilities.delAt(cyElement.alias));
    cy.get(cyElement.alias)
      .should('be.visible')
      .click();
    const cySideMenu = ui.leftSideMenuDataFlow;
    cy.get(cySideMenu.selector).as(Utilities.delAt(cySideMenu.alias));
    cy.get(cySideMenu.alias)
      .should('have.class', 'is-not-standard-view')
      .and('not.have.class', '    is-standard-view');
  });

  it('should validate expand', () => {
    const cyElement = ui.collapseExpandButton;
    cy.get(cyElement.selector).as(Utilities.delAt(cyElement.alias));
    cy.get(cyElement.alias)
      .should('be.visible')
      .click();
    const cySideMenu = ui.leftSideMenuDataFlow;
    cy.get(cySideMenu.selector).as(Utilities.delAt(cySideMenu.alias));
    cy.get(cySideMenu.alias)
      .should('have.class', 'is-standard-view')
      .and('not.have.class', 'is-not-standard-view');
  });
  //#endregion
});
