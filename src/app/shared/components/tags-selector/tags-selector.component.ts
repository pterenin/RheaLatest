import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {
  ControlContainer,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { createFormGroup, setFormArrayControls } from '../../utils/form-utils';
import { BaseDomainTypeEnum } from '../../models/base-domain-model';
import { Observable, of, Subject, Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  mergeMap,
  delay,
  tap
} from 'rxjs/operators';
import { TagGroupInterface, TagInterface } from '../../models/tags.model';
import { TagsSelectorService } from './tags-selector.service';
import { AutoUnsubscribe } from 'src/app/shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { UserService } from 'src/app/shared/services/user/user.service';

declare const _: any;

@AutoUnsubscribe(['_getSearchedUsersSubscription$'])
@Component({
  selector: 'ta-tags-selector',
  templateUrl: './tags-selector.component.html',
  styleUrls: ['./tags-selector.component.scss']
})
export class TagsSelectorComponent implements OnInit, OnDestroy {
  @ViewChild('dropdownHierarchyRef') dropdownHierarchyRef: any;
  @Output() selectedTagsChange = new EventEmitter<TagGroupInterface[]>();

  private _baseDomainId: string;

  private endOfListReached = false;
  private currentUserPage = 0;
  private loadingList = false;

  private userBuffer = 33;
  private lastEndIndex = 0;
  private isLoadingTags = false;

  private currentSearchTerm = '';
  private _getSearchedUsersSubscription$: Subscription;

  @Input() thereAreTagsBP = false;
  @Input() set baseDomainId(newBaseDomainId: string) {
    this._baseDomainId = newBaseDomainId;
    if (this._baseDomainId && !this.isLoadingTags) {
      this.getSelectedTags().subscribe();
    }
  }
  get baseDomainId(): string {
    return this._baseDomainId;
  }

  private _baseDomainType: BaseDomainTypeEnum;
  @Input() set baseDomainType(newBaseDomainType: BaseDomainTypeEnum) {
    this._baseDomainType = newBaseDomainType;
    if (!this.thereAreTagsBP) {
      this.getTags().subscribe();
    }
  }
  get baseDomainType(): BaseDomainTypeEnum {
    return this._baseDomainType;
  }

  @Input() preselectedTags: TagGroupInterface[] = [];

  /**
   * Last element in list will be set placement is "top-left"
   */
  @Input() lastElementPlacementTop = false;
  @Input() allTags: TagGroupInterface[] = [];

  selectedTags: TagGroupInterface[] = [];
  userTags: TagInterface[] = [];

  tagGroupFormArray: FormArray;
  tagGroupFormGroup: FormGroup;
  searchTextChanged = new Subject<string>();

  constructor(
    private controlContainer: ControlContainer,
    private formBuilder: FormBuilder,
    private tagsSelectorService: TagsSelectorService,
    private userService: UserService
  ) {
    this.tagGroupFormArray = this.formBuilder.array([]);

    this.tagGroupFormArray.valueChanges.subscribe(val => {
      const selectedTags = this.extractTagsFromFormControls();
      this.selectedTagsChange.emit(selectedTags);
    });
  }

  public debounceSearch(searchTerm: string) {
    this.searchTextChanged.next(searchTerm);
  }

  ngOnInit() {
    if (!this.isLoadingTags) {
      this.getSelectedTags()
        .pipe(delay(1500))
        .subscribe(() => this.updateFormFields());
    }
    this._getSearchedUsersSubscription$ = this.searchTextChanged
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        mergeMap(searchTerm => this.searchUsers(searchTerm, 0))
      )
      .subscribe(userResponse => {
        const users = userResponse.content || [];
        this.userTags = this.updateUserOptionsListWithResponse(users);
        this.loadingList = false;
        if (users.length < 100) {
          this.endOfListReached = true;
        }
      });
    this.tagGroupFormGroup = <FormGroup>this.controlContainer.control;
    this.tagGroupFormGroup.registerControl(
      'tagGroupFormArray',
      this.tagGroupFormArray
    );
    this.debounceSearch('');
  }

  ngOnDestroy() {}

  updateFormFields(): void {
    this.createFormBasedOnTagGroups(this.allTags);
    this.moveSelectedTagsIntoFormControls(_.cloneDeep(this.selectedTags));

    if (this.tagGroupFormArray.value.length) {
      this.tagGroupFormArray.value.forEach(tag => {
        if (Array.isArray(tag.selected)) {
          this.setSelection(tag.selected, tag.values);
        }
      });
    }
  }

  public getTags(): Observable<TagGroupInterface[]> {
    return this.tagsSelectorService.getAllTags(this.baseDomainType, true).pipe(
      tap(tagsResponse => {
        this.allTags = tagsResponse;
        this.updateFormFields();
      })
    );
  }

  public getSelectedTags(): Observable<TagGroupInterface[]> {
    if (this.baseDomainId === undefined) {
      // If we need to load tags from input
      if (this.preselectedTags.length > 0) {
        this.selectedTags = this.preselectedTags;
        // When we load the tags from the input, wipe out the prior selections.
        this.selectedTagsChange.emit(this.selectedTags);
        this.updateFormFields();
      }
      return of([]);
    } else {
      this.isLoadingTags = true;
      return this.tagsSelectorService.getSelectedTags(this.baseDomainId).pipe(
        tap(tagsResponse => {
          this.selectedTags = tagsResponse;
          // When we load the tags from the server, wipe out the prior selections.
          this.selectedTagsChange.emit(this.selectedTags);
          this.updateFormFields();
          this.isLoadingTags = false;
        })
      );
    }
  }

  public moveSelectedTagsIntoFormControls(selectedTags: TagGroupInterface[]) {
    const tagForms = this.tagGroupFormArray;

    selectedTags.forEach(tagGroup => {
      // NOTE: This for loop mutates the `tagForms` FormArray.
      let i: number;
      for (i = 0; i < tagForms.length; i++) {
        const tagFormValue = tagForms.at(i).value;
        if (tagFormValue.id === tagGroup.id) {
          const isUserOrSelectable =
            tagFormValue.tagGroupType === 'SELECTABLE' ||
            tagFormValue.tagGroupType === 'USER';
          if (isUserOrSelectable && !tagFormValue.multipleValuesAllowed) {
            tagForms.at(i).patchValue({
              selected: tagGroup.values[0]
            });
          } else if (isUserOrSelectable && tagFormValue.multipleValuesAllowed) {
            tagForms.at(i).patchValue({
              selected: tagGroup.values
            });
          } else if (tagFormValue.tagGroupType === 'TEXT') {
            tagForms.at(i).patchValue({
              selected: tagGroup.values[0].tag
            });
          }
        }
      }
    });
  }

  public extractTagsFromFormControls(): TagGroupInterface[] {
    const newSelectedTags: TagGroupInterface[] = [];

    // Also, use "map".  For example "tags = tagGroupForms.filter( (remove empty tag groups) ).map( (get the form value)).
    this.tagGroupFormArray.getRawValue().forEach(tagGroupFormValues => {
      const isUserOrSelectable =
        tagGroupFormValues.tagGroupType === 'SELECTABLE' ||
        tagGroupFormValues.tagGroupType === 'USER';

      if (
        isUserOrSelectable &&
        tagGroupFormValues.multipleValuesAllowed &&
        tagGroupFormValues.selected &&
        tagGroupFormValues.selected.length > 0
      ) {
        // Multi select
        const tags = tagGroupFormValues.selected;

        newSelectedTags.push({
          id: tagGroupFormValues.id,
          tagGroupType: tagGroupFormValues.tagGroupType,
          values: tags
        });
      } else if (
        isUserOrSelectable &&
        !tagGroupFormValues.multipleValuesAllowed &&
        tagGroupFormValues.selected &&
        tagGroupFormValues.selected.id
      ) {
        // Single select
        const tag = tagGroupFormValues.selected;

        newSelectedTags.push({
          id: tagGroupFormValues.id,
          tagGroupType: tagGroupFormValues.tagGroupType,
          values: [
            {
              id: tag.id,
              tag: tag.tag,
              externalId: tag.externalId
            }
          ]
        });
      } else if (
        tagGroupFormValues.tagGroupType === 'TEXT' &&
        !tagGroupFormValues.multipleValuesAllowed
      ) {
        // Single text
        const tagText = tagGroupFormValues.selected;
        if (tagText && tagText.length > 0) {
          newSelectedTags.push({
            id: tagGroupFormValues.id,
            tagGroupType: tagGroupFormValues.tagGroupType,
            values: [
              {
                // NOTE: Passing the text in as the ID because this is what DFM currently does.
                // The server will create new tag if it detects a change to this value, even if
                // the exact same value has been used before and already has a tag.
                id: tagText,
                tag: tagText
              }
            ]
          });
        }
      }
    });

    // Compare new selected Tags with original selected Tags
    // If a tag on original not exists in new selected tags
    // Do insert that missing tag with values is empty
    this.selectedTags.map(originalTag => {
      const stillExists = newSelectedTags.find(
        newTag => newTag.id === originalTag.id
      );
      if (!stillExists) {
        const oldTagsEmptyValue = _.cloneDeep(originalTag);
        oldTagsEmptyValue.values = [];
        newSelectedTags.push(oldTagsEmptyValue);
      }
    });

    return newSelectedTags;
  }

  createFormBasedOnTagGroups(newTagGroups: TagGroupInterface[]) {
    // Normalize the input.
    newTagGroups = newTagGroups ? newTagGroups : [];

    const tagControls = newTagGroups.map(tagGroup => {
      let selected: any;
      if (tagGroup.tagGroupType === 'TEXT') {
        selected = new FormControl('', Validators.maxLength(255));
      } else if (tagGroup.multipleValuesAllowed) {
        selected = [];
      } else {
        selected = null;
      }

      let hasChildren = false;
      tagGroup.values.forEach(tag => {
        if (!tag || !tag.children) {
          return;
        }
        if (tag.children.length) {
          hasChildren = true;
        }
      });

      const tagForms = createFormGroup(this.formBuilder, {
        tagGroupName: tagGroup.tagGroupName,
        id: tagGroup.id,
        tagGroupType: tagGroup.tagGroupType,
        multipleValuesAllowed: tagGroup.multipleValuesAllowed,
        values: tagGroup.values,
        selected: selected,
        hasChildren
      });

      return tagForms;
    });

    setFormArrayControls(this.tagGroupFormArray, tagControls);
  }

  public setSelection(selectedArray, tagGroupArray) {
    selectedArray.forEach(selected => {
      const recursiveSelection = tgArray => {
        tgArray.forEach(tag => {
          if (tag.id === selected.id) {
            tag.selected = true;
          }
          if (tag.values && tag.values.length) {
            recursiveSelection(tag.values);
          }
          if (tag.children && tag.children.length) {
            recursiveSelection(tag.children);
          }
        });
      };
      recursiveSelection(tagGroupArray);
    });
  }

  public requestForInfiniteList($event) {
    const end = $event.endIndex;

    const hasReachedBufferPoint =
      end &&
      end >= this.userTags.length - this.userBuffer &&
      end >= this.lastEndIndex;

    this.lastEndIndex = end;

    if (
      hasReachedBufferPoint &&
      !this.endOfListReached &&
      end !== -1 &&
      !this.loadingList
    ) {
      this.currentUserPage++;

      this.searchUsers(this.currentSearchTerm, this.currentUserPage).subscribe(
        userResponse => {
          const users = userResponse.content;

          this.userTags = [
            ...this.userTags,
            ...this.updateUserOptionsListWithResponse(users)
          ];

          this.loadingList = false;
          this.endOfListReached = userResponse.last;
        }
      );
    }
  }

  public searchUsers(searchTerm: string, page?: number) {
    if (searchTerm === '' && !page) {
      this.lastEndIndex = 0;
      this.endOfListReached = false;
    }
    this.loadingList = true;
    this.currentSearchTerm = searchTerm;
    this.currentUserPage = page || 0;

    return this.userService.getUsersResponse(searchTerm, this.currentUserPage);
  }

  updateUserOptionsListWithResponse(users) {
    const userTags = users
      .map(
        user =>
          ({
            id: user.id,
            tag: user.name + ' - ' + user.email
          } as TagInterface)
      )
      .sort((a, b) => (a.tag.toLowerCase() < b.tag.toLowerCase() ? -1 : 1));

    return userTags;
  }

  public isChanged(): boolean {
    const currentTags = this.extractTagsFromFormControls();
    const selectedTags = this.selectedTags;

    if (currentTags.length !== selectedTags.length) {
      return true;
    }

    if (currentTags.length === 0) {
      return false;
    }

    return !currentTags.every((tag, index) => {
      const tagToCompare = selectedTags[index];
      const compareLength = tagToCompare.values.length === tag.values.length;
      const compareValues = tag.values.every((value, i) => {
        return _.isEqual(value, tagToCompare.values[i]);
      });
      return compareLength && compareValues;
    });
  }

  public save(): Observable<any> {
    if (!this.isChanged()) {
      return of({});
    }
    return this.tagsSelectorService.updateTags(
      this.baseDomainId,
      this.extractTagsFromFormControls()
    );
  }
}
