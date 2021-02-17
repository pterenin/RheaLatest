import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';

import { Router } from '@angular/router';
import { AutoUnsubscribe } from 'src/app/shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import {
  BusinessProcessControllerService,
  FeatureFlagControllerService
} from 'src/app/shared/_services/rest-api';
import {
  BusinessProcessApprovalInterface,
  ProcessingPurposeWithLegalBasisInterface
} from 'src/app/shared/_interfaces/rest-api';
import { TableService, ToastService } from '@trustarc/ui-toolkit';
import { UtilsClass } from 'src/app/shared/_classes';
import { BUSINESS_PROCESS_NAVIGATION } from 'src/app/shared/_constant';
import { CreateBusinessProcessesService } from '../../create-bp/create-business-processes.service';
import { LegalBasesControllerService } from 'src/app/shared/_services/rest-api/legal-bases-controller/legal-bases-controller.service';
import { LegalBasisInterface } from 'src/app/shared/_interfaces/rest-api/legal-bases-controller/legal-bases-controller';
import { ClipboardService } from 'ngx-clipboard';
import { forkJoin, Subscription } from 'rxjs';
import { drop, cloneDeep, last } from 'lodash';
import { BaseRecordsControllerService } from 'src/app/shared/_services/rest-api/base-records-controller/base-records-controller.service';

