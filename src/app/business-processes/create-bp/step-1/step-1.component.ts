import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { ToastService } from '@trustarc/ui-toolkit';
import { StepContainerService } from '../step-container/step-container.service';
import { Step1Service } from './step-1.service';
import { forkJoin, Observable, of, Subscription } from 'rxjs';
import { DataSubjectVolumeInterface } from './step-1.model';
import { AutoUnsubscribe } from '../../../shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { BusinessProcessInterface } from '../create-business-processes.model';
import {
  ActivatedRoute,
  Router,
  CanDeactivate,
  RouterStateSnapshot
} from '@angular/router';
import { catchError, flatMap, map } from 'rxjs/operators';
import { CreateBusinessProcessesService } from '../create-business-processes.service';
import { noWhitespaceValidator } from 'src/app/shared/utils/form-utils';
import {
  BaseDomainInterface,
  BaseDomainTypeEnum
} from 'src/app/shared/models/base-domain-model';
import {
  TagGroupAndValueInterface,
  TagGroupInterface
} from 'src/app/shared/models/tags.model';
import { getRouteParamObservable } from 'src/app/shared/utils/route-utils';
import { BaseRecordFileUploadService } from 'src/app/shared/components/base-record-file-upload/base-record-file-upload.service';
import { TagsSelectorComponent } from 'src/app/shared/components/tags-selector/tags-selector.component';
import { SETTINGS } from 'src/app/app.constants';
import { BUSINESS_PROCESS_NAVIGATION } from 'src/app/shared/_constant';
import { UtilsClass } from 'src/app/shared/_classes';
import { FeatureFlagControllerService } from '../../../shared/_services/rest-api';

declare const _: any;

