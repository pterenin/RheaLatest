import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  TableService,
  TaModal,
  TaTableRequest,
  ToastService
} from '@trustarc/ui-toolkit';

import { Subscription } from 'rxjs';
import { AutoUnsubscribe } from 'src/app/shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { getRouteParamObservable } from 'src/app/shared/utils/route-utils';
import { formatCategoryLabel } from 'src/app/shared/utils/basic-utils';

import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { DatatableService } from 'src/app/shared/services/record-listing/datatable.service';
import { SettingsBreadcrumbService } from 'src/app/shared/components/settings-breadcrumb/settings-breadcrumb.service';

import { DataElementsService } from 'src/app/shared/services/data-elements/data-elements.service';
import { ProcessingPurposesService } from '../../../services/processing-purposes/processing-purposes.service';
import { ProcessingPurposeCategoriesService } from '../../../services/processing-purpose-categories/processing-purpose-categories.service';
import { DataSubjectCategoriesService } from '../../../services/data-subject-categories/data-subject-categories.service';
import { DataSubjectsService } from '../../../services/data-subjects/data-subjects.service';
// tslint:disable-next-line:max-line-length
import { ConfirmDeleteContentComponent } from 'src/app/shared/components/record-datagrid/confirm-delete-content/confirm-delete-content.component';
// tslint:disable-next-line:max-line-length
import { ConfirmUnlinkDataElementCategoriesComponent } from 'src/app/shared/components/confirm-unlink-data-element-categories/confirm-unlink-data-element-categories.component';

import { DataElementCategoryInterface } from 'src/app/shared/models/data-elements.model';
import { HighRiskFactorsCategoryInterface } from '../../../models/high-risk.model';
import { DataElementSettingsInterface } from '../../../../settings/data-elements/custom-data-elements.model';
import { SettingsBreadcrumbInterface } from 'src/app/shared/models/settings-breadcrumb.model';
import {
  ProcessingPurposeCategoryInterface,
  ProcessingPurposeSettingsInterface
} from '../../../models/processing-purposes.model';
import {
  DataSubjectCategoryInterface,
  DataSubjectSettingsInterface
} from '../../../models/data-subjects.model';

import { CustomDataElementModalComponent } from 'src/app/shared/components/custom-data-element-modal/custom-data-element-modal.component';
import { CustomDataSubjectModalComponent } from '../../custom-data-subject-modal/custom-data-subject-modal.component';
import { CustomProcessingPurposeModalComponent } from '../../custom-processing-purpose-modal/custom-processing-purpose-modal.component';

