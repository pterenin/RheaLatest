import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpErrorResponse
} from '@angular/common/http';
import {
  BehaviorSubject,
  interval,
  Observable,
  of,
  Subject,
  Subscription,
  throwError,
  forkJoin,
  timer
} from 'rxjs';
import { catchError, map, flatMap, debounceTime, delay } from 'rxjs/operators';
import {
  BusinessProcessInterface,
  ItSystemInterface,
  ItSystemNameTypeInterface,
  ItSystemPropertiesInterface,
  CREATE_BP_NAV_DATA
} from './create-business-processes.model';
import { BaseCategoryInterface } from 'src/app/shared/components/categorical-view/category-model';
import { BaseDomainInterface } from 'src/app/shared/models/base-domain-model';
import { BusinessProcessService } from 'src/app/shared/services/business-process/business-process.service';
import { DataInterface } from 'src/app/shared/components/categorical-view/categorical-view.component';
import { categorize } from 'src/app/shared/components/categorical-view/base-category.model';
import {
  defaultTo,
  isIdParameterInvalid,
  exists
} from 'src/app/shared/utils/basic-utils';
import {
  SearchResponseInterface,
  SearchRequest
} from 'src/app/shared/models/search.model';
import { DataInventoryType } from 'src/app/data-inventory/my-inventory/my-inventory.component';
import { LocationInterface } from 'src/app/shared/models/location.model';
import { Router } from '@angular/router';
import { ToastService } from '@trustarc/ui-toolkit';

declare const _: any;

@Injectable({
  providedIn: 'root'
})
export class CreateBusinessProcessesService {
  constructor(
    private httpClient: HttpClient,
    private businessProcessService: BusinessProcessService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.isAutosaveActive = this.isAutosaveActiveFalse;
  }
  public static readonly AUTOREFRESH_INTERVAL_MS = 5000;
  public navData: any[] = [];
  private _disableCreateBusinessProcesses$ = new BehaviorSubject(false);
  public createBusinessProcessesDisabledObservable: Observable<
    boolean
  > = this._disableCreateBusinessProcesses$.asObservable();

  // TODO: TIMF-4601 generalize this feature to track any process status.
  public isUpdatingSubject = new BehaviorSubject<boolean>(false);
  private dataElements = new BehaviorSubject<any>(null);
  private valueChanges: Observable<any>;
  private isDataChanged = false;
  public selectedStep = 0;
  public selectedDataFlowView;
  public saveErrorSubject = new Subject<Error>();
  public versionConflictSubject = new Subject<Error>();
  public saveQueue: object[] = [];
  public isAutosaveActive: () => boolean;
  public currentBaseDomain: BaseDomainInterface;
  private _autoSaveTimerSubscription$: Subscription;
  private handleSaveError: (error: any) => any;
  private updateVersionInComponent: (baseDomain: BaseDomainInterface) => any;
  private componentSave: () => Observable<BaseDomainInterface>;
  private isAutosaveActiveFalse = () => false;

  /**
   * Returns the default business process name.  This is needed so that the UI can hide the
   * default name and show a blank for the very first time the business process is edited.
   *
   * @param id id of the business process.
   */
  public getDefaultName(id: string): string {
    return this.businessProcessService.getDefaultName(id);
  }

  /**
   *  sets the selected step which is used in the step navigation and the next button in footer.
   */
  public setSelectedStep(path: string): number {
    this.navData.forEach((navItem, i) => {
      if (navItem.url === path) {
        this.selectedStep = i;
      }
    });
    return this.selectedStep;
  }

  public setDataFlowView(view) {
    this.selectedDataFlowView = view;
  }

  public getDataFlowView() {
    return this.selectedDataFlowView;
  }

  public resetDataFlowView() {
    this.selectedDataFlowView = undefined;
  }

