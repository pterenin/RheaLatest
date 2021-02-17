import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AutoUnsubscribe } from '../../decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { DataElementCategoryInterface } from '../../models/data-elements.model';
import { forkJoin, Subscription } from 'rxjs';
import {
  TableService,
  TaModal,
  TaTableRequest,
  ToastService
} from '@trustarc/ui-toolkit';
import { Router } from '@angular/router';
import { SettingsBreadcrumbService } from '../settings-breadcrumb/settings-breadcrumb.service';
import { DatatableService } from '../../services/record-listing/datatable.service';
import { DataElementCategoriesService } from '../../services/data-element-categories/data-element-categories.service';
import { AuthService } from '../../services/auth/auth.service';
import { SettingsBreadcrumbInterface } from '../../models/settings-breadcrumb.model';
import { exists } from '../../utils/basic-utils';
// tslint:disable-next-line:max-line-length
import { ConfirmUnlinkDataElementCategoriesComponent } from '../confirm-unlink-data-element-categories/confirm-unlink-data-element-categories.component';
import { ConfirmDeleteContentComponent } from '../record-datagrid/confirm-delete-content/confirm-delete-content.component';
import { CustomCategoryModalComponent } from '../custom-category-modal/custom-category-modal.component';
import { CustomDataElementModalComponent } from '../custom-data-element-modal/custom-data-element-modal.component';
import { CustomProcessingPurposeModalComponent } from '../custom-processing-purpose-modal/custom-processing-purpose-modal.component';
import { CustomDataSubjectModalComponent } from '../custom-data-subject-modal/custom-data-subject-modal.component';
import { ProcessingPurposeCategoriesService } from '../../services/processing-purpose-categories/processing-purpose-categories.service';
import { DataSubjectCategoriesService } from '../../services/data-subject-categories/data-subject-categories.service';
import { ProcessingPurposesService } from '../../services/processing-purposes/processing-purposes.service';
import { DataSubjectsService } from '../../services/data-subjects/data-subjects.service';

