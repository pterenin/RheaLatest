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
import { DataElementsService } from '../../services/data-elements/data-elements.service';
import {
  DataElementCategoryInterface,
  DataElementType
} from '../../models/data-elements.model';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AutoUnsubscribe } from '../../decorators/auto-unsubscribe/auto-unsubscribe.decorator';

declare const _: any;

@AutoUnsubscribe([
  '_getSearchedCategoriesSubscription$',
  '_retrieveCategoriesSubscription$',
  '_customDataElementRequest$'
])
@Component({
  selector: 'ta-custom-data-element-modal',
  templateUrl: './custom-data-element-modal.component.html',
  styleUrls: ['./custom-data-element-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CustomDataElementModalComponent implements OnInit, OnDestroy {
  public customElementForm: FormGroup;

  @Input() public redirectModalOnSubmit: boolean;
  @Input() public preSelectedName: string;
  @Input() public preSelectedType: DataElementType;
  @Input() public preSelectedCategory: DataElementCategoryInterface;
  @Input() public mode: 'Adding' | 'Editing';
  @Input() public id;

  public name = new FormControl('', Validators.required);
  public level = new FormControl('', Validators.required);
  public category = new FormControl('', Validators.required);
  public levelList: string[] = [];
  public categories: DataElementCategoryInterface[] = [];
  public categoryOptionList = [];
  public dataClassificationLevels: string[] = [
    // tslint:disable-next-line: max-line-length
    'Public: Any data that have been expressly made public through reporting, disclosures required by law or regulation, or as expressly authorized by the individual or organization to whom those data relate.', // [i18n-tobeinternationalized]
    // tslint:disable-next-line: max-line-length
    'Confidential: Personal Information that is protected by privacy and data protection laws and for which the loss, misuse or unauthorized access, disclosure, alteration or destruction is likely to result in a low to medium risk for the individuals to whom those data relate and to the organizations that process those data.', // [i18n-tobeinternationalized]
    // tslint:disable-next-line: max-line-length
    'Sensitive: Personal Information that either is subject to additional protection or obligations under certain privacy and data protection laws or for which the loss, misuse or unauthorized access, disclosure, alteration or destruction is likely to result in a high risk for the individuals to whom those data relate and to the organizations that process those data.', // [i18n-tobeinternationalized]
    // tslint:disable-next-line: max-line-length
    'Special Categories: Data categories that are specifically recognized under Article 9 and Recital 51 of the EU General Data Protection Regulation as potentially creating significant risks for the fundamental rights and freedoms of individuals.' // [i18n-tobeinternationalized]
  ];

  $scrollListChange: Subject<void> = new Subject<void>();

  private _getSearchedCategoriesSubscription$: Subscription;
  private _retrieveCategoriesSubscription$: Subscription;
  private _customDataElementRequest$: Subscription;
  private endOfListReached = false;
  private currentPage = 0;
  private loadingList = false;
  private totalCategoriesInList = 0;
  private categoryBuffer = 33;
  private lastEndIndex = 0;
  private currentEndIndex = 0;

  constructor(
    public activeModal: TaActiveModal,
    private formBuilder: FormBuilder,
    private dataElementService: DataElementsService,
    private toastService: ToastService
  ) {
    this.redirectModalOnSubmit = false;
    this.customElementForm = this.formBuilder.group({
      name: this.name,
      level: this.level,
      category: this.category
    });
  }

  ngOnInit() {
    this.category.setValue(this.preSelectedCategory);
    this.level.setValue(this.preSelectedType);
    this.name.setValue(this.preSelectedName);

    this.retrieveCategories();

    this.dataElementService.getAllClassificationLevel().subscribe(levelList => {
      const sortOrder = this.dataClassificationLevels.map(x =>
        x.substring(0, x.indexOf(':'))
      );
      // no description provided for 'User Determined', manually adding
      sortOrder.push('User Determined'); // [i18n-tobeinternationalized]

      // data classification level drop down sorting as display order in description on right
      this.levelList = levelList.dataElementTypes.sort((a, b) =>
        sortOrder.indexOf(a) > sortOrder.indexOf(b) ? 1 : -1
      );
    });

    this._getSearchedCategoriesSubscription$ = this.$scrollListChange
      .pipe(debounceTime(500))
      .subscribe(() => {
        const hasReachedBufferPoint =
          this.currentEndIndex &&
          this.currentEndIndex >=
            this.totalCategoriesInList - this.categoryBuffer &&
          this.currentEndIndex >= this.lastEndIndex;

        this.lastEndIndex = this.currentEndIndex;

        if (this.categories.length < 20) {
          this.endOfListReached = true;
        }

        if (
          hasReachedBufferPoint &&
          !this.loadingList &&
          !this.endOfListReached
        ) {
          this.currentPage++;
          this.retrieveCategories();
        }
      });
  }

  ngOnDestroy() {}

  public closeModal() {
    this.activeModal.dismiss('Cross click');
  }

  public onSubmit() {
    if (this._customDataElementRequest$) {
      this._customDataElementRequest$.unsubscribe();
    }

    const dataElementId = this.mode === 'Adding' ? null : this.id;

    const customDataElementToSave = this.dataElementService.mapToCustomDataElement(
      this.customElementForm.value,
      dataElementId
    );

    const saveAction =
      this.mode === 'Adding'
        ? this.dataElementService.createCustomDataElement(
            customDataElementToSave
          )
        : this.dataElementService.updateCustomDataElement(
            customDataElementToSave
          );

    this._customDataElementRequest$ = saveAction.subscribe(
      () => {
        this.activeModal.close();
      },
      error => {
        // <!--- [i18n-tobeinternationalized] --->
        if (error.error && error.error.message) {
          this.toastService.error(error.error.message);
        } else {
          this.toastService.error(
            'A data element with this name already exists.'
          );
        }
        this.activeModal.dismiss('');
      }
    );
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

    const newOpts = categories;

    this.categoryOptionList = this.categoryOptionList.concat(newOpts);
    this.categoryOptionList = _.uniqBy(this.categoryOptionList, 'id');
  }

  private retrieveCategories() {
    if (this._retrieveCategoriesSubscription$) {
      this._retrieveCategoriesSubscription$.unsubscribe();
    }
    this.loadingList = true;

    this._retrieveCategoriesSubscription$ = this.dataElementService
      .getAllCategories(this.currentPage, true)
      .subscribe(
        categories => {
          this.updateOptionsListWithResponse(categories);
          this.loadingList = false;
        },
        error => {
          console.log(
            `There was error retrieving page ${this.currentPage} of data element categories`
          );
          this.loadingList = false;
        }
      );
  }

  public onLevelTouched() {
    this.level.updateValueAndValidity();
    this.level.markAsTouched();
  }
}