  /**
   * Returns true if this id is for a newly created business id.  This can be used to
   * change the behavior of the UI.  For example: to show "Create" vs "Edit" in the
   * title, or to hide the default business process name.
   *
   * @param id id of the business process.
   */
  public isNewlyCreated(id: string): boolean {
    return this.businessProcessService.isNewlyCreated(id);
  }

  public createBusinessProcess(): Observable<BusinessProcessInterface> {
    return this.businessProcessService.create();
  }

  public getItSystems(): Observable<
    BaseCategoryInterface<ItSystemInterface>[]
  > {
    return this.httpClient
      .get('/api/hub/it-systems/name-type-locations')
      .pipe(map(this.mapItSystems), catchError(this.handleError));
  }

  public searchAllItSystems(searchRequest: SearchRequest): Observable<any> {
    let url;
    let queryParams = new HttpParams();

    if (searchRequest.page) {
      queryParams = queryParams.append('page', searchRequest.page.toString());
    }

    if (searchRequest.size) {
      queryParams = queryParams.append('size', searchRequest.size.toString());
    }

    if (searchRequest.sort) {
      queryParams = queryParams.append('sort', searchRequest.sort.toString());
    }

    const searchTerm = searchRequest.searchTerm;
    if (searchTerm && searchTerm.trim().length > 0) {
      queryParams = queryParams.append('searchTerm', searchTerm.trim());
      url = '/api/hub/it-systems/name-type-locations/search';
    } else {
      url = '/api/hub/it-systems/name-type-locations';
    }

    return this.httpClient.get(url, { params: queryParams });
  }

  public searchItSystems(
    ownerType: DataInventoryType,
    searchRequest?: SearchRequest
  ): Observable<any> {
    const searchTerm = searchRequest.searchTerm;

    let queryParams = new HttpParams()
      .append('entityType', ownerType)
      .append('page', searchRequest.page.toString())
      .append('size', searchRequest.size.toString());

    let url;
    if (searchTerm && searchTerm.trim().length > 0) {
      queryParams = queryParams.append('searchTerm', searchTerm.trim());
      url = '/api/hub/it-systems/name-type-locations/entity-type-and-search';
    } else {
      url = '/api/hub/it-systems/name-type-locations/entity-type';
    }

    return this.httpClient.get(url, { params: queryParams });
  }

  public setNavData(hasRHEA_NEW_UI_STEPS_34_LICENSE: boolean) {
    this.navData = CREATE_BP_NAV_DATA(hasRHEA_NEW_UI_STEPS_34_LICENSE);
  }

  public getBusinessProcessItSystems(
    businessProcessId: string
  ): Observable<BaseCategoryInterface<ItSystemInterface>[]> {
    if (isIdParameterInvalid(businessProcessId)) {
      return throwError(`Invalid ID: ${businessProcessId}`);
    }

    return this.httpClient
      .get(
        `/api/hub/data-flows/it-systems/business-process-id/${businessProcessId}/all`
      )
      .pipe(map(this.mapItSystems), catchError(this.handleError));
  }

