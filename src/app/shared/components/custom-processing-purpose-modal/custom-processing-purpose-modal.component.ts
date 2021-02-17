import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { TaActiveModal, ToastService } from '@trustarc/ui-toolkit';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { AutoUnsubscribe } from '../../decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { Subject, Subscription } from 'rxjs';
import { HighRiskService } from '../../services/high-risk/high-risk.service';
import { ProcessingPurposeCategoriesService } from '../../services/processing-purpose-categories/processing-purpose-categories.service';
import { debounceTime } from 'rxjs/operators';
import { formatCategoryLabel } from 'src/app/shared/utils/basic-utils';
import { HighRiskFactorsCategoryInterface } from '../../models/high-risk.model';
import { ProcessingPurposesService } from '../../services/processing-purposes/processing-purposes.service';
import {
  ProcessingPurposeCategoryInterface,
  ProcessingPurposeUpsertResponseInterface
} from '../../models/processing-purposes.model';
import { TranslateService } from '@ngx-translate/core';
import { ToastType } from '../../_constant';
import { UtilsClass } from 'src/app/shared/_classes';

declare const _: any;

@AutoUnsubscribe([
  '_getSearchedCategoriesSubscription$',
  '_retrieveHighRiskFactorCategoriesSubscription$',
  '_retrieveProcessingPurposesCategoriesSubscription$',
  '_createCustomProcessingPurposeSubscription$',
  '_updateCustomProcessingPurposeSubscription$'
])
@Component({
  selector: 'ta-modal-custom-processing-purpose',
  templateUrl: './custom-processing-purpose-modal.component.html',
  styleUrls: ['./custom-processing-purpose-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CustomProcessingPurposeModalComponent
  implements OnInit, OnDestroy {
  @Input() public redirectModalOnSubmit: boolean;
  @Input() public preSelectedName: string;
  @Input() public preSelectedCategory: ProcessingPurposeCategoryInterface;
  @Input() public preSelectedFactors: HighRiskFactorsCategoryInterface[] = [];
  @Input() public mode: 'creating' | 'updating' = 'creating';
  @Input() public ppIdToUpdate: string;
  @Input() public version = 0;

  public name = new FormControl('', {
    validators: [Validators.required, Validators.maxLength(255)]
  });
  public category = new FormControl('', Validators.required);
  public factors = new FormControl('', Validators.required);
  public customProcessingPurposeForm: FormGroup;

  public categories: ProcessingPurposeCategoryInterface[] = [];
  public categoryOptionList = [];

  public highRiskFactorCategories: HighRiskFactorsCategoryInterface[] = [];

  $scrollListChange: Subject<void> = new Subject<void>();

  private _getSearchedCategoriesSubscription$: Subscription;
  private _createCustomProcessingPurposeSubscription$: Subscription;
  private _updateCustomProcessingPurposeSubscription$: Subscription;
  private _retrieveProcessingPurposesCategoriesSubscription$: Subscription;
  private _retrieveHighRiskFactorCategoriesSubscription$: Subscription;

  private loadingList = false;
  private loadingHighRiskFactorCategories = false;
  private totalCategoriesInList = 0;
  private currentEndIndex = 0;

  private notApplicableHighRiskFactorCategory: HighRiskFactorsCategoryInterface = {
    id: '00000000-0000-0000-0000-000000000000',
    name: 'None are applicable',
    answer: null,
    version: 0
  };

  constructor(
    public activeModal: TaActiveModal,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastService: ToastService,
    private translateService: TranslateService,
    private processingPurposeCategoriesService: ProcessingPurposeCategoriesService,
    private processingPurposesService: ProcessingPurposesService,
    private highRiskService: HighRiskService
  ) {
    this.redirectModalOnSubmit = false;
    this.customProcessingPurposeForm = this.formBuilder.group({
      ppName: this.name,
      ppCategory: this.category,
      ppInvolves: this.factors
    });
  }

  ngOnInit() {
    this.name.setValue(this.preSelectedName);
    this.category.setValue(this.preSelectedCategory);
    this.factors.setValue(this.capitalizeNameOfList(this.preSelectedFactors));
    this.retrieveProcessingPurposesCategories();
    this.retrieveHighRiskFactorCategories();

    this._getSearchedCategoriesSubscription$ = this.$scrollListChange
      .pipe(debounceTime(500))
      .subscribe(() => {
        // TODO: add logic to retrieve on scroll list change
      });
  }

  public dismissModal() {
    this.activeModal.dismiss('Cross click');
  }

  private retrieveProcessingPurposesCategories() {
    if (this._retrieveProcessingPurposesCategoriesSubscription$) {
      this._retrieveProcessingPurposesCategoriesSubscription$.unsubscribe();
    }
    this.loadingList = true;
    this._retrieveProcessingPurposesCategoriesSubscription$ = this.processingPurposeCategoriesService
      .getAllProcessingPurposesCategories()
      .subscribe(
        categories => {
          this.updateOptionsListWithResponse(categories);
          this.loadingList = false;
        },
        error => {
          const message =
            'There was error retrieving processing purposes categories';
          console.log(message, error);
          this.loadingList = false;
          this.toastService.error(message);
        }
      );
  }

  private retrieveHighRiskFactorCategories() {
    if (this._retrieveHighRiskFactorCategoriesSubscription$) {
      this._retrieveHighRiskFactorCategoriesSubscription$.unsubscribe();
    }
    this.loadingHighRiskFactorCategories = true;
    this._retrieveHighRiskFactorCategoriesSubscription$ = this.highRiskService
      .getAllHighRiskFactorCategories()
      .subscribe(
        highRiskFactorCategories => {
          // TODO: Concat default item with list from BE, change that after BE implement default
          this.highRiskFactorCategories = [
            this.notApplicableHighRiskFactorCategory
          ].concat(highRiskFactorCategories);
          this.loadingHighRiskFactorCategories = false;

          this.highRiskFactorCategories = this.capitalizeNameOfList(
            this.highRiskFactorCategories
          );
        },
        error => {
          const message =
            'There was error retrieving high risk factor categories';
          console.log(message, error);
          this.loadingHighRiskFactorCategories = false;
          this.toastService.error(message);
        }
      );
  }

  public onSubmit() {
    const form = this.customProcessingPurposeForm;
    const templateStringVariables = [
      { key: '@@processingPurpose', value: form.value['ppName'] },
      { key: '@@category', value: form.value['ppCategory']['category'] }
    ];

    const highRiskFactorCategoryIds = form.value['ppInvolves'].map(
      item => item.id
    );
    const includesNone = _.includes(
      highRiskFactorCategoryIds,
      '00000000-0000-0000-0000-000000000000'
    );

    if (this.mode === 'creating') {
      const ppBody = {
        category: form.value['ppCategory']['category'],
        highRiskFactorCategoryIds: includesNone
          ? []
          : highRiskFactorCategoryIds,
        processingPurpose: form.value['ppName']
      };
      this._createCustomProcessingPurposeSubscription$ = this.processingPurposesService
        .createCustomProcessingPurpose(ppBody)
        .subscribe(
          () => {
            this.closeModal();
            this.showLocaleToastMessage(
              'CREATED',
              ToastType.Success,
              templateStringVariables
            );
          },
          error => {
            let errorMessageKey = '';
            let logError = false;
            if (error.status === 409) {
              errorMessageKey = 'ERROR_EXISTING_NAME';
            } else {
              errorMessageKey = 'ERROR_CREATE';
              logError = true;
            }

            this.showLocaleToastMessage(
              errorMessageKey,
              ToastType.Error,
              templateStringVariables,
              logError ? error : null
            );
          }
        );
    }
    if (this.mode === 'updating') {
      const ppBody = {
        id: this.ppIdToUpdate,
        category: form.value['ppCategory']['category'],
        highRiskFactorCategoryIds: includesNone
          ? []
          : highRiskFactorCategoryIds,
        processingPurpose: form.value['ppName'],
        version: this.version
      };
      this._updateCustomProcessingPurposeSubscription$ = this.processingPurposesService
        .updateCustomProcessingPurposeById(this.ppIdToUpdate, ppBody)
        .subscribe(
          () => {
            this.closeModal();
            this.showLocaleToastMessage(
              'UPDATED',
              ToastType.Success,
              templateStringVariables
            );
          },
          error => {
            this.closeModal();
            let errorMessageKey = '';
            let logError = false;
            if (error.status === 409) {
              errorMessageKey = 'ERROR_EXISTING_NAME';
            } else {
              errorMessageKey = 'ERROR_UPDATE';
              logError = true;
            }

            this.showLocaleToastMessage(
              errorMessageKey,
              ToastType.Error,
              templateStringVariables,
              logError ? error : null
            );
          }
        );
    }
  }

  private closeModal(): void {
    this.activeModal.close();
    if (this.redirectModalOnSubmit) {
      this.router.navigate(['../']);
    }
  }

  public requestForInfiniteList($event) {
    this.currentEndIndex = $event.endIndex;
    this.$scrollListChange.next();
  }

  private updateOptionsListWithResponse(categories) {
    this.categories = categories;
    if (categories.length) {
      this.totalCategoriesInList += categories.length;
    }
    this.categoryOptionList = this.categoryOptionList.concat(categories);
    this.categoryOptionList = _.uniqBy(this.categoryOptionList, 'id');
    this.categoryOptionList.map(category => {
      category.label = formatCategoryLabel(category.category);
      return category;
    });
  }

  private capitalizeNameOfList(list: any[] = []) {
    if (this.mode === 'updating' && list.length === 0) {
      list.push(this.notApplicableHighRiskFactorCategory);
    }
    return list.map(risk => {
      risk.name = risk.name.replace(/^\w/, c => c.toUpperCase());
      return risk;
    });
  }
  ngOnDestroy() {}

  showLocaleToastMessage(
    templateMessageKey,
    toastType: ToastType,
    templateStringVariables?: { key: string; value: string }[],
    error?
  ) {
    const keyString = `SETTINGS.PROCESSING_PURPOSES.TOAST_MESSAGES.ITEM.${templateMessageKey}`;
    this.translateService.get(keyString).subscribe(messageTemplate => {
      const toastMessage = templateStringVariables
        ? UtilsClass.updateTemplateString(
            messageTemplate,
            templateStringVariables
          )
        : messageTemplate;

      if (toastType === ToastType.Success) {
        this.toastService.success(toastMessage);
      }
      if (toastType === ToastType.Error) {
        if (error) {
          console.error(toastMessage, error);
        }
        this.toastService.error(toastMessage);
      }
      if (toastType === ToastType.Info) {
        this.toastService.info(toastMessage);
      }
      if (toastType === ToastType.Warning) {
        this.toastService.warn(toastMessage);
      }
    });
  }
}