@AutoUnsubscribe([
  '_bpPurposes$',
  '_getBusinessProcess$',
  '_isUpdatingSubscription$',
  '_paramMap$',
  '_updateBusinessProcess$',
  '_isDeletingFile$'
])
@Component({
  selector: 'ta-step-1',
  templateUrl: './step-1.component.html',
  styleUrls: ['./step-1.component.scss']
})
export class Step1Component
  implements OnInit, OnDestroy, CanDeactivate<Step1Component>, AfterViewInit {
  @Input() isInitialCreationMode: boolean;
  @Input() defaultBusinessProcessName: string;

  public readonly businessProcessNavigation = BUSINESS_PROCESS_NAVIGATION;

  private selectedTags: TagGroupInterface[] = [];
  public showRiskFields = SETTINGS.ShowRiskFields;
  public businessProcessId: string;
  public bpRecord = {};
  public baseDomainTypeEnum = BaseDomainTypeEnum;

  step1Form: FormGroup;
  fileForms: FormArray;
  tagFormsGroup: FormGroup;
  fileFormsGroup: FormGroup;

  bpName: FormControl;
  bpDescription: FormControl;
  bpNotes: FormControl;

  @ViewChild(TagsSelectorComponent) tagsSelector: TagsSelectorComponent;

  private _getBusinessProcess$: Subscription;
  private _updateBusinessProcess$: Subscription;
  private _autoSaveActive$: Subscription;
  private _paramMap$: Subscription;
  private _isDeletingFile$: Subscription;
  allBusinessProcessTags: TagGroupInterface[];
  tagsFiltered: TagGroupAndValueInterface[];
  dataSubjectVolumes: DataSubjectVolumeInterface[];
  isValid: Boolean = true;

  public triggerShowError = false;
  public isNextButtonDisabled = false;
  private _isUpdatingSubscription$: Subscription;

  public licenses: any = {};
  public isDeletingFile: boolean;

  private isDeactivated = false;

  public constructor(
    private featureFlagControllerService: FeatureFlagControllerService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private stepContainerService: StepContainerService,
    private step1Service: Step1Service,
    private toastService: ToastService,
    private createBusinessProcessesService: CreateBusinessProcessesService,
    private baseRecordFileUploadService: BaseRecordFileUploadService
  ) {
    this.initForm();
    this.isDeletingFile = false;
  }

  public ngOnInit() {
    this.featureFlagControllerService
      .getAllFeatureFlags()
      .subscribe(licenses => (this.licenses = licenses));
    this.baseRecordFileUploadService.setSaveOnEveryChange(true);
    this._paramMap$ = getRouteParamObservable(
      this.route.parent.paramMap,
      'id'
    ).subscribe(id => this.getBusinessProcess(id));
    if (this._isUpdatingSubscription$) {
      this._isUpdatingSubscription$.unsubscribe();
    }
    this._isUpdatingSubscription$ = this.createBusinessProcessesService.isUpdatingSubject.subscribe(
      value => {
        this.isNextButtonDisabled = value;
      }
    );

    UtilsClass.unSubscribe(this._isDeletingFile$);
    this._isDeletingFile$ = this.baseRecordFileUploadService.isDeletingFile
      .asObservable()
      .subscribe(isDeleting => {
        this.isDeletingFile = isDeleting;
      });
  }

  ngAfterViewInit() {
    // verifies licenses
    this.featureFlagControllerService
      .getAllFeatureFlags()
      .subscribe(allLicenses => {
        this.licenses = allLicenses;
        if (allLicenses.RHEA_NEW_UI_STEPS_12_LICENSE === true) {
          this.router.navigate([
            UtilsClass.getRelativeUrl(this.router.url, `../details`)
          ]);
        }
      });
  }

  public navigate(url: string) {
    if (url === 'cancel' || url === 'home') {
      this.router.navigateByUrl('/business-process');
    } else {
      const currentUrl = _.last(this.router.url.split('/'));
      this.router
        .navigate([this.router.url.replace(currentUrl, url)])
        .then(() => {
          this.createBusinessProcessesService.setSelectedStep(url);
        });
    }
  }

  public ngOnDestroy() {}

  public getData(dataName: string, functionName: string) {
    // The purpose of this function is to pull out repetetive pattern for network calls
    // it takes two parameters dataName and functioName
    // 'dataName' is a name of data needed.
    // 'functionName' is a name of step1Service function that gets the data
    // F.e. to get 'ranges' data dataName would be 'ranges' and functionName - 'getRanges'
    const subscription = this[`_${dataName}$`];
    // Each data needed has subscription. We need subscription to unsubscribe later
    // The subscription name has '_' prefix and '$' postfix
    // F.e. 'ranges' would have '_ranges$' subscription. That's why `_${dataName}$` is used
    if (subscription) {
      subscription.unsubscribe();
    }
    if (!this.step1Service[functionName]) {
      return;
      // stop this function if this.step1Service[functionName] does not exist
    }
    const observable = this.step1Service[functionName]();
    // this.step1Service[functionName]() calls get function
    // F.e. for 'ranges' it would be 'this.step1Service.getRanges()'
    // the method returns an observable
    if (observable) {
      this[`_${dataName}$`] = observable.subscribe(
        success => {
          this[dataName] = success;
        },
        error => {
          this.toastService.error(`Error retrieving ${dataName}!`); // [i18n-tobeinternationalized]
        }
      );
    }
  }

  public initForm() {
    this.bpName = new FormControl(
      'Loading...', // [i18n-tobeinternationalized]
      Validators.compose([
        Validators.required,
        noWhitespaceValidator,
        Validators.maxLength(255)
      ])
    );
    this.bpDescription = new FormControl('', Validators.maxLength(1024));
    this.bpNotes = new FormControl('', Validators.maxLength(1024));

    // NOTE: This form should maintain the same structure as the business process
    // however type-save FormBuilders have not yet been added to Angular.
    // See:
    //  * https://github.com/angular/angular/pull/20040
    //  * https://github.com/angular/angular/issues/13721
    this.tagFormsGroup = this.formBuilder.group({ placeholder: '' });
    this.fileFormsGroup = this.formBuilder.group({ placeholder: '' });
    this.step1Form = this.formBuilder.group({
      id: '',
      version: -1,
      name: this.bpName,
      dataSubjectVolume: '', // [i18n-tobeinternationalized]
      description: this.bpDescription,
      notes: this.bpNotes,
      fileFormsGroup: this.fileFormsGroup,
      tagFormsGroup: this.tagFormsGroup,
      tags: []
    });
    this.dataSubjectVolumes = [];
  }

  public getBusinessProcess(id: string) {
    this.initForm();

    this.businessProcessId = id;

    if (this._getBusinessProcess$) {
      this._getBusinessProcess$.unsubscribe();
    }
    this._getBusinessProcess$ = forkJoin([
      this.step1Service.getBusinessProcess(id),
      this.step1Service.getDataSubjectVolumes(),
      this.baseRecordFileUploadService.update(id)
    ]).subscribe(
      ([
        businessProcessBackground,
        dataSubjectVolumes,
        baseRecordFileUploadServiceSuccess
      ]) => {
        this.bpRecord = businessProcessBackground;
        let dataSubjectVolume = null;
        if (businessProcessBackground.dataSubjectVolume) {
          dataSubjectVolume = dataSubjectVolumes.find(
            item => item.id === businessProcessBackground.dataSubjectVolume.id
          );
        }
        this.step1Form.patchValue({
          dataSubjectVolume: dataSubjectVolume
        });
        if (this._autoSaveActive$) {
          this._autoSaveActive$.unsubscribe();
        }
        this._autoSaveActive$ = this.step1Form.valueChanges.subscribe(() => {
          const isAutosaveActiveFunction = this.isAutosaveActive.bind(this);
          const updateBusinessProcessFunction = this.updateBusinessProcess.bind(
            this,
            this.step1Form.value
          );
          const updateVersionFunction = this.updateVersion.bind(this);
          const handleSaveErrorFunction = this.handleSaveError.bind(this);

          this.createBusinessProcessesService.setAutosaveTarget(
            businessProcessBackground.version,
            businessProcessBackground.id,
            isAutosaveActiveFunction,
            this.step1Form.valueChanges,
            updateBusinessProcessFunction,
            updateVersionFunction,
            handleSaveErrorFunction
          );
        });

        this.clearDefaultName(businessProcessBackground);
        // TODO: TIMF-4423 TIMF-4434 TIMF-4478 TIMF-4650 Make this reusable in either utils or a component like tags-selector.component.

        this.step1Form.patchValue(businessProcessBackground, {
          emitEvent: false
        });
        this.dataSubjectVolumes = dataSubjectVolumes;
      },
      error =>
        this.createBusinessProcessesService.show404ErrorAndRedirect(error)
    );
  }

  private handleSaveError(error: any) {
    this.createBusinessProcessesService.showCannotSaveToast(error);
  }

  private isAutosaveActive(): boolean {
    if (!this.step1Form.valid) {
      return false;
    }
    if (this.areNonTagFieldsClean() && this.tagFormsGroup.dirty) {
      return false;
    }
    if (this.step1Form.pristine) {
      return false;
    }
    return !this.isDeactivated;
  }

  public areNonTagFieldsClean(): boolean {
    return (
      !this.step1Form.controls.name.dirty &&
      !this.step1Form.controls.notes.dirty &&
      !this.step1Form.controls.description.dirty &&
      !this.step1Form.controls.fileFormsGroup.dirty &&
      !this.step1Form.controls.dataSubjectVolume.dirty
    );
  }

  public updateVersion(baseDomain: BaseDomainInterface) {
    if (this.step1Form.get('id').value !== baseDomain.id) {
      // TODO: TIMF-4607 user may need to refresh their data if there is a version conflict.
      console.warn(
        `Expected record id ${this.step1Form.get('id').value} but got record ${
          baseDomain.id
        }`
      );
    } else {
      // Don't emit the event: this change should not make the form dirty.
      this.step1Form.patchValue(
        { version: baseDomain.version },
        { emitEvent: false }
      );
    }
  }

  public updateBusinessProcess(
    businessProcess: BusinessProcessInterface
  ): Observable<BaseDomainInterface> {
    if (this.step1Form.controls.dataSubjectVolume.value) {
      businessProcess.dataSubjectVolumeId = this.step1Form.controls.dataSubjectVolume.value.id;
    }

    // Chain all submission tasks: each one may depend on the prior version number.
    return this.step1Service
      .updateBusinessProcess(businessProcess)
      .pipe(
        flatMap(baseDomain => this.baseRecordFileUploadService.save(baseDomain))
      );
  }

  /**
   * If this businessProcess was just created, then clear out the default name that the server provided
   * so that it is clear to the user that they need to enter one.
   *
   * @param businessProcess the record to update
   */
  public clearDefaultName(businessProcess: BusinessProcessInterface): void {
    const id = businessProcess.id;
    const isJustCreated = this.createBusinessProcessesService.isNewlyCreated(
      id
    );
    const defaultName = this.createBusinessProcessesService.getDefaultName(id);

    if (isJustCreated && defaultName === businessProcess.name) {
      businessProcess.name = '';
    }
  }

  public selectedTagsChange(selectedTags: TagGroupInterface[]) {
    this.selectedTags = selectedTags;
    this.tagFormsGroup.markAsDirty();
  }

  public onSubmit() {
    if (this._updateBusinessProcess$) {
      this._updateBusinessProcess$.unsubscribe();
    }

    this.step1Form.markAsDirty();
    this.step1Form.updateValueAndValidity();

    this._updateBusinessProcess$ = this.createBusinessProcessesService
      .save()
      .pipe(
        flatMap(() => this.tagsSelector.save()),
        catchError(error => {
          this.createBusinessProcessesService.showCannotSaveToast(error);
          return of(false);
        })
      )
      .subscribe(() => {
        this.step1Form.markAsPristine();
        this.stepContainerService.emitChange(1);
      });
  }

  public canDeactivate(
    step1Component: Step1Component,
    _currentRoute,
    _currentState,
    nextState: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    this.isDeactivated = true;

    step1Component.step1Form.updateValueAndValidity({ emitEvent: false });

    // TODO: TIMF-4596 add a dialog to give the user a choice to exit unsaved if data is invalid.
    const isIgnoringFailures: boolean = nextState.url === '/business-process';

    if (
      step1Component.createBusinessProcessesService.isUpdatingSubject.getValue()
    ) {
      step1Component.toastService.info(
        `Saving.  You can change pages after saving completes.`
      ); // [i18n-tobeinternationalized]
      // trigger show form error
      step1Component.triggerShowError = true;
      return false;
    }

    // Closing a form that is invalid but unchanged is ok.
    if (
      isIgnoringFailures &&
      !step1Component.step1Form.valid &&
      !step1Component.step1Form.dirty
    ) {
      return true;
    }

    if (isIgnoringFailures && !step1Component.step1Form.valid) {
      step1Component.toastService.warn(
        `Updates were not saved because the form had invalid data.`
      ); // [i18n-tobeinternationalized]
      return true;
    }

    if (!step1Component.step1Form.valid) {
      step1Component.triggerShowError = true;
      return false;
    }

    if (!step1Component.step1Form.dirty) {
      return true;
    }

    return step1Component.createBusinessProcessesService
      .save(isIgnoringFailures)
      .pipe(
        flatMap(() => step1Component.tagsSelector.save()),
        catchError(error => {
          this.createBusinessProcessesService.showCannotSaveToast(error);
          return of(isIgnoringFailures);
        }),
        map(() => true)
      );
  }
}
