import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TaActiveModal } from '@trustarc/ui-toolkit';
import { TagGroupInterface } from 'src/app/shared/models/tags.model';
import { BaseDomainTypeEnum } from 'src/app/shared/models/base-domain-model';
import { BaseRecordsControllerService } from 'src/app/shared/_services/rest-api/base-records-controller/base-records-controller.service';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TagsSelectorComponent } from 'src/app/shared/components/tags-selector/tags-selector.component';
import { UtilsClass } from 'src/app/shared/_classes';

@Component({
  selector: 'ta-business-process-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit, OnDestroy {
  private _getAllTags$: Subscription;
  @Input() businessProcessId: string;
  @ViewChild(TagsSelectorComponent) tagsSelector: TagsSelectorComponent;

  public selectedTags: TagGroupInterface[] = [];
  public tagFormsGroup: FormGroup;
  public baseDomainTypeEnum = BaseDomainTypeEnum;
  public tagsCount = new BehaviorSubject<number>(0);
  public tagsCount$ = this.tagsCount.asObservable();
  public isShowingSpinner: boolean;
  public thereAreTagsBP: boolean;
  public isFetching: boolean;
  public allTags = [];

  private destruction$: Subject<void>;

  constructor(
    public activeModal: TaActiveModal,
    private formBuilder: FormBuilder,
    private baseRecordsService: BaseRecordsControllerService
  ) {
    this.destruction$ = new Subject<void>();
  }

  public ngOnInit(): void {
    this.isShowingSpinner = false;
    this.thereAreTagsBP = false;
    this.isFetching = true;
    this.tagFormsGroup = this.formBuilder.group({ placeholder: '' });
    this.validateAllTagsForBP();
    this.tagsCount.next(0);
  }

  public ngOnDestroy() {
    this.destruction$.next();
    this.destruction$.complete();
  }

  public selectedTagsChange(selectedTags: TagGroupInterface[]) {
    this.selectedTags = selectedTags;
    const count = this.getTagsCount(this.selectedTags);
    this.tagsCount.next(count);
    this.tagFormsGroup.markAsDirty();
  }

  public saveTags(): void {
    const tags = this.tagsSelector.extractTagsFromFormControls();
    this.isShowingSpinner = true;
    this.baseRecordsService
      .putTags(this.businessProcessId, tags)
      .pipe(takeUntil(this.destruction$))
      .subscribe(
        res => {
          this.closeModal(this.getTagsCount(tags));
          this.isShowingSpinner = false;
          this.baseRecordsService.versionAfterUpdateTags.next(res.version);
        },
        err => {
          console.error(err);
          this.isShowingSpinner = false;
        }
      );
  }

  public closeModal(count: number) {
    count = count === 0 ? this.selectedTags.length : count;
    this.activeModal.close(count);
  }

  public onCancel() {
    this.activeModal.dismiss();
  }

  public dismissModal() {
    this.activeModal.dismiss();
  }

  public validateAllTagsForBP(): void {
    UtilsClass.unSubscribe(this._getAllTags$);
    this._getAllTags$ = this.baseRecordsService
      .getAllTags(BaseDomainTypeEnum.BusinessProcess, true)
      .pipe(takeUntil(this.destruction$))
      .subscribe(
        res => {
          if (res.length > 0) {
            this.isFetching = false;
            this.thereAreTagsBP = true;
            this.allTags = res;
          }
        },
        err => {
          console.error(err);
          this.isFetching = false;
          this.isShowingSpinner = false;
        }
      );
  }

  private getTagsCount(tags): number {
    return tags.length > 0
      ? tags.reduce((aa, tag) => {
          return (aa += tag.values.length);
        }, 0)
      : 0;
  }
}
