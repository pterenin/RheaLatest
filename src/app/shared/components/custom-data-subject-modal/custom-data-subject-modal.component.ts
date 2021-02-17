import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

import { TaActiveModal, ToastService } from '@trustarc/ui-toolkit';
import { TranslateService } from '@ngx-translate/core';
import { ToastType } from '../../_constant';
import { UtilsClass } from 'src/app/shared/_classes';

import { DataSubjectCategoriesService } from '../../services/data-subject-categories/data-subject-categories.service';
import { DataSubjectsService } from '../../services/data-subjects/data-subjects.service';

import {
  DataSubjectCategoryInterface,
  DataSubjectUpsertResponseInterface
} from '../../models/data-subjects.model';

import { Subject, Subscription } from 'rxjs';
import { AutoUnsubscribe } from '../../decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { formatCategoryLabel } from 'src/app/shared/utils/basic-utils';
import { debounceTime } from 'rxjs/operators';

declare const _: any;

@AutoUnsubscribe([
  '_getSearchedCategoriesSubscription$',
  '_retrieveDataSubjectsCategoriesSubscription$',
  '_createCustomDataSubjectSubscription$',
  '_updateCustomDataSubjectSubscription$'
])
@Component({
  selector: 'ta-modal-custom-data-subject',
  templateUrl: './custom-data-subject-modal.component.html',
  styleUrls: ['./custom-data-subject-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CustomDataSubjectModalComponent implements OnInit, OnDestroy {
  @Input() public redirectModalOnSubmit: boolean;
  @Input() public preSelectedName: string;
  @Input() public preSelectedCategory: DataSubjectCategoryInterface;
  @Input() public preSelectedHighRisk = false;
  @Input() public mode: 'creating' | 'updating' = 'creating';
  @Input() public dsIdToUpdate: string;
  @Input() public version = 0;

  public name = new FormControl('', {
    validators: [Validators.required, Validators.maxLength(255)]
  });
  public category = new FormControl('', Validators.required);
  public highRisk = new FormControl('', Validators.required);
  public customDataSubjectForm: FormGroup;

  public categories: DataSubjectCategoryInterface[] = [];
  public categoryOptionList = [];

  $scrollListChange: Subject<void> = new Subject<void>();

  private _getSearchedCategoriesSubscription$: Subscription;
  private _createCustomDataSubjectSubscription$: Subscription;
  private _updateCustomDataSubjectSubscription$: Subscription;
  private _retrieveDataSubjectsCategoriesSubscription$: Subscription;

  private loadingList = false;
  private totalCategoriesInList = 0;
  private currentEndIndex = 0;

  constructor(
    public activeModal: TaActiveModal,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastService: ToastService,
    private translateService: TranslateService,
    private dataSubjectCategoriesService: DataSubjectCategoriesService,
    private dataSubjectsService: DataSubjectsService
  ) {
    this.redirectModalOnSubmit = false;
    this.customDataSubjectForm = this.formBuilder.group({
      dsName: this.name,
      dsCategory: this.category,
      dsHighRisk: this.highRisk
    });
  }

  ngOnInit() {
    this.name.setValue(this.preSelectedName);
    this.category.setValue(this.preSelectedCategory);
    this.highRisk.setValue(this.preSelectedHighRisk.toString());

    this.retrieveDataSubjectsCategories();

    this._getSearchedCategoriesSubscription$ = this.$scrollListChange
      .pipe(debounceTime(500))
      .subscribe(() => {
        // TODO: add logic to retrieve on scroll list change
      });
  }

  public dismissModal() {
    this.activeModal.dismiss('Cross click');
  }

  private retrieveDataSubjectsCategories() {
    if (this._retrieveDataSubjectsCategoriesSubscription$) {
      this._retrieveDataSubjectsCategoriesSubscription$.unsubscribe();
    }
    this.loadingList = true;
    this._retrieveDataSubjectsCategoriesSubscription$ = this.dataSubjectCategoriesService
      .getAllDataSubjectsCategories()
      .subscribe(
        categories => {
          this.updateOptionsListWithResponse(categories);
          this.loadingList = false;
        },
        error => {
          const message = 'There was error retrieving data subjects categories';
          console.error(message, error);
          this.loadingList = false;
          this.toastService.error(message);
        }
      );
  }

  public onSubmit() {
    const form = this.customDataSubjectForm;

    const templateStringVariables = [
      {
        key: '@@dataSubject',
        value: form.value['dsName'].replace(/(.{100})/g, '$1\n')
      },
      { key: '@@category', value: form.value['dsCategory']['category'] }
    ];

    if (this.mode === 'creating') {
      const dsBody = {
        categoryId: form.value['dsCategory']['categoryId'],
        dataSubject: form.value['dsName'],
        highRisk: form.value['dsHighRisk'] === 'true'
      };
      this._createCustomDataSubjectSubscription$ = this.dataSubjectsService
        .createCustomDataSubject(dsBody)
        .subscribe(
          (res: DataSubjectUpsertResponseInterface) => {
            this.closeModal();
            this.showLocaleToastMessage(
              'CREATED',
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
      const dsBody = {
        id: this.dsIdToUpdate,
        categoryId: form.value['dsCategory']['categoryId'],
        dataSubject: form.value['dsName'],
        highRisk: form.value['dsHighRisk'] === 'true',
        version: this.version
      };
      this._updateCustomDataSubjectSubscription$ = this.dataSubjectsService
        .updateCustomDataSubjectById(this.dsIdToUpdate, dsBody)
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

  public closeModal(): void {
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

  showLocaleToastMessage(
    templateMessageKey,
    toastType: ToastType,
    templateStringVariables?: { key: string; value: string }[],
    error?
  ) {
    const keyString = `SETTINGS.DATA_SUBJECTS.TOAST_MESSAGES.ITEM.${templateMessageKey}`;
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

  ngOnDestroy() {}
}