@AutoUnsubscribe([
  'eventRequestRef',
  'eventSelectedRef',
  'eventPageSelectedItemsRef',
  '_getCategories$',
  '_hideCategories$',
  '_hideProcessingPurpose$'
])
@Component({
  selector: 'ta-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit, OnDestroy {
  @Input() dataType: 'PP' | 'DE' | 'DS';

  public gridID = 'categories';
  public iconColor = '#0052cc';

  public tableData = [];
  public totalRows: number;
  public currentPageSelectedItems: DataElementCategoryInterface[] = [];

  public selectedVisibility: 'visible' | 'hidden' | 'all' = 'all';
  public selectedCreations: 'custom' | 'system' | 'all' = 'all';

  private eventRequestRef: Subscription = null;
  private eventSelectedRef: Subscription = null;
  private eventPageSelectedItemsRef: Subscription = null;
  private _getCategories$: Subscription;
  private _hideCategories$: Subscription;

  public disabledUnlinkBtn = true;
  private previousRequest: TaTableRequest = {};
  private page = 0;
  private maxRows = 25;
  private search = null;
  private selectedItems: any = [];

  public request: TaTableRequest = {
    page: this.page,
    maxRows: this.maxRows
  };

  constructor(
    private router: Router,
    private settingsBreadcrumbService: SettingsBreadcrumbService,
    private datatableService: DatatableService,
    private tableService: TableService,
    private dataElementCategoriesService: DataElementCategoriesService,
    private processingPurposeCategoriesService: ProcessingPurposeCategoriesService,
    private dataSubjectCategoriesService: DataSubjectCategoriesService,
    private processingPurposeService: ProcessingPurposesService,
    private dataSubjectService: DataSubjectsService,
    private toastService: ToastService,
    private authService: AuthService,
    private modalService: TaModal
  ) {
    this.handleError = this.handleError.bind(this);
  }

  ngOnInit() {
    // Set breadcrumbs
    const breadcrumbs = this.getBreadcrumbsByType(this.dataType);
    this.settingsBreadcrumbService.setCurrentNavLinks(breadcrumbs);

    this.gridID = `${this.gridID}${this.dataType ? '-' + this.dataType : ''}`;
    this.datatableService.initGridSources(this.gridID);

    // subscribe service sort, search
    if (this.eventRequestRef) {
      this.eventRequestRef.unsubscribe();
    }

    this.eventRequestRef = this.tableService
      .listenRequestEvents(this.gridID)
      .subscribe(request => {
        const isSameAsLast =
          request.columnSort === this.previousRequest.columnSort &&
          request.sortType === this.previousRequest.sortType;

        this.request.columnSort = request.columnSort;
        this.request.sortType = request.sortType;
        this.renderData();

        this.previousRequest = request;
      });

    // subscribe event selected items of all page
    this.eventSelectedRef = this.tableService
      .listenSelectedItemsEvents(this.gridID)
      .subscribe((items: any) => {
        this.selectedItems = items;
      });

    // subscribe event selected items of current page
    this.eventPageSelectedItemsRef = this.tableService
      .listenPageSelectedItemsEvents(this.gridID)
      .subscribe((items: any) => {
        this.currentPageSelectedItems = items;

        const atLeastOneSelectedLinkedCategory = this.currentPageSelectedItems.find(
          item => item.numberOfLinkedRecords > 0
        );

        this.disabledUnlinkBtn = !exists(atLeastOneSelectedLinkedCategory);
      });

    this.renderData();
  }

  ngOnDestroy() {
    this.datatableService.clearGridSources(this.gridID);
  }

  private getBreadcrumbsByType(type) {
    const breadcrumbs: SettingsBreadcrumbInterface[] = [
      {
        url: '/',
        label: 'Home', // [i18n-tobeinternationalized]
        isCustom: false
      },
      {
        url: '/data-inventory/my-inventory',
        label: 'Settings', // [i18n-tobeinternationalized]
        isCustom: false
      }
    ];

    if (type === 'DE') {
      breadcrumbs.push({
        url: 'data-elements',
        label: 'Data Elements', // [i18n-tobeinternationalized]
        isCustom: false
      });
    }

    if (type === 'PP') {
      breadcrumbs.push({
        url: 'processing-purposes',
        label: 'Processing Purposes', // [i18n-tobeinternationalized]
        isCustom: false
      });
    }

    if (type === 'DS') {
      breadcrumbs.push({
        url: 'data-subjects',
        label: 'Data Subjects', // [i18n-tobeinternationalized]
        isCustom: false
      });
    }

    return breadcrumbs;
  }

  public getVisibilityText() {
    switch (this.selectedVisibility) {
      case 'all':
        return 'View All';

      case 'hidden':
        return 'View Hidden';

      case 'visible':
        return 'View Visible';
    }
  }

  public getCreationText() {
    switch (this.selectedCreations) {
      case 'all':
        return 'All Categories';

      case 'custom':
        return 'Custom Categories';

      case 'system':
        return 'Default Categories';
    }
  }

  public updateSelectedVisibility(option: 'all' | 'hidden' | 'visible') {
    this.selectedVisibility = option;
    this.renderData();
  }

  public updateSelectedCreation(option: 'all' | 'custom' | 'system') {
    this.selectedCreations = option;
    this.renderData();
  }

  public renderData() {
    if (this._getCategories$) {
      this._getCategories$.unsubscribe();
    }

    if (this.dataType === 'PP') {
      this.getCategoriesPP();
    } else if (this.dataType === 'DE') {
      this.getCategoriesDE();
    } else if (this.dataType === 'DS') {
      this.getCategoriesDS();
    } else {
      console.error('Unsupported data type');
    }
  }

  private getCategoriesPP() {
    this._getCategories$ = this.processingPurposeCategoriesService
      .getProcessingPurposeCategoryList(
        this.request,
        this.selectedVisibility,
        this.selectedCreations
      )
      .subscribe(result => {
        this.page = result.number;
        this.tableData = result.content;
        this.totalRows = result.totalElements;
        // Add space between Purpose Categories name before render
        this.tableData.map(category => {
          category.category = category.category;
          return category;
        });
      });
  }

  private getCategoriesDE() {
    this._getCategories$ = this.dataElementCategoriesService
      .getDataElementCategoryList(
        this.request,
        this.selectedVisibility,
        this.selectedCreations
      )
      .subscribe(result => {
        this.page = result.number;
        this.tableData = result.content;
        this.totalRows = result.totalElements;
      });
  }

  private getCategoriesDS() {
    this._getCategories$ = this.dataSubjectCategoriesService
      .getDataSubjectCategoryList(
        this.request,
        this.selectedVisibility,
        this.selectedCreations
      )
      .subscribe(result => {
        this.page = result.number;
        this.tableData = result.content;
        this.totalRows = result.totalElements;
        // Add space between Data Subject Categories name before render
        this.tableData.map(category => {
          // Map to ensure consistency across field names
          category.id = category.categoryId;
          category.category = category.categoryName;
          return category;
        });
      });
  }

  public onChangeMax(event) {
    this.maxRows = event;
    this.request.maxRows = this.maxRows;
    this.renderData();
  }

  public onChangePage(event) {
    this.request.page = event - 1;
    this.request.maxRows = this.maxRows;
    this.request.search = this.search;
    this.renderData();
  }

  private handleError(error) {
    if (error.message) {
      const message = error.error ? error.error.message : error.message;
      this.toastService.error(message);
    } else {
      this.toastService.error(
        'There was an error updating records' // [i18n-tobeinternationalized]
      );
    }
  }

  public getIconId(
    dataElement: any,
    icon: 'edit' | 'hide' | 'delete' | 'show'
  ) {
    return `${icon}-${dataElement.id}`;
  }

  public isCreateDisabled() {
    const hasSelection = this.currentPageSelectedItems.length > 0;

    return hasSelection;
  }

  public isEditDisabled() {
    const onlyOneSelected = this.currentPageSelectedItems.length === 1;

    const anySystem = this.currentPageSelectedItems.some(
      item => !item.isCustom
    );

    return !onlyOneSelected || anySystem;
  }

  public isHideDisabled() {
    const hasNoSelection = this.currentPageSelectedItems.length <= 0;

    const allVisible = !this.currentPageSelectedItems.some(
      item => item.isHidden
    );
    const allHidden = !this.currentPageSelectedItems.some(
      item => !item.isHidden
    );

    const anyLinked = this.currentPageSelectedItems.some(
      item => item.numberOfLinkedRecords > 0
    );

    const isSwappable = allVisible || allHidden;

    return hasNoSelection || anyLinked || !isSwappable;
  }

  public isDeleteDisabled() {
    const hasNoSelection = this.currentPageSelectedItems.length <= 0;

    const anySystem = this.currentPageSelectedItems.some(
      item => !item.isCustom
    );

    const anyLinked = this.currentPageSelectedItems.some(
      item => item.numberOfLinkedRecords > 0
    );

    return hasNoSelection || anySystem || anyLinked;
  }

  public hideItemClicked(item) {
    const hideDataElementCategories = () => {
      this._hideCategories$ = this.dataElementCategoriesService
        .hideDataElementCategories([item])
        .subscribe(result => {
          const hiddenState = !item.isHidden ? 'hiding' : 'unhiding';

          this.toastService.success(
            `We’re in the process of ${hiddenState} your records and will notify when we’re done!`
          );
          this.renderData();
        }, this.handleError);
    };

    const hideProcessingPurposeCategories = () => {
      this._hideCategories$ = forkJoin(
        this.processingPurposeCategoriesService.hideProcessingPurposeCategories(
          [item]
        ),
        this.processingPurposeCategoriesService.getProcessingPurposeCategoryList(
          this.request,
          this.selectedVisibility,
          this.selectedCreations
        )
      ).subscribe(result => {
        const hiddenState = !item.isHidden ? 'hiding' : 'unhiding';
        this.toastService.success(
          `We’re in the process of ${hiddenState} your records and will notify when we’re done!`
        );
        this.renderData();
      }, this.handleError);
    };

    const hideDSCategories = () => {
      this.dataSubjectCategoriesService
        .hideDataSubjectCategories([item])
        .subscribe(result => {
          if (result.updatedCategories.length) {
            const hiddenState = item.isHidden ? 'hiding' : 'unhiding';
            this.toastService.success(
              `We’re in the process of ${hiddenState} your records and will notify when we’re done!`
            );
            this.renderData();
          } else {
            this.toastService.error(
              ' Some Selected Categories could not be hidden as they are in use.'
            );
          }
        }, this.handleError);
    };

    switch (this.dataType) {
      case 'PP':
        hideProcessingPurposeCategories();
        break;
      case 'DE':
        hideDataElementCategories();
        break;
      case 'DS':
        hideDSCategories();
        break;
      default:
        hideDataElementCategories();
    }
  }

  public hideSelectedCategories() {
    if (this.isHideDisabled()) {
      return;
    }
    const hideDataElementCategories = () => {
      this._hideCategories$ = this.dataElementCategoriesService
        .hideDataElementCategories(this.currentPageSelectedItems)
        .subscribe(() => {
          this.toastService.success(
            `We’re in the process of updating your records and will notify when we’re done!`
          );
          this.renderData();
        }, this.handleError);
    };

    const hideProcessingPurposeCategories = () => {
      this._hideCategories$ = forkJoin(
        this.processingPurposeCategoriesService.hideProcessingPurposeCategories(
          this.currentPageSelectedItems
        ),
        this.processingPurposeCategoriesService.getProcessingPurposeCategoryList(
          this.request,
          this.selectedVisibility,
          this.selectedCreations
        )
      ).subscribe(() => {
        this.toastService.success(
          `We’re in the process of updating your records and will notify when we’re done!`
        );
        this.renderData();
      }, this.handleError);
    };

    const hideDataSubjectCategories = () => {
      this.dataSubjectCategoriesService
        .hideDataSubjectCategories(this.selectedItems)
        .subscribe(result => {
          if (result.updatedCategories.length) {
            this.toastService.success(
              `We’re in the process of updating your records and will notify when we’re done!`
            );

            this.renderData();
          } else {
            this.toastService.error(
              'Some Selected Categories could not be hidden as they are in use'
            );
          }
        }, this.handleError);
    };

    switch (this.dataType) {
      case 'PP':
        hideProcessingPurposeCategories();
        break;
      case 'DE':
        hideDataElementCategories();
        break;
      case 'DS':
        hideDataSubjectCategories();
        break;
      default:
        hideDataElementCategories();
    }
  }

  public unlinkSelectedCategoriesClicked() {
    const modalRef = this.modalService.open(
      ConfirmUnlinkDataElementCategoriesComponent,
      {
        windowClass: 'unlink-modal',
        centered: true
      }
    );
    const unlinkFnc = this.getUnlinkFunctionByDataType(this.dataType);

    const confirmUnlinkComponent: ConfirmUnlinkDataElementCategoriesComponent =
      modalRef.componentInstance;
    confirmUnlinkComponent.unlink = () => unlinkFnc;
    confirmUnlinkComponent.redButton = true;
    confirmUnlinkComponent.items = this.currentPageSelectedItems.map(
      item => item.category
    );

    confirmUnlinkComponent.contentStart = this.getUnlinkMessageByDataTypeForContentStart(
      this.dataType
    );
    confirmUnlinkComponent.contentEnd = '';

    this.processModalUnlink(modalRef);
  }

  private getUnlinkMessageByDataTypeForContentStart(type) {
    switch (type) {
      case 'PP':
        // [i18n-tobeinternationalized]
        return 'Are you sure you want to unlink the selected processing purpose categories from all records?';
      case 'DE':
        // [i18n-tobeinternationalized]
        return 'Are you sure you want to unlink the selected data element categories from all records?';
      case 'DS':
        // [i18n-tobeinternationalized]
        return 'Are you sure you want to unlink the selected data subject categories from all records?';
      default:
        console.error('Unsupported data type');
        return '';
    }
  }

  private getUnlinkFunctionByDataType(type) {
    switch (type) {
      case 'PP':
        return this.processingPurposeService.unlinkProcessingPurposesCategories(
          this.currentPageSelectedItems
        );
      case 'DE':
        return this.dataElementCategoriesService.unlinkDataElementCategories(
          this.currentPageSelectedItems
        );
      case 'DS':
        return this.dataSubjectService.unlinkDataSubjectsCategories(
          this.currentPageSelectedItems
        );
      default:
        console.error('Unsupported data type');
    }
  }

  private processModalUnlink(modalRef: any) {
    modalRef.result.then(
      result => {
        let categoriesUnlinkResponse;

        if (this.dataType === 'PP') {
          categoriesUnlinkResponse =
            result.processingPurposeCategoryUnlinkElementResponse;
        }
        if (this.dataType === 'DE') {
          categoriesUnlinkResponse =
            result.dataElementCategoryUnlinkElementResponse;
        }
        if (this.dataType === 'DS') {
          categoriesUnlinkResponse =
            result.dataSubjectCategoryUnlinkSubjectResponses;
        }

        if (!categoriesUnlinkResponse) {
          return this.toastService.error(
            'There was a problem while trying to unlink categories.'
          );
        }

        const unlinkedIdsSuccess = categoriesUnlinkResponse.filter(
          res => res.status === 'OK'
        );
        const unlinkedIdsUnSuccess = categoriesUnlinkResponse.filter(
          res => res.status !== 'OK'
        );

        if (unlinkedIdsUnSuccess.length > 0) {
          // [i18n-tobeinternationalized]
          this.toastService.warn(
            `Unsuccessfully unlinked ${unlinkedIdsUnSuccess.length} categories.`
          );
        }

        if (unlinkedIdsSuccess.length > 0) {
          // [i18n-tobeinternationalized]
          this.toastService.success(
            `We’re in the process of unlinking your records and will notify when we’re done!`
          );
        }
        this.renderData();
      },
      err => {
        if (err !== 'Cancel') {
          // [i18n-tobeinternationalized]
          this.handleError(err);
        }
      }
    );
  }

  public unlinkSelectedCategories() {
    this.dataElementCategoriesService
      .unlinkDataElementCategories(this.currentPageSelectedItems)
      .subscribe(() => {
        // [i18n-tobeinternationalized]
        this.toastService.success(
          `We’re in the process of unlinking your records and will notify when we’re done!`
        );
        this.renderData();
      }, this.handleError);
  }

  public deleteItemClicked(item) {
    this.deleteCategories([item]);
  }

  public deleteSelectedCategories() {
    if (this.isDeleteDisabled()) {
      return;
    }

    this.deleteCategories(this.currentPageSelectedItems);
  }

  public deleteCategories(items) {
    this.datatableService.setCurrentGridId(this.gridID);

    const modalRef = this.modalService.open(ConfirmDeleteContentComponent, {
      windowClass: 'delete-large-modal modal-white',
      centered: true
    });
    modalRef.componentInstance.isCategoryModal = true;
    modalRef.componentInstance.redButton = true;
    modalRef.componentInstance.buttonPlacement = 'right';
    modalRef.componentInstance.whiteModal = true;
    modalRef.componentInstance.dataType = this.dataType;
    modalRef.componentInstance.items = items;

    // [i18n-tobeinternationalized]
    modalRef.componentInstance.content =
      items.length === 1
        ? 'Are you sure you want to delete your custom category?'
        : 'Are you sure you want to delete your custom categories?';

    modalRef.result.then(() => {
      // [i18n-tobeinternationalized]
      const message = `We’re in the process of deleting your records and will notify when we’re done!`;
      this.toastService.success(message);

      this.renderData();
    }, this.handleError);
  }

  public openCategoryModal(item) {
    const modalRef = this.modalService.open(CustomCategoryModalComponent, {
      windowClass: 'ta-modal-custom-category'
    });

    if (exists(item)) {
      modalRef.componentInstance.categoryInfo = item;
    } else if (this.currentPageSelectedItems.length > 0) {
      modalRef.componentInstance.categoryInfo = this.currentPageSelectedItems[0];
    }
    modalRef.componentInstance.dataType = this.dataType;
    modalRef.result.then(
      success => this.renderData(),
      error => this.renderData()
    );
  }

  public openAddDataModalByType(type: 'PP' | 'DS' | 'DE') {
    let modalComponent;
    let windowClass: string;

    if (type === 'PP') {
      modalComponent = CustomProcessingPurposeModalComponent;
      windowClass = 'ta-modal-custom-processing-purpose';
    } else if (type === 'DS') {
      modalComponent = CustomDataSubjectModalComponent;
      windowClass = 'ta-modal-custom-data-subject';
    } else if (type === 'DE') {
      modalComponent = CustomDataElementModalComponent;
      windowClass = 'ta-modal-custom-element';
    }

    const modalRef = this.modalService.open(modalComponent, { windowClass });
    if (type === 'DE') {
      modalRef.componentInstance.mode = 'Adding';
    }
    if (type === 'DS') {
      modalRef.componentInstance.mode = 'creating';
    }
    if (type === 'PP') {
      modalRef.componentInstance.mode = 'creating';
    }

    modalRef.result.then(
      success => this.renderData(),
      error => this.renderData()
    );
  }

  public isAdmin() {
    return this.authService.isAdmin();
  }

  public getToggleVisibilityTooltip(): string {
    if (this.isHideDisabled()) {
      return null;
    }

    // If visibility is enabled, then there is at least one selected, and all selections have the same visilibility state.
    const isAllHidden = this.currentPageSelectedItems[0].isHidden;

    if (isAllHidden) {
      return 'Show for everyone'; // [i18n-tobeinternationalized]
    } else {
      return 'Hide from everyone'; // [i18n-tobeinternationalized]
    }
  }
}