  public getItSystemProperties(
    id: string,
    locations: LocationInterface[]
  ): Observable<ItSystemPropertiesInterface> {
    if (isIdParameterInvalid(id)) {
      return throwError(`Invalid ID: ${id}`);
    }

    const url = `/api/hub/it-systems/${id}/it-systems`;
    return this.httpClient.get<ItSystemPropertiesInterface>(url).pipe(
      map(itSystemProperties => {
        // This map operation adds missing parent country references to the response:
        // Because IT Systems are state specific, and Business Process Data-flows
        // and maps are country specific, we need to add this missing data when a
        // country location is needed for a state-specific IT system.
        const locationsMissingSeparateCountryWithNoStates = locations
          .filter(location => {
            // The location must not have a state: We only want parent country items.
            const hasNoStateOrProvince = !location.stateOrProvince;

            // The IT System country must be listed and have a state
            const withStateOrProvince = itSystemProperties.locations.find(
              itSystemLocation => {
                const isInLocation = location.country
                  ? itSystemLocation.countryId === location.country.id
                  : false;
                const hasStateOrProvince = exists(
                  itSystemLocation.stateOrProvinceId
                );

                return isInLocation && hasStateOrProvince;
              }
            );

            // The IT System country must not already be listed without a state:
            // We don't want to add parent countries that are already there.
            const withoutStateOrProvince = itSystemProperties.locations.find(
              itSystemLocation => {
                const isInLocation = location.country
                  ? itSystemLocation.countryId === location.country.id
                  : false;
                const hasStateOrProvinceId = exists(
                  itSystemLocation.stateOrProvinceId
                );

                return isInLocation && !hasStateOrProvinceId;
              }
            );

            return (
              hasNoStateOrProvince &&
              exists(withStateOrProvince) &&
              !exists(withoutStateOrProvince)
            );
          })
          .map(location => ({
            countryId: location.country ? location.country.id : null,
            globalRegionId: location.globalRegion
              ? location.globalRegion.id
              : null,
            id: location.id,
            stateOrProvinceId: location.stateOrProvince
              ? location.stateOrProvince.id
              : null,
            version: location.version
          }));

        itSystemProperties.locations.push(
          ...locationsMissingSeparateCountryWithNoStates
        );

        return itSystemProperties;
      }),
      catchError(this.handleError)
    );
  }

  public getDataElementsRaw(): Observable<any> {
    return this.dataElements.asObservable();
  }

  public emitDataElementsRawUpdated(dataElements: DataInterface[]) {
    this.dataElements.next(dataElements);
  }

  public initCachedDataElements() {
    // check if locations is not in the cache, get it from the BE call and cache it
    this.getDataElementsRaw().subscribe(cachedDataElements => {
      if (!cachedDataElements) {
        this.getDataElements().subscribe(dataElements =>
          this.emitDataElementsRawUpdated(dataElements)
        );
      }
    });
  }

  public getDataElements(): Observable<DataInterface[]> {
    return this.httpClient
      .get(`/api/hub/data-elements?size=10000`)
      .pipe(map(this.mapDataElements), catchError(this.handleError));
  }

  public getProcessingPurposes(): Observable<DataInterface[]> {
    return this.httpClient
      .get(`/api/hub/processing-purposes?size=10000`)
      .pipe(map(this.mapProcessingPurposes), catchError(this.handleError));
  }

  private mapDataElements(response: any): DataInterface[] {
    const dataElements: DataInterface[] = [];
    let dataElementsInterface: any[] = [];

    dataElementsInterface = response.content;

    dataElementsInterface.map(dataElement => {
      if (dataElement.type === null) {
        dataElement.type = 'UNCATEGORIZED';
      }

      const category = dataElements.find(
        de => de.label === dataElement.category
      );

      if (category) {
        category.items.push({
          id: dataElement.id,
          label: dataElement.dataElement,
          selected: false,
          subItem: dataElement.type
        });
      } else {
        dataElements.push({
          id: dataElement.type + '_' + _.uniqueId(),
          label: dataElement.category,
          items: [
            {
              id: dataElement.id,
              label: dataElement.dataElement,
              selected: false,
              subItem: dataElement.type,
              isCustom: dataElement.isCustom
            }
          ]
        });
      }
    });
    return dataElements;
  }

  private mapProcessingPurposes(response: any): DataInterface[] {
    let processingPurposeInterface: any[] = [];
    processingPurposeInterface = response.content;
    const processingPurposes: DataInterface[] = [];
    processingPurposeInterface.map(processingPurpose => {
      if (processingPurpose.category === null) {
        processingPurpose.category = 'UNCATEGORIZED';
      }
      const category = processingPurposes.find(
        de => de.label === processingPurpose.category
      );
      if (category) {
        category.items.push({
          id: processingPurpose.id,
          label: processingPurpose.processingPurpose,
          selected: false,
          subItem: processingPurpose.type,
          isCustom: processingPurpose.isCustom
        });
      } else {
        processingPurposes.push({
          id: processingPurpose.type + '_' + _.uniqueId(),
          label: processingPurpose.category,
          items: [
            {
              id: processingPurpose.id,
              label: processingPurpose.processingPurpose,
              selected: false,
              subItem: processingPurpose.type,
              isCustom: processingPurpose.isCustom
            }
          ],
          isCustom: processingPurpose.isCategoryCustom
        });
      }
    });
    return processingPurposes;
  }

