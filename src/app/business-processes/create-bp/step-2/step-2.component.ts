import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { StepContainerService } from '../step-container/step-container.service';
import { Subscription, of, Observable, forkJoin } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import {
  ActivatedRoute,
  CanDeactivate,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Step2Service } from './step-2.service';
import { ToastService, TaModal } from '@trustarc/ui-toolkit';
import { CreateBusinessProcessesService } from '../create-business-processes.service';
import { EntityContentInterface } from './step-2.model';
import { AutoUnsubscribe } from 'src/app/shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { BaseDomainInterface } from 'src/app/shared/models/base-domain-model';
import { getRouteParamObservable } from 'src/app/shared/utils/route-utils';
import { UtilsClass } from 'src/app/shared/_classes';
import { FeatureFlagControllerService } from '../../../shared/_services/rest-api';

@AutoUnsubscribe([
  '_getOwnerData$',
  '_isUpdatingSubscription$',
  '_paramMap$',
  '_saveOwnerData$',
  '_getDropDownData$'
])
@Component({
  selector: 'ta-step-2',
  templateUrl: './step-2.component.html',
  styleUrls: ['./step-2.component.scss']
})
export class Step2Component
  implements OnInit, OnDestroy, CanDeactivate<Step2Component>, AfterViewInit {
  public step2Form: FormGroup;
  public selectedCompany: string;
  public organizations: EntityContentInterface[];
  public selectedDepartment: string;
  public departments: EntityContentInterface[];
  public owningEntityRoles: String[];
  '';
  private bpId: string;
  private _getOwnerData$: Subscription;
  private _getDropDownData$: Subscription;
  private _saveOwnerData$: Subscription;
  private _paramMap$: Subscription;

  public isNextButtonDisabled = false;
  private _isUpdatingSubscription$: Subscription;
  public fullName = new FormControl('', Validators.maxLength(255));

  private lastEndIndex = 0;
  private currentUserPage = 0;
  private currentSearchTerm = '';
  private endOfListReached = false;
  private loadingList = false;
  private userBuffer = 33;

  constructor(
    private featureFlagControllerService: FeatureFlagControllerService,
    private stepContainerService: StepContainerService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public step2Service: Step2Service,
    private toastService: ToastService,
    private modalService: TaModal,
    private createBusinessProcessesService: CreateBusinessProcessesService
  ) {
    this.initForm();
  }

  public initForm() {
    this.step2Form = this.formBuilder.group({
      id: ['', [Validators.required]],
      fullName: this.fullName,
      email: [
        '',
        {
          validators: [
            Validators.pattern(
              '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'
            ),
            Validators.maxLength(255)
          ],
          updateOn: 'blur'
        }
      ],
      company: '',
      owningEntityRole: '',
      department: '', // departments haven't been integrated yet with BE
      version: 0
    });
    this.organizations = [];
    this.departments = [];
    this.bpId = '';
  }

  ngOnInit() {
    this._paramMap$ = getRouteParamObservable(
      this.route.parent.paramMap,
      'id'
    ).subscribe(id => {
      this.initForm();
      this.bpId = id;
      this.getBpOwner(id);
    });

    this.cancelUpdatingSubscriptions();
    this._isUpdatingSubscription$ = this.createBusinessProcessesService.isUpdatingSubject.subscribe(
      value => {
        this.isNextButtonDisabled = value;
      }
    );
  }

  ngAfterViewInit() {
    // verifies licenses
    this.featureFlagControllerService
      .getAllFeatureFlags()
      .subscribe(allLicenses => {
        if (allLicenses.RHEA_NEW_UI_STEPS_12_LICENSE === true) {
          this.router.navigate([
            UtilsClass.getRelativeUrl(this.router.url, `../details`)
          ]);
        }
      });
  }

  ngOnDestroy() {}

  get form() {
    return this.step2Form.controls;
  }

  public getBpOwner(id: string) {
    this.cancelGetOwnerData();
    this._getOwnerData$ = this.step2Service.getBpOwner(id).subscribe(
      success => {
        if (success.owner) {
          this.step2Form.patchValue({
            id: id,
            fullName: success.owner.fullName,
            email: success.owner.email,
            version: success.version
          });
        } else {
          this.step2Form.patchValue({
            id: id,
            version: success.version
          });
        }
        if (success.owningCompanyEntity) {
          this.step2Form.patchValue({
            company: success.owningCompanyEntity
          });
        }
        if (success.department) {
          this.step2Form.patchValue({
            department: success.department
          });
        }
        if (success.role) {
          this.step2Form.patchValue({
            owningEntityRole: success.role
          });
        }

        this.getDropDownData();

        this.createBusinessProcessesService.setAutosaveTarget(
          success.version,
          success.id,
          () => this.isAutosaveActive(),
          this.step2Form.valueChanges,
          () => this.saveOwner(),
          versionResponse => this.updateVersion(versionResponse),
          response => this.handleSaveError(response)
        );
      },
      error =>
        this.createBusinessProcessesService.show404ErrorAndRedirect(error)
    );
  }

  private isAutosaveActive(): boolean {
    if (!this.step2Form.valid) {
      return false;
    }
    if (this.step2Form.pristine) {
      return false;
    }
    return true;
  }

  private getDropDownData() {
    if (this._getDropDownData$) {
      this._getDropDownData$.unsubscribe();
    }

    this._getDropDownData$ = forkJoin([
      this.step2Service.getCompanyEntities(),
      this.step2Service.getDepartments(),
      this.step2Service.getOwningEntityRoles()
    ]).subscribe(
      ([organizations, departments, owningEntityRoles]) => {
        this.organizations = organizations.content;
        this.endOfListReached = organizations.last;
        this.departments = departments;
        this.owningEntityRoles = owningEntityRoles.sort();
      },
      err => console.log('Error: ', err)
    );
  }

  private handleSaveError(error: any) {
    this.createBusinessProcessesService.showCannotSaveToast(error);
  }

  public updateVersion(baseDomain: BaseDomainInterface) {
    if (this.step2Form.get('id').value !== baseDomain.id) {
      // TODO: TIMF-4607 user may need to refresh their data if there is a version conflict.
      console.warn(
        `Expected record id ${this.step2Form.get('id').value} but got record ${
          baseDomain.id
        }`
      );
    } else {
      // Don't emit the event: this change should not make the form dirty.
      this.step2Form.patchValue(
        { version: baseDomain.version },
        { emitEvent: false }
      );
    }
  }

  public onSubmit() {
    if (!this.step2Form.dirty) {
      return this.stepContainerService.emitChange(1);
    }
    this.cancelSaveOwnerData();
    this._saveOwnerData$ = this.createBusinessProcessesService
      .save()
      .pipe(
        catchError(error => {
          this.createBusinessProcessesService.showCannotSaveToast(error);
          return of(false);
        })
      )
      .subscribe(() => {
        this.step2Form.markAsPristine();
        this.stepContainerService.emitChange(1);
      });
  }

  public saveOwner(): Observable<BaseDomainInterface> {
    const owner = {
      id: this.bpId,
      companyId: this.form.company.value ? this.form.company.value.id : null,
      fullName: this.form.fullName.value,
      email: this.form.email.value,
      version: this.form.version.value,
      departmentId: this.form.department.value
        ? this.form.department.value.id
        : null,
      role: this.form.owningEntityRole.value
    };
    return this.step2Service.saveOwner(owner).pipe(
      tap(result => {
        this.step2Form.patchValue({
          version: result.version
        });
        this.step2Form.markAsPristine();
      }),
      catchError(error => {
        this.createBusinessProcessesService.showCannotSaveToast(error);
        return of(error);
      }) // [i18n-tobeinternationalized]))
    );
  }

  public canDeactivate(
    step2Component: Step2Component,
    _currentRoute,
    _currentState,
    nextState: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    step2Component.step2Form.updateValueAndValidity();

    // TODO: TIMF-4596 add a dialog to give the user a choice to exit unsaved if data is invalid.
    const isIgnoringFailures: boolean = nextState.url === '/business-process';

    if (
      step2Component.createBusinessProcessesService.isUpdatingSubject.getValue()
    ) {
      step2Component.toastService.info(
        `Saving.  You can change pages after saving completes.`
      ); // [i18n-tobeinternationalized]
      return false;
    }

    // Closing a form that is invalid but unchanged is ok.
    if (
      isIgnoringFailures &&
      !step2Component.step2Form.valid &&
      !step2Component.step2Form.dirty
    ) {
      return true;
    }

    if (isIgnoringFailures && !step2Component.step2Form.valid) {
      step2Component.toastService.warn(
        `Updates were not saved because the form had invalid data.`
      ); // [i18n-tobeinternationalized]
      return true;
    }

    if (!step2Component.step2Form.valid) {
      return false;
    }
    if (!step2Component.step2Form.dirty) {
      return true;
    }
    return this.createBusinessProcessesService.save(isIgnoringFailures).pipe(
      catchError(error => {
        this.createBusinessProcessesService.showCannotSaveToast(error);
        return of(isIgnoringFailures);
      })
    );
  }

  private cancelGetOwnerData() {
    if (this._getOwnerData$) {
      this._getOwnerData$.unsubscribe();
    }
  }

  private cancelSaveOwnerData() {
    if (this._saveOwnerData$) {
      this._saveOwnerData$.unsubscribe();
    }
  }

  private cancelUpdatingSubscriptions() {
    if (this._isUpdatingSubscription$) {
      this._isUpdatingSubscription$.unsubscribe();
    }
  }

  public requestForInfiniteList($event) {
    const end = $event.endIndex;
    const hasReachedBufferPoint =
      end &&
      end >= this.organizations.length - this.userBuffer &&
      end >= this.lastEndIndex;
    this.lastEndIndex = end;
    if (
      hasReachedBufferPoint &&
      !this.endOfListReached &&
      end !== -1 &&
      !this.loadingList
    ) {
      this.currentUserPage++;
      this.step2Service
        .getCompanyEntities(this.currentUserPage)
        .subscribe(organizationsResponse => {
          const organizationsToAdd = organizationsResponse.content;
          this.organizations = [...this.organizations, ...organizationsToAdd];
          this.loadingList = false;
          this.endOfListReached = organizationsResponse.last;
        });
    }
  }
}