@AutoUnsubscribe([
  '_listenRequestEvents$',
  '_listenPageSelectedItemsEvents$',
  '_getItemSettingsByCategory$',
  '_paramMap$'
])
@Component({
  selector: 'ta-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit, OnDestroy {
  public static MAX_ROWS_DEFAULT = 25;
  public static PAGE_NUMBER_DEFAULT = 0;

  @Input() public dataType: 'PP' | 'DE' | 'DS';

  public gridId = 'data-element-category-table';
  public iconColor = '#0052cc';

  public tableData: any[];
  public totalRows: number;
  public categoryDetails;
  public itemTypeName: string;

  public request: TaTableRequest;
  public categoryId: string;
  public selectedVisibility: 'visible' | 'hidden' | 'all' = 'all';
  public selectedCreations: 'custom' | 'system' | 'all' = 'all';

  public currentPageSelectedItems: DataElementSettingsInterface[] = [];

  public disabledUnlinkBtn = true;
  private _listenRequestEvents$: Subscription;
  private _listenPageSelectedItemsEvents$: Subscription;
  private _getItemSettingsByCategory$: Subscription;
  private _paramMap$: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dataElementsService: DataElementsService,
    private datatableService: DatatableService,
    private modalService: TaModal,
    private settingsBreadcrumbService: SettingsBreadcrumbService,
    private tableService: TableService,
    private toastService: ToastService,
    private authService: AuthService,
    private processingPurposeCategoryService: ProcessingPurposeCategoriesService,
    private processingPurposeService: ProcessingPurposesService,
    private dataSubjectCategoriesService: DataSubjectCategoriesService,
    private dataSubjectService: DataSubjectsService
  ) {
    this.categoryId = null;
    this.totalRows = 0;

    this.request = {
      page: CategoryComponent.PAGE_NUMBER_DEFAULT,
      maxRows: CategoryComponent.MAX_ROWS_DEFAULT
    };
    this.tableData = [];

    this._listenRequestEvents$ = null;
    this._listenPageSelectedItemsEvents$ = null;
    this.handleError = this.handleError.bind(this);
  }

  ngOnInit(): void {
    // Set initial breadcrumbs
    const breadcrumbs = this.getBreadcrumbsByType(this.dataType);
    this.settingsBreadcrumbService.setCurrentNavLinks(breadcrumbs);

    this.datatableService.initGridSources(this.gridId);
    this.tableService.clearAllSelected(this.gridId);

    this._paramMap$ = getRouteParamObservable(
      this.activatedRoute.paramMap,
      'categoryId'
    ).subscribe(id => {
      this.categoryId = id;
      this.request.page = CategoryComponent.PAGE_NUMBER_DEFAULT;
      this.renderData();
    });

    // subscribe event selected items of current page
    this._listenPageSelectedItemsEvents$ = this.tableService
      .listenPageSelectedItemsEvents(this.gridId)
      .subscribe((items: any) => {
        this.currentPageSelectedItems = items;
        const categoryLinked = this.currentPageSelectedItems.find(
          item => item.numberOfLinkedRecords !== 0
        );
        this.disabledUnlinkBtn =
          this.currentPageSelectedItems.length === 0 || !categoryLinked;
      });

    // subscribe service sort, search
    this._listenRequestEvents$ = this.tableService
      .listenRequestEvents(this.gridId)
      .subscribe(newRequest => {
        if (
          newRequest.columnSort !== this.request.columnSort ||
          newRequest.sortType !== this.request.sortType
        ) {
          this.request.columnSort = newRequest.columnSort;
          this.request.sortType = newRequest.sortType;
          this.renderData();
        }
      });

    // Generate item type name
    this.itemTypeName = this.getItemTypeNameByDataType(this.dataType);
  }

  ngOnDestroy(): void {
    this.datatableService.clearGridSources(this.gridId);
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
      const items = [
        {
          url: '/settings/data-elements',
          label: 'Data Elements', // [i18n-tobeinternationalized]
          isCustom: false
        }
      ];

      breadcrumbs.push(...items);
    }

    if (type === 'PP') {
      const items = [
        {
          url: '/settings/processing-purposes',
          label: 'Processing Purposes', // [i18n-tobeinternationalized]
          isCustom: false
        }
      ];

      breadcrumbs.push(...items);
    }

    if (type === 'DS') {
      const items = [
        {
          url: '/settings/data-subjects',
          label: 'Data Subjects', // [i18n-tobeinternationalized]
          isCustom: false
        }
      ];

      breadcrumbs.push(...items);
    }

    return breadcrumbs;
  }

  private getItemTypeNameByDataType(type: 'PP' | 'DS' | 'DE') {
    if (type === 'PP') {
      return 'Processing Purpose';
    } else if (type === 'DS') {
      return 'Data Subject';
    } else if (type === 'DE') {
      return 'Data Element';
    } else {
      console.error('Unsupported data type.');
    }
  }

  public onChangeMax(event) {
    this.request.maxRows = event;
    this.renderData();
  }

  public onChangePage(event): void {
    if (this.request.page !== event - 1) {
      // Only refresh the list if the page changes.
      this.request.page = event - 1;
      // this.request.search = this.search;
      this.renderData();
    }
  }

  public getMaxRows(): number {
    return this.request.maxRows;
  }

  public getTotalRows(): number {
    return this.totalRows;
  }

  public getPage(): number {
    return this.request.page + 1;
  }

  public getIconId(
    dataElement: DataElementSettingsInterface,
    icon: 'edit' | 'hide' | 'delete' | 'show'
  ): string {
    return `${icon}-${dataElement.id}`;
  }

  public renderData(): void {
    if (this._getItemSettingsByCategory$) {
      this._getItemSettingsByCategory$.unsubscribe();
    }

    switch (this.dataType) {
      case 'PP':
        this.getCategoriesPP();
        break;
      case 'DE':
        this.getCategoriesDE();
        break;
      case 'DS':
        this.getCategoriesDS();
        break;
      default:
        console.error('Unsupported data type');
        return;
    }
  }

  private getCategoriesDS() {
    this.dataSubjectCategoriesService
      .getDataSubjectSettingsByCategory(
        this.request,
        this.categoryId,
        this.selectedVisibility,
        this.selectedCreations
      )
      .subscribe((result: any) => {
        this.request.page = result.dataSubjects.number;
        this.tableData = result.dataSubjects.content;
        this.totalRows = result.dataSubjects.totalElements;
        this.categoryDetails = {
          id: result.categoryId,
          categoryId: result.categoryId,
          categoryName: result.categoryName,
          categoryLabel: formatCategoryLabel(result.categoryName),
          isCustom: result.isCustom
        };

        this.tableData.forEach(row => {
          row.numberOfLinkedRecords = row.numberOfLinkedRecords || 0;
          row.name = row.dataSubject;
        });

        const breadcrumbs: SettingsBreadcrumbInterface[] = this.getBreadcrumbsByType(
          this.dataType
        );
        breadcrumbs.push({
          url: `/settings/data-subjects/categories/${this.categoryId}`,
          label: this.categoryDetails.categoryName,
          isCustom: this.categoryDetails.isCustom
        });

        this.settingsBreadcrumbService.setCurrentNavLinks(breadcrumbs);
      });
  }

  private getCategoriesDE() {
    this._getItemSettingsByCategory$ = this.dataElementsService
      .getDataElementsSettingsByCategory(
        this.request,
        this.categoryId,
        this.selectedVisibility,
        this.selectedCreations
      )
      .subscribe(result => {
        this.request.page = result.dataElements.number;
        this.tableData = result.dataElements.content;
        this.totalRows = result.dataElements.totalElements;
        this.categoryDetails = result.categoryDetails;

        const breadcrumbs: SettingsBreadcrumbInterface[] = this.getBreadcrumbsByType(
          this.dataType
        );
        breadcrumbs.push({
          url: `/settings/data-elements/categories/${this.categoryId}`,
          label: this.categoryDetails.categoryName,
          isCustom: this.categoryDetails.isCustom
        });

        this.settingsBreadcrumbService.setCurrentNavLinks(breadcrumbs);
      });
  }

  private getCategoriesPP() {
    this._getItemSettingsByCategory$ = this.processingPurposeCategoryService
      .getProcessingPurposeSettingsByCategory(
        this.request,
        this.categoryId,
        this.selectedVisibility,
        this.selectedCreations
      )
      .subscribe(result => {
        this.request.page = result.processingPurposes.number;
        this.tableData = result.processingPurposes.content;
        this.totalRows = result.processingPurposes.totalElements;
        this.categoryDetails = result.categoryDetails;

        this.categoryDetails.categoryLabel = formatCategoryLabel(
          this.categoryDetails.categoryName
        );

        const breadcrumbs: SettingsBreadcrumbInterface[] = this.getBreadcrumbsByType(
          this.dataType
        );
        breadcrumbs.push({
          url: `/settings/processing-purposes/categories/${this.categoryId}`,
          label: this.categoryDetails.categoryLabel,
          isCustom: this.categoryDetails.isCustom
        });

        this.settingsBreadcrumbService.setCurrentNavLinks(breadcrumbs);
      });
  }

  public getToggleVisibilityTooltip(): string {
    if (this.isToggleVisibilityDisabled()) {
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

  public getVisibilityText(): string {
    switch (this.selectedVisibility) {
      case 'all':
        return 'View All'; // [i18n-tobeinternationalized]

      case 'hidden':
        return 'View Hidden'; // [i18n-tobeinternationalized]

      case 'visible':
        return 'View Visible'; // [i18n-tobeinternationalized]
    }
  }

  public getCreationText(): string {
    switch (this.selectedCreations) {
      case 'all':
        return `All ${this.itemTypeName}`; // [i18n-tobeinternationalized]

      case 'custom':
        return `Custom ${this.itemTypeName}`; // [i18n-tobeinternationalized]

      case 'system':
        return `Default ${this.itemTypeName}`; // [i18n-tobeinternationalized]
    }
  }

  public updateSelectedVisibility(option: 'all' | 'hidden' | 'visible'): void {
    this.selectedVisibility = option;
    this.renderData();
  }

  public updateSelectedCreation(option: 'all' | 'custom' | 'system'): void {
    this.selectedCreations = option;
    this.renderData();
  }

  public isEditDisabled(): boolean {
    const isOnlyOneSelected =
      this.currentPageSelectedItems &&
      this.currentPageSelectedItems.length === 1;

    const isOnlyOneCustom =
      isOnlyOneSelected && this.currentPageSelectedItems[0].isCustom;

    return !isOnlyOneCustom;
  }

  public isToggleVisibilityDisabled(): boolean {
    const hasNoSelection = this.currentPageSelectedItems.length <= 0;
    const isAnyOneHidden = this.currentPageSelectedItems.some(
      item => item.isHidden
    );
    const isAnyOneVisible = this.currentPageSelectedItems.some(
      item => !item.isHidden
    );
    const isMixedHiddenAndVisible = isAnyOneHidden && isAnyOneVisible;

    const isAnyOneLinked = this.currentPageSelectedItems.some(
      item => item.numberOfLinkedRecords > 0
    );

    return hasNoSelection || isMixedHiddenAndVisible || isAnyOneLinked;
  }

  public toggleVisibilityForSelectedCustomItems(): void {
    if (this.isToggleVisibilityDisabled()) {
      return;
    }

    switch (this.dataType) {
      case 'PP':
        this.toggleVisibilityForProcessingPurposes(
          this.currentPageSelectedItems
        );
        break;
      case 'DE':
        this.toggleVisibilityForDataElements(this.currentPageSelectedItems);
        break;
      case 'DS':
        this.toggleVisibilityForDataSubjects(this.currentPageSelectedItems);
        break;
      default:
        this.toggleVisibilityForDataElements(this.currentPageSelectedItems);
    }
  }

  private toggleVisibilityForDataSubjects(selectedItems) {
    const hiddenState = selectedItems[0].isHidden ? 'unhiding' : 'hiding';
    this.dataSubjectService.putToggleVisibility(selectedItems).subscribe(() => {
      this.toastService.success(
        `We’re in the process of ${hiddenState} your records and will notify when we’re done!`
      );
      this.renderData();
    }, this.handleError);
  }

  public toggleVisibilityForCustomItem(customItem) {
    switch (this.dataType) {
      case 'PP':
        this.toggleVisibilityForProcessingPurposes([customItem]);
        break;
      case 'DE':
        this.toggleVisibilityForDataElements([customItem]);
        break;
      case 'DS':
        this.toggleVisibilityForDataSubjects([customItem]);
        break;
      default:
        this.toggleVisibilityForDataElements([customItem]);
    }
  }

  public toggleVisibilityForProcessingPurposes(ppItems) {
    const hiddenState = ppItems[0].isHidden ? 'unhiding' : 'hiding';
    this.processingPurposeService.putToggleVisibility(ppItems).subscribe(() => {
      this.toastService.success(
        `We’re in the process of ${hiddenState} your records and will notify when we’re done!`
      );
      this.renderData();
    }, this.handleError);
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
    this.renderData();
  }

  public toggleVisibilityForDataElements(
    dataElements: DataElementSettingsInterface[]
  ): void {
    const dataElementIds = dataElements.map(item => item.id);

    this.dataElementsService
      .toggleDataElements(dataElementIds)
      .subscribe(() => {
        const hiddenState = !dataElements[0].isHidden ? 'hiding' : 'unhiding';
        this.toastService.success(
          // [i18n-tobeinternationalized]
          `We’re in the process of ${hiddenState} your records and will notify when we’re done!`
        );
        this.renderData();
      }, this.handleError);
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

  public deleteSelectedItems() {
    if (this.isDeleteDisabled()) {
      return;
    }
    this.deleteItems(this.currentPageSelectedItems);
  }

  public deleteItem(item) {
    this.deleteItems([item]);
  }

  public deleteItems(items) {
    if (!items || items.length === 0) {
      return;
    }

    const modalRef = this.modalService.open(ConfirmDeleteContentComponent, {
      windowClass: 'delete-large-modal modal-white',
      centered: true
    });
    modalRef.componentInstance.redButton = true;
    modalRef.componentInstance.isCategoryModal = true;
    modalRef.componentInstance.buttonPlacement = 'right';
    modalRef.componentInstance.whiteModal = true;
    modalRef.componentInstance.items = items;
    modalRef.componentInstance.dataType = this.dataType;
    modalRef.componentInstance.target = 'ELEMENT';

    if (this.dataType === 'PP') {
      // [i18n-tobeinternationalized]
      modalRef.componentInstance.content =
        'Are you sure you want to delete your custom processing purpose?';
    } else if (this.dataType === 'DE') {
      // [i18n-tobeinternationalized]
      modalRef.componentInstance.content =
        'Are you sure you want to delete your custom data element?';
    } else if (this.dataType === 'DS') {
      // [i18n-tobeinternationalized]
      modalRef.componentInstance.content =
        'Are you sure you want to delete your custom data subject?';
    } else {
      // Do nothing
      return;
    }

    modalRef.result.then(success => {
      this.toastService.success(
        // [i18n-tobeinternationalized]
        `We’re in the process of deleting your records and will notify when we’re done!`
      );
      this.renderData();
    }, this.handleError);
  }

  public onEdit(element) {
    if (this.dataType === 'PP') {
      return this.onEditProcessingPurpose(element);
    } else if (this.dataType === 'DE') {
      return this.onEditDataElement(element);
    } else if (this.dataType === 'DS') {
      return this.onEditDataSubject(element);
    } else {
      return;
    }
  }

  public onEditProcessingPurpose(element: ProcessingPurposeSettingsInterface) {
    const modalRef = this.modalService.open(
      CustomProcessingPurposeModalComponent,
      {
        windowClass: 'ta-modal-custom-processing-purpose'
      }
    );
    const modalComponent = modalRef.componentInstance as CustomProcessingPurposeModalComponent;

    modalComponent.mode = 'updating';
    modalComponent.ppIdToUpdate = element.id;
    modalComponent.version = element.version;
    modalComponent.preSelectedName = element.name;
    modalComponent.preSelectedCategory = {
      id: this.categoryDetails.id,
      category: this.categoryDetails.categoryName,
      label: this.categoryDetails.categoryLabel
    } as ProcessingPurposeCategoryInterface;

    modalComponent.preSelectedFactors = element.highRiskFactorCategories as HighRiskFactorsCategoryInterface[];

    modalRef.result.then(result => this.renderData(), this.handleError);
  }

  public onEditDataElement(element: DataElementSettingsInterface) {
    const modalRef = this.modalService.open(CustomDataElementModalComponent, {
      windowClass: 'ta-modal-custom-element'
    });
    const modalComponent = modalRef.componentInstance as CustomDataElementModalComponent;

    modalComponent.preSelectedName = element.name;
    modalComponent.preSelectedType = element.dataElementType;
    modalComponent.preSelectedCategory = {
      id: this.categoryDetails.categoryId,
      category: this.categoryDetails.categoryName
    } as DataElementCategoryInterface;
    modalComponent.id = element.id;
    modalComponent.mode = 'Editing';

    modalRef.result.then(
      result => this.renderData(),
      error => this.renderData()
    );
  }

  public onEditDataSubject(element: DataSubjectSettingsInterface) {
    const modalRef = this.modalService.open(CustomDataSubjectModalComponent, {
      windowClass: 'ta-modal-custom-data-subject'
    });
    const modalComponent = modalRef.componentInstance as CustomDataSubjectModalComponent;

    modalComponent.mode = 'updating';
    modalComponent.dsIdToUpdate = element.id;
    modalComponent.version = element.version;
    modalComponent.preSelectedName = element.name;
    modalComponent.preSelectedHighRisk = element.highRisk;
    modalComponent.preSelectedCategory = {
      id: this.categoryDetails.categoryId,
      categoryId: this.categoryDetails.categoryId,
      category: this.categoryDetails.categoryName,
      label: this.categoryDetails.categoryLabel
    } as DataSubjectCategoryInterface;

    modalRef.result.then(
      result => this.renderData(),
      error => this.renderData()
    );
  }

  public addNewElementByType(type: 'PP' | 'DS' | 'DE') {
    if (type === 'DE') {
      this.addNewDataElement();
    } else if (type === 'DS') {
      this.addNewDataSubject();
    } else if (type === 'PP') {
      this.addNewProcessingPurpose();
    } else {
      console.error('Unsupported data type.');
    }
  }

  public addNewDataElement() {
    const modalRef = this.modalService.open(CustomDataElementModalComponent, {
      windowClass: 'ta-modal-custom-element'
    });
    const modalComponent = modalRef.componentInstance as CustomDataElementModalComponent;

    modalComponent.preSelectedCategory = {
      id: this.categoryDetails.categoryId,
      category: this.categoryDetails.categoryName
    } as DataElementCategoryInterface;

    modalComponent.mode = 'Adding';

    modalRef.result.then(
      success => this.renderData(),
      error => this.renderData()
    );
  }

  public addNewProcessingPurpose() {
    const modalRef = this.modalService.open(
      CustomProcessingPurposeModalComponent,
      {
        windowClass: 'ta-modal-custom-processing-purpose'
      }
    );
    const modalComponent = modalRef.componentInstance as CustomProcessingPurposeModalComponent;

    modalComponent.mode = 'creating';
    modalComponent.preSelectedCategory = {
      id: this.categoryDetails.id,
      category: this.categoryDetails.categoryName,
      label: this.categoryDetails.categoryLabel
    } as ProcessingPurposeCategoryInterface;

    modalRef.result.then(
      success => this.renderData(),
      error => this.renderData()
    );
  }

  public addNewDataSubject() {
    const modalRef = this.modalService.open(CustomDataSubjectModalComponent, {
      windowClass: 'ta-modal-custom-data-subject'
    });
    const modalComponent = modalRef.componentInstance as CustomDataSubjectModalComponent;

    modalComponent.preSelectedCategory = {
      id: this.categoryDetails.categoryId,
      categoryId: this.categoryDetails.categoryId,
      category: this.categoryDetails.categoryName,
      label: this.categoryDetails.categoryLabel
    } as DataSubjectCategoryInterface;

    modalComponent.mode = 'creating';

    modalRef.result.then(
      success => this.renderData(),
      error => this.renderData()
    );
  }

  public isAdmin() {
    return this.authService.isAdmin();
  }

  public getRiskLabel(item) {
    if (item.highRiskFactorCategories.length === 0) {
      return 'No Risk';
    } else if (item.highRiskFactorCategories.length === 1) {
      return 'Risk';
    }
    return 'High Risk';
  }

  public unlinkSelectedItems() {
    const itemIds = this.currentPageSelectedItems.map(item => item.id);

    const modalRef = this.modalService.open(
      ConfirmUnlinkDataElementCategoriesComponent,
      {
        windowClass: 'unlink-modal',
        centered: true
      }
    );
    const confirmUnlinkComponent: ConfirmUnlinkDataElementCategoriesComponent =
      modalRef.componentInstance;
    modalRef.componentInstance.items = this.currentPageSelectedItems;

    const unlinkFnc = this.getUnlinkFunctionByDataType(this.dataType, itemIds);

    confirmUnlinkComponent.unlink = () => unlinkFnc;
    confirmUnlinkComponent.redButton = true;
    confirmUnlinkComponent.items = this.currentPageSelectedItems.map(
      item => item.name
    );

    confirmUnlinkComponent.contentStart = this.getUnlinkMessageByDataTypeForContentStart(
      this.dataType
    );
    confirmUnlinkComponent.contentEnd = '';

    modalRef.result.then(
      result => {
        const message = this.getUnlinkSuccessMessageByDataType();
        this.toastService.success(message);
        this.renderData();
      },
      err => {
        if (err !== 'Cancel') {
          const errorMessage =
            err.message || this.getUnlinkErrorMessageByDataType(this.dataType);

          this.toastService.error(errorMessage);
          this.renderData();
        } else {
          // Do nothing, modal was just closed
        }
      }
    );
  }

  private getUnlinkFunctionByDataType(type, ids) {
    switch (type) {
      case 'PP':
        return this.processingPurposeService.unlinkProcessingPurposes(ids);
      case 'DE':
        return this.dataElementsService.unlinkDataElements(ids);
      case 'DS':
        return this.dataSubjectService.unlinkDataSubjects(ids);
      default:
        console.error('Unsupported data type');
    }
  }

  private getUnlinkMessageByDataTypeForContentStart(type) {
    switch (type) {
      case 'PP':
        // [i18n-tobeinternationalized]
        return 'Are you sure you want to unlink the selected processing purpose(s) from all records?';
      case 'DE':
        // [i18n-tobeinternationalized]
        return 'Are you sure you want to unlink the selected data element(s) from all records?';
      case 'DS':
        // [i18n-tobeinternationalized]
        return 'Are you sure you want to unlink the selected data subject(s) from all records?';
      default:
        console.error('Unsupported data type');
        return '';
    }
  }

  private getUnlinkSuccessMessageByDataType() {
    return `We’re in the process of unlinking your records and will notify when we’re done!`;
  }

  private getUnlinkErrorMessageByDataType(type) {
    switch (type) {
      case 'PP':
        // [i18n-tobeinternationalized]
        return 'There was a problem while trying to unlink processing purposes.';
      case 'DE':
        // [i18n-tobeinternationalized]
        return 'There was a problem while trying to unlink data elements.';
      case 'DS':
        // [i18n-tobeinternationalized]
        return 'There was a problem while trying to unlink data subjects.';
      default:
        console.error('Unsupported data type');
        return '';
    }
  }
}