  private mapItSystems(
    itSystemResponse: SearchResponseInterface<ItSystemNameTypeInterface>
  ): BaseCategoryInterface<ItSystemInterface>[] {
    const itSystems = itSystemResponse.content.map(itSystem => ({
      ...itSystem,
      label: itSystem.name,
      tag: itSystem.type,
      category: defaultTo('UNCATEGORIZED', itSystem.type)
    }));

    return categorize(itSystems, 'label', false);
  }

  private handleError(error: Response | any) {
    return throwError(error);
  }

  private updateVersion(baseDomain: BaseDomainInterface) {
    this.currentBaseDomain = baseDomain;
    if (this.updateVersionInComponent) {
      this.updateVersionInComponent(baseDomain);
    }
  }

  /**
   * Links the autosave feature to a single page.
   * @param version The initial version of the entitiy to autosave.
   * @param id The id of the entitiy to autosave.
   * @param isAutosaveActive A callback indicating if the autosave should be active.
   * @param valueChanges An observable in the component that should emit when the entity changes.
   * @param componentSave Callback that delegates the work of saving the entity to the component.
   * @param updateVersionInComponent Callback that delegates updating component entity's version.
   * @param handleSaveError Callback that delegates error handling.
   */
  public setAutosaveTarget(
    version: number,
    id: string,
    isAutosaveActive: () => boolean,
    valueChanges: Observable<any>,
    componentSave: () => Observable<BaseDomainInterface>,
    updateVersionInComponent: (baseDomain: BaseDomainInterface) => any,
    handleSaveError: (error: any) => any
  ) {
    if (this.isUpdatingSubject.getValue()) {
      const isUpdatingSubject$ = this.isUpdatingSubject.subscribe(
        isUpdating => {
          if (!isUpdating) {
            this.setAutosaveTargetWithoutWaitingForSaveToComplete(
              version,
              id,
              isAutosaveActive,
              valueChanges,
              componentSave,
              updateVersionInComponent,
              handleSaveError
            );
            if (isUpdatingSubject$) {
              isUpdatingSubject$.unsubscribe();
            }
          } else {
            // Do nothing while we wait for the update to complete.
          }
        }
      );
    } else {
      this.setAutosaveTargetWithoutWaitingForSaveToComplete(
        version,
        id,
        isAutosaveActive,
        valueChanges,
        componentSave,
        updateVersionInComponent,
        handleSaveError
      );
    }
  }

  private setAutosaveTargetWithoutWaitingForSaveToComplete(
    version: number,
    id: string,
    isAutosaveActive: () => boolean,
    valueChanges: Observable<any>,
    componentSave: () => Observable<BaseDomainInterface>,
    updateVersionInComponent: (baseDomain: BaseDomainInterface) => any,
    handleSaveError: (error: any) => any
  ) {
    this.currentBaseDomain = { id, version };
    this.saveQueue = [];
    this.isAutosaveActive = isAutosaveActive;
    this.valueChanges = valueChanges;
    this.valueChanges.subscribe(formData => {
      this.dataChanged();
    });
    this.componentSave = componentSave;
    this.updateVersionInComponent = updateVersionInComponent;
    this.handleSaveError = handleSaveError;
    this.startAutosave();
  }

