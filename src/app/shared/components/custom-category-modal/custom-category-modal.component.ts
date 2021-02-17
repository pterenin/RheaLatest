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
import { DataElementCategoriesService } from '../../services/data-element-categories/data-element-categories.service';
import { ProcessingPurposeCategoriesService } from '../../services/processing-purpose-categories/processing-purpose-categories.service';

import { DataElementCategoryInterface } from '../../models/data-elements.model';
import { DataSubjectCategoryInterface } from '../../models/data-subjects.model';
import { ProcessingPurposeCategoryInterface } from '../../models/processing-purposes.model';

import { AutoUnsubscribe } from '../../decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { exists } from '../../utils/basic-utils';
import { Subscription } from 'rxjs';

@AutoUnsubscribe(['_addCategory$'])
@Component({
  selector: 'ta-custom-category-modal',
  templateUrl: './custom-category-modal.component.html',
  styleUrls: ['./custom-category-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CustomCategoryModalComponent implements OnInit, OnDestroy {
  @Input() public redirectModalOnSubmit: boolean;
  @Input() public dataType: 'PP' | 'DS' | 'DE';
  public modalType: string;

  @Input()
  set categoryInfo(
    info:
      | DataElementCategoryInterface
      | DataSubjectCategoryInterface
      | ProcessingPurposeCategoryInterface
  ) {
    this._categoryInfo = info;
    this.category.patchValue(info.category);
  }

  public customCategoryForm: FormGroup;
  public category: FormControl;

  private _categoryInfo: DataElementCategoryInterface;
  private _addCategory$: Subscription;

  constructor(
    public activeModal: TaActiveModal,
    private dataElementCategoriesService: DataElementCategoriesService,
    private dataSubjectCategoriesService: DataSubjectCategoriesService,
    private processingPurposeCategoriesService: ProcessingPurposeCategoriesService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastService: ToastService,
    private translateService: TranslateService
  ) {
    this.category = new FormControl('', Validators.required);
    this.customCategoryForm = this.formBuilder.group({
      category: this.category
    });
  }

  ngOnInit() {
    this.modalType = this.getModalType(this.dataType);
  }

  private getModalType(type: 'PP' | 'DS' | 'DE') {
    if (type === 'PP') {
      return 'Processing Purpose';
    } else if (type === 'DS') {
      return 'Data Subject';
    } else if (type === 'DE') {
      return 'Data Element';
    } else {
      console.error('Unsupported data type');
      return '';
    }
  }

  public dismissModal() {
    this.activeModal.dismiss('Cross click');
  }

  public addNewCategory() {
    if (this.dataType === 'PP') {
      this.addNewCategoryPP();
    } else if (this.dataType === 'DE') {
      this.addNewCategoryDE();
    } else if (this.dataType === 'DS') {
      this.addNewCategoryDS();
    } else {
      console.error('Unsupported data type');
    }
  }

  private addNewCategoryPP() {
    this._addCategory$ = this.processingPurposeCategoriesService
      .addProcessingPurposeCategory(this.category.value)
      .subscribe(
        () => {
          this.closeModal();
          this.showLocaleToastMessage(
            'CREATED',
            ToastType.Success,
            this.category.value
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
            this.category.value,
            logError ? error : null
          );
        }
      );
  }

  private addNewCategoryDE() {
    this._addCategory$ = this.dataElementCategoriesService
      .addDataElementCategory(this.category.value)
      .subscribe(
        () => {
          this.closeModal();
          this.showLocaleToastMessage(
            'CREATED',
            ToastType.Success,
            this.category.value
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
            this.category.value,
            logError ? error : null
          );
        }
      );
  }

  private addNewCategoryDS() {
    this._addCategory$ = this.dataSubjectCategoriesService
      .addDataSubjectCategory(this.category.value)
      .subscribe(
        () => {
          this.closeModal();
          this.showLocaleToastMessage(
            'CREATED',
            ToastType.Success,
            this.category.value
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
            this.category.value,
            logError ? error : null
          );
        }
      );
  }

  public editCategory() {
    if (this.dataType === 'PP') {
      this.editCategoryPP();
    } else if (this.dataType === 'DE') {
      this.editCategoryDE();
    } else if (this.dataType === 'DS') {
      this.editCategoryDS();
    } else {
      console.error('Unsupported data type.');
    }
  }

  private editCategoryPP() {
    this._addCategory$ = this.processingPurposeCategoriesService
      .editProcessingPurposeCategoryName({
        ...this._categoryInfo,
        category: this.category.value
      })
      .subscribe(
        () => {
          this.closeModal();
          this.showLocaleToastMessage(
            'RENAMED',
            ToastType.Success,
            this._categoryInfo.category
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
            this.category.value,
            logError ? error : null
          );
        }
      );
  }

  private editCategoryDE() {
    this._addCategory$ = this.dataElementCategoriesService
      .editDataElementCategoryName({
        ...this._categoryInfo,
        category: this.category.value
      })
      .subscribe(
        () => {
          this.closeModal();
          this.showLocaleToastMessage(
            'RENAMED',
            ToastType.Success,
            this._categoryInfo.category
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
            this.category.value,
            logError ? error : null
          );
        }
      );
  }

  private editCategoryDS() {
    this._addCategory$ = this.dataSubjectCategoriesService
      .editDataSubjectCategoryName({
        ...this._categoryInfo,
        category: this.category.value
      })
      .subscribe(
        () => {
          this.closeModal();
          this.showLocaleToastMessage(
            'RENAMED',
            ToastType.Success,
            this._categoryInfo.category
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
            this.category.value,
            logError ? error : null
          );
        }
      );
  }

  public onSubmit() {
    if (!exists(this._categoryInfo)) {
      this.addNewCategory();
    } else {
      this.editCategory();
    }
  }

  private closeModal(): void {
    this.activeModal.close();

    if (this.redirectModalOnSubmit) {
      this.router.navigate(['../']);
    }
  }

  showLocaleToastMessage(
    templateMessageKey,
    toastType: ToastType,
    categoryName: string,
    error?
  ) {
    const templateStringVariables = [
      {
        key: '@@category',
        value: categoryName
      }
    ];

    let categoryType = '';
    switch (this.dataType) {
      case 'PP':
        categoryType = 'PROCESSING_PURPOSES';
        break;
      case 'DS':
        categoryType = 'DATA_SUBJECTS';
        break;
      case 'DE':
        categoryType = 'DATA_ELEMENTS';
        break;
    }

    const keyString = `SETTINGS.${categoryType}.TOAST_MESSAGES.CATEGORY.${templateMessageKey}`;

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
