import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TaModal, ToastService } from '@trustarc/ui-toolkit';
import { Router } from '@angular/router';
import { Observable, OperatorFunction, Subscription, throwError } from 'rxjs';
import { AutoUnsubscribe } from 'src/app/shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';
// tslint:disable-next-line:max-line-length
import { AssignBusinessProcessComponent } from 'src/app/business-processes/create-bp/assign-business-process/assign-business-process.component';
import { CollaboratorsService } from 'src/app/shared/services/collaborators/collaborators.service';
import { BusinessProcessInterface } from 'src/app/business-processes/create-bp/create-business-processes.model';
import { catchError, delay, flatMap, map, tap } from 'rxjs/operators';
import { BaseDomainInterface } from 'src/app/shared/models/base-domain-model';
import { BusinessProcessService } from 'src/app/shared/services/business-process/business-process.service';
import { RecordListingService } from 'src/app/shared/services/record-listing/record-listing.service';
import { FeatureFlagAllInterface } from 'src/app/shared/_interfaces';
import { FeatureFlagControllerService } from '../../../../_services/rest-api';

@AutoUnsubscribe([
  '_createBusinessProcess$',
  '_disableCreateBusinessProcess$',
  '_featureLicenses$'
])
@Component({
  selector: 'ta-datagrid-add-bp-button',
  templateUrl: './datagrid-add-bp-button.component.html',
  styleUrls: ['./datagrid-add-bp-button.component.scss']
})
export class DatagridAddBpButtonComponent implements OnInit, OnDestroy {
  @Input() public gridId: string;
  public createBusinessProcessButtonDisabledFlag: boolean;
  private _disableCreateBusinessProcess$: Subscription;
  private _createBusinessProcess$: Subscription;
  private _featureLicenses$: Subscription;
  private _featureLicenses: FeatureFlagAllInterface;

  constructor(
    private featureFlagControllerService: FeatureFlagControllerService,
    private businessProcessService: BusinessProcessService,
    private collaboratorsService: CollaboratorsService,
    private toastService: ToastService,
    private modalService: TaModal,
    private recordListingService: RecordListingService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    // get licenses status
    this._featureLicenses$ = this.featureFlagControllerService
      .getAllFeatureFlags()
      .subscribe(allLicenses => {
        this._featureLicenses = allLicenses;
      });

    this._disableCreateBusinessProcess$ = this.businessProcessService
      .getCreateBusinessProcessesDisabledObservable()
      .subscribe(
        isDisabled =>
          (this.createBusinessProcessButtonDisabledFlag = isDisabled)
      );
  }
  public ngOnDestroy(): void {}

  public assignNewBusinessProcessClicked() {
    // TODO: create routing and navigation *to* the Assign New Business Process View. TIMF-4592

    const modalRef = this.modalService.open(AssignBusinessProcessComponent);
    modalRef.componentInstance.gridId = this.gridId;
    modalRef.result.then(
      success => {
        if (success.isCreateAndAssign) {
          if (this._createBusinessProcess$) {
            this._createBusinessProcess$.unsubscribe();
          }
          this._createBusinessProcess$ = this.createBusinessProcessWithNameAndDescription(
            success.name,
            success.description
          )
            .pipe(
              delay(1000),
              tap(() => {
                this.recordListingService.triggerRecordsUpdated();
              }),
              tap(() =>
                this.toastService.success(
                  `Success! Email sent to business process record assignee.`
                )
              ),
              flatMap(businessProcess =>
                this.collaboratorsService.add(businessProcess.id, {
                  message: success.message,
                  userIds: [success.userId]
                })
              )
            )
            .subscribe(null, error => {});
        } else if (success.isAssignExisting) {
          if (this._createBusinessProcess$) {
            this._createBusinessProcess$.unsubscribe();
          }
          this._createBusinessProcess$ = this.collaboratorsService
            .add(success.businessProcessId, {
              message: success.message,
              userIds: [success.userId]
            })
            .pipe(
              tap(
                () =>
                  this.toastService.success(`Successfully added collaborator.`) // [i18n-tobeinternationalized]
              )
            )
            .subscribe();
        }
      },
      error => {}
    );
  }

  public onClickCreateBusinessProcess() {
    this._createBusinessProcess$ = this.createBusinessProcess()
      .pipe(this.getNavigateMap())
      .subscribe(null, error => {});
  }

  private getNavigateMap(): OperatorFunction<
    BaseDomainInterface,
    Promise<boolean>
  > {
    return map(businessProcess => {
      const defaultRoute =
        this._featureLicenses.RHEA_NEW_UI_STEPS_12_LICENSE === true
          ? 'details'
          : 'background';
      return this.router.navigate([
        `business-process/${businessProcess.id}/${defaultRoute}`
      ]);
    });
  }

  private createBusinessProcessWithNameAndDescription(
    name: string,
    description: string
  ): Observable<BaseDomainInterface> {
    return this.createBusinessProcess().pipe(
      flatMap(businessProcess => {
        const updatedBusinessProcess = {
          ...businessProcess,
          name,
          description
        };
        return this.businessProcessService.updateBackground(
          updatedBusinessProcess
        );
      })
    );
  }

  private createBusinessProcess(): Observable<BusinessProcessInterface> {
    return this.businessProcessService.create().pipe(
      catchError(error => {
        console.warn('Error creating new business process.', error);
        // NOTE: Show the user an error but don't route them to another page.
        this.toastService.error('Error creating new business process.'); // [i18n-tobeinternationalized]
        return throwError(error);
      })
    );
  }
}