  public startAutosave() {
    this.stopAutosave();
    this._autoSaveTimerSubscription$ = interval(
      CreateBusinessProcessesService.AUTOREFRESH_INTERVAL_MS
    ).subscribe(() => this.autoSave());
  }

  public stopAutosave() {
    if (this._autoSaveTimerSubscription$) {
      this._autoSaveTimerSubscription$.unsubscribe();
    }
  }

  public dataChanged() {
    this.isDataChanged = true;
  }

  public getIsDataChanged(): boolean {
    return this.isDataChanged;
  }

  public autoSave() {
    if (this.isAutosaveActive()) {
      this.save();
    }
  }

  public save(isIgoringFailures: boolean = false): Observable<boolean> {
    if (this.isUpdatingSubject.getValue()) {
      // If the data has not changed, then it is as if the save was successful.
      return of(!this.isDataChanged);
    }

    if (!this.isDataChanged) {
      // If the data has not change since last save, return success immediatly.
      return of(true);
    }

    this.isUpdatingSubject.next(true);
    this.isDataChanged = false;

    // NOTE: Subscribe locally beecause the caller, like a route guard, can
    // cancel its own subscription, and cancelling this call will mean we lose track of the
    // current version. Instead, we'll pass back a Subject that can act as
    // a proxy: unsubscribing does not close a Subject.
    const saveSubjectCancellable = new Subject<boolean>();

    const saveSubscription$ = this.componentSave()
      .pipe(
        map(successResponse => {
          const baseDomain = successResponse;
          this.updateVersion(baseDomain);
          // NOTE: The component may respond synchroniously, so saveSubscription$ may not have been defined yet.
          if (saveSubscription$) {
            saveSubscription$.unsubscribe();
          }
          this.isUpdatingSubject.next(false);
          saveSubjectCancellable.next(true);
          return true;
        }),
        catchError(error => {
          this.isUpdatingSubject.next(false);
          this.handleSaveError(error);

          // NOTE: The component may respond synchroniously, so saveSubscription$ may not have been defined yet.
          if (saveSubscription$) {
            saveSubscription$.unsubscribe();
          }
          const isSuccess: boolean = isIgoringFailures;
          saveSubjectCancellable.next(isSuccess);
          return of(isSuccess);
        })
      )
      .subscribe();

    return saveSubjectCancellable;
  }

  public show404ErrorAndRedirect(error: HttpErrorResponse) {
    this.router.navigate([`business-process`]);
    let errorMessage: string;
    switch (error.status) {
      case 403:
      case 404:
        errorMessage = 'The business process you requested could not be found.'; // [i18n-tobeinternationalized]
        break;
      default:
        errorMessage = 'There was an error loading the business process'; // [i18n-tobeinternationalized]
        break;
    }
    this.asyncToastError(errorMessage, error);
  }

  public showCannotSaveToast(error: HttpErrorResponse) {
    let errorMessage: string;
    switch (error.status) {
      case 403:
      case 404:
        // [i18n-tobeinternationalized]
        errorMessage =
          'Cannot save: The business process you requested could not be found.';
        break;
      case 409:
        // [i18n-tobeinternationalized]
        errorMessage =
          'A conflict appeared when attempting to update a record.' +
          ' Only one user can edit a record at a time.' +
          ' Please refresh and try again.';
        break;
      default:
        const { error: err = {} } = error;
        if (err.exceptionCode === 'ObjectOptimisticLockingFailureException') {
          // [i18n-tobeinternationalized]
          errorMessage =
            'A conflict appeared when attempting to update a record.' +
            ' Only one user can edit a record at a time.' +
            ' Please refresh and try again.';
        } else {
          errorMessage = 'There was an error saving this business process'; // [i18n-tobeinternationalized]
        }
        break;
    }
    this.asyncToastError(errorMessage, error);
  }

  private asyncToastError(message: string, error: HttpErrorResponse) {
    console.error('Unexpected Error:', message, error);
    setTimeout(() => this.toastService.error(message), 700);
  }
}