@AutoUnsubscribe([
  '_getInitialData$',
  '_getAllFeatureFlags$',
  '_putApprovalUpdate$',
  '_eventRequestRef$',
  '_versionSubscription$',
  '_versionStatusSubscription$'
])
@Component({
  selector: 'ta-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReviewComponent implements OnInit, OnDestroy {
  public version: number;
  public status: string;
  public gridID: string;
  public pageSize: number;
  public page: number;
  public businessProcessId: string;
  public readonly businessProcessNavigation = BUSINESS_PROCESS_NAVIGATION;

  public businessProcessApproval: BusinessProcessApprovalInterface;
  public legalBases: LegalBasisInterface[] = [];

  public isLoading = false;
  public searchString = '';
  public data: ProcessingPurposeWithLegalBasisInterface[] = [];

  public get processingPurposes(): ProcessingPurposeWithLegalBasisInterface[] {
    return this.businessProcessApproval.processingPurposes;
  }

  private _eventRequestRef$: Subscription = null;
  private _getInitialData$: Subscription;
  private _getAllFeatureFlags$: Subscription;
  private _putApprovalUpdate$: Subscription;
  private _versionSubscription$: Subscription;
  private _versionStatusSubscription$: Subscription;

  constructor(
    private router: Router,
    private createBusinessProcessesService: CreateBusinessProcessesService,
    private businessProcessControllerService: BusinessProcessControllerService,
    private legalBasesControllerService: LegalBasesControllerService,
    private featureFlagControllerService: FeatureFlagControllerService,
    private clipboardService: ClipboardService,
    private toastService: ToastService,
    private tableService: TableService,
    private baseRecordsService: BaseRecordsControllerService
  ) {
    this.gridID = 'review-bp-table';
    this.pageSize = 10;
    this.page = 1;
    this.businessProcessId = this.router.url.split('/')[2];
  }

  ngOnInit() {
    this.initData();
    this.verifyLicense();

    this._eventRequestRef$ = this.tableService
      .listenRequestEvents(this.gridID)
      .subscribe(req => {
        if (req['sortType']) {
          this.sortRows(req['columnSort'], req['sortType']);
        }
      });
    this.setTagsAndStatusVersionSubscriptions();
  }

  public initData() {
    this.isLoading = true;
    this._getInitialData$ = forkJoin([
      this.businessProcessControllerService.getApprovalById(
        this.businessProcessId
      ),
      this.legalBasesControllerService.findAll()
    ]).subscribe(
      ([approval, legalBases]) => {
        this.isLoading = false;

        this.version = approval.version;
        this.status = approval.status;
        this.businessProcessApproval = approval;
        this.legalBases = legalBases;

        this.mapLegalBasesToApprovalData(
          this.businessProcessApproval,
          this.legalBases
        );
        this.renderData();
      },
      err => {
        this.isLoading = false;
        console.error(err);
        // [i18n-tobeinternationalized]
        this.toastService.error(
          'Error retrieving business processes and legal bases'
        );
      }
    );
  }

  public verifyLicense() {
    this._getAllFeatureFlags$ = this.featureFlagControllerService
      .getAllFeatureFlags()
      .subscribe(
        allLicenses => {
          if (allLicenses.RHEA_NEW_UI_STEPS_12_LICENSE === false) {
            this.router.navigate([
              UtilsClass.getRelativeUrl(this.router.url, `../background`)
            ]);
          }
        },
        err => console.error(err)
      );
  }

  public mapLegalBasesToApprovalData(approval, legalBases) {
    const { processingPurposes, associations } = approval;

    // Build associations map and processing purposes ids array
    const ppIds: string[] = [];
    const associationsMap = new Map<string, string>();
    associations.forEach(association => {
      ppIds.push(association.processingPurposeId);
      associationsMap.set(
        association.processingPurposeId,
        association.legalBasisId
      );
    });

    // Map processing purposes
    processingPurposes.forEach(pp => {
      pp.legalBasisName = '';
      if (ppIds.includes(pp.id)) {
        const legalBasisId = associationsMap.get(pp.id);
        const legalBasis = legalBases.find(item => item.id === legalBasisId);
        if (legalBasis) {
          pp.legalBasis = legalBasis;
          pp.legalBasisName = legalBasis.shortName;
        }
      }
    });
  }

  public copyLinkToClipboard() {
    this.clipboardService.copyFromContent(window.location.href);
    // [i18n-tobeinternationalized]
    const message = 'Copied to clipboard: ' + window.location.href;
    this.toastService.success(message, null, 10000);
  }

  public onSearch(event) {
    this.searchString = event;
  }

  public onChangePage(event) {
    this.page = event;
    this.renderData();
  }

  public onChangeMax(event) {
    this.pageSize = event;
    this.page = 1;
    this.renderData();
  }

  public renderData() {
    const paginated = this.getPaginatedItems(
      this.processingPurposes,
      this.page,
      this.pageSize
    );

    this.data = cloneDeep(paginated);
  }

  public getPaginatedItems(
    items,
    page,
    pageSize
  ): ProcessingPurposeWithLegalBasisInterface[] {
    const pg = page || 1;
    const pgSize = pageSize || 25;
    const offset = (pg - 1) * pgSize;

    return drop(items, offset).slice(
      0,
      pgSize
    ) as ProcessingPurposeWithLegalBasisInterface[];
  }

  public setLegalBasisForProcessingPurpose(id, basis) {
    const found = this.processingPurposes.find(item => item.id === id);
    if (found) {
      found.legalBasis = basis;
      found.legalBasisName = basis.shortName;
    }

    this.renderData();
  }

  public sortRows(column, type) {
    if (type === '' || type === 'asc') {
      type = 'desc';
      this.processingPurposes.sort((b, a) => {
        return b[column].toString().localeCompare(a[column].toString());
      });
    } else if (type === 'desc') {
      type = 'asc';
      this.processingPurposes.sort((a, b) => {
        return b[column].toString().localeCompare(a[column].toString());
      });
    }

    this.renderData();
  }

  public buildPutRequest() {
    const associations = this.processingPurposes
      .filter(item => !!item.legalBasis)
      .map(item => {
        return {
          legalBasisId: item.legalBasis.id,
          processingPurposeId: item.id
        };
      });

    return {
      id: this.businessProcessId,
      version: this.version,
      status: this.status,
      associations
    };
  }

  public isDisabledNextBtn() {
    return false;
  }

  public navigate(options: { save: boolean; step: string }) {
    // If saving not required
    if (!options.save) {
      if (options.step === 'cancel' || options.step === 'home') {
        return this.router.navigateByUrl('/business-process');
      } else {
        return this.navigateToUrl(options.step);
      }
    }

    // If saving required
    const payload = this.buildPutRequest();
    if (this._putApprovalUpdate$) {
      this._putApprovalUpdate$.unsubscribe();
    }
    this._putApprovalUpdate$ = this.businessProcessControllerService
      .updateApproval(payload, this.businessProcessId)
      .subscribe(
        () => {
          if (options.step === 'home') {
            return this.router.navigateByUrl('/business-process');
          }
          return this.navigateToUrl(options.step);
        },
        err => {
          console.error(err);
        }
      );
  }

  private navigateToUrl(url): void {
    const currentUrl = last(this.router.url.split('/'));
    this.router
      .navigate([this.router.url.replace(currentUrl, url)])
      .then(() => {
        this.createBusinessProcessesService.setSelectedStep(url);
      });
  }

  ngOnDestroy() {}

  private setTagsAndStatusVersionSubscriptions(): void {
    this._versionSubscription$ = this.baseRecordsService.versionAfterUpdateTags
      .asObservable()
      .subscribe(version => (this.version = version));

    this._versionStatusSubscription$ = this.businessProcessControllerService.versionAfterUpdateStatus
      .asObservable()
      .subscribe(payload => {
        this.version = payload.version;
        this.status = payload.status;
      });
  }
}
