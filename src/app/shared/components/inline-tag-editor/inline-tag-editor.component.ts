import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
  ViewEncapsulation
} from '@angular/core';

import { TaDropdown, TaPopover } from '@trustarc/ui-toolkit';
import { InlineTagEditorService } from './inline-tag-editor.service';
import { noop } from 'lodash';
import { isEmpty } from 'src/app/shared/utils/basic-utils';
import { TagGroupInterface } from '../../models/tags.model';

declare const _: any;

@Component({
  selector: 'ta-inline-tag-editor',
  templateUrl: './inline-tag-editor.component.html',
  styleUrls: ['./inline-tag-editor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InlineTagEditorComponent implements OnInit, OnChanges {
  @ViewChildren(TaPopover) popover: QueryList<TaPopover>;
  @ViewChildren(TaDropdown) dropdown: QueryList<TaPopover>;

  @Output() activePopover: EventEmitter<any>;
  @Output() editModeChanges: EventEmitter<any>;
  @Output() selectionChanges: EventEmitter<any>;
  @Input() bpItem: {};
  @Input() bpId = '';
  @Input() flatTags = [];
  @Input() treeTags = [];
  @Input() userTags = [];

  public flatTagsCopy = [];
  public searchTerm: string;
  public editMode = false;
  public initialSelectionSet = false;
  public currentStateTree = null;
  public columnText = '';
  public truncated = false;

  private cachedOpenPopovers = [];
  public selectedTagGroup: any = {};

  public readonly isEmpty = isEmpty;

  constructor(private inlineTagEditorService: InlineTagEditorService) {
    this.activePopover = new EventEmitter();
    this.editModeChanges = new EventEmitter();
    this.selectionChanges = new EventEmitter();
  }

  public onSearch(search) {
    this.searchTerm = search;
  }

  public onTextUpdate(event, tag, isNew = false) {
    tag.tag = event.target.value;
    tag.name = event.target.value;
    if (isNew) {
      tag.id = tag.name;
      tag.children = [];
    }
    tag.selected = true;
    this.selectedTagGroup.values = [tag];
  }

  public isTextInputUpdate(tagGroup) {
    return this.flatTags.some(tag => tagGroup.id === tag.tagGroupId);
  }

  public cleanUp() {
    this.searchTerm = '';
    this.editMode = false;
    this.cachedOpenPopovers = [];
    this.selectedTagGroup = {};
  }

  ngOnInit() {
    this.columnText = this.getColumnText();
    this.flatTagsCopy = _.cloneDeep(this.flatTags);
  }

  ngOnChanges() {
    if (this.currentStateTree) {
      return;
    }
    this.currentStateTree = _.cloneDeep(this.treeTags);
    this.setInitialSelection();
    this.columnText = this.getColumnText();
  }

  public navigateBack() {
    this.selectedTagGroup = this.selectedTagGroup.parent;
  }

  private recursiveSelection = tagArray => {
    tagArray.forEach(tag => {
      if (tag.isUserTag) {
        tag.selected = false;
      }
    });

    tagArray.forEach(tag => {
      const tagExists = this.flatTags.some(ftag => {
        if (
          tag.isUserTag &&
          ftag.parentTagValueId === this.selectedTagGroup.id
        ) {
          return ftag.id === tag.id || ftag.name === tag.tag.trim();
        }
        if (!tag.isUserTag) {
          return ftag.id === tag.id;
        }
      });
      if (tagExists) {
        tag.selected = true;
      }
      if (tag.children && tag.children.length) {
        this.recursiveSelection(tag.children);
      }
      if (tag.values && tag.values.length) {
        this.recursiveSelection(tag.values);
      }
    });
  };

  public setInitialSelection() {
    this.flatTags = _.sortBy(this.flatTags, ['name']);
    this.recursiveSelection(this.currentStateTree);
    this.initialSelectionSet = true;
  }

  public toggleEditMode(bool) {
    this.inlineTagEditorService.triggerUnsetEditMode();
    this.editMode = bool;

    const unsetEditMode = () => this.cleanUp();
    this.inlineTagEditorService.editModeChanges({
      editMode: this.editMode,
      unset: unsetEditMode.bind(this)
    });

    const openDropdown = () => {
      if (this.editMode && this.dropdown.first) {
        this.dropdown.first.open();
      }
    };

    _.delay(openDropdown.bind(this), 100);
  }

  public handleOpenChange(event) {
    if (!event) {
      this.onCancel();
    }
  }

  public triggerPopover(popover) {
    this.cachedOpenPopovers.push(popover);
    this.inlineTagEditorService.triggerPopover(popover);
    popover.open();
  }

  public closePopovers() {
    if (this.cachedOpenPopovers.length) {
      this.cachedOpenPopovers.forEach(pop => {
        if (pop) {
          pop.close();
        }
      });
      this.cleanUp();
    }
  }

  public prevent(event) {
    if (this.dropdown.first) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  public onCancel() {
    this.flatTags = _.cloneDeep(this.flatTagsCopy);

    const unsetEditMode = () => this.cleanUp();
    this.editMode = false;
    this.inlineTagEditorService.editModeChanges({
      editMode: this.editMode,
      unset: unsetEditMode.bind(this)
    });

    this.backToPreviousState();
  }

  private backToPreviousState() {
    this.currentStateTree = _.cloneDeep(this.treeTags);
    this.setInitialSelection();
  }

  private getSelectedTags(tag, selecgtedTags) {
    if (tag.selected) {
      selecgtedTags.push(tag);
    }
    if (tag.children) {
      tag.children.forEach(child => this.getSelectedTags(child, selecgtedTags));
    }
  }

  private removeParents(selectedTagGroups) {
    selectedTagGroups.forEach(tagGroup => {
      tagGroup.parent = {};
      tagGroup.values || tagGroup.children
        ? this.removeParents(tagGroup.values || tagGroup.children)
        : noop();
    });
  }

  public onSave() {
    // The overview API expects all selected tags to be sent flat, so selected in this case is an array of all tags selected.
    // we copy the selected to the values property the last minute before saving and then render data again so values is set right.
    const tagsToSave = _.cloneDeep(this.currentStateTree);
    const tagsToRemove = _.cloneDeep(
      this.currentStateTree.filter(tg => tg.remove)
    );
    const remove = [];

    tagsToSave.forEach(parentTag => {
      if (parentTag.remove) {
        remove.push(parentTag);
      }
      const selectedTags = [];
      parentTag.values.forEach(tag => {
        this.getSelectedTags(tag, selectedTags);
      });
      parentTag.values = selectedTags;
    });

    const selectedTagGroups = tagsToSave.filter(
      category => category.values.length || category.updated
    );

    this.removeParents(selectedTagGroups);

    // the final payload object is sent to the record grid handler, which will use the overview API to push changes
    this.selectionChanges.emit({
      bpItem: this.bpItem,
      selectedTagGroups: selectedTagGroups,
      remove: tagsToRemove
    });
  }

  public selectChildren(event, tagGroup) {
    event.preventDefault();
    event.stopPropagation();

    tagGroup.parent = this.selectedTagGroup;
    if (this.selectedTagGroup.multipleValuesAllowed) {
      tagGroup.multipleValuesAllowed = this.selectedTagGroup.multipleValuesAllowed;
    }

    this.selectedTagGroup = tagGroup;
    if (tagGroup.tagGroupType === 'USER') {
      const selectedMap = {};
      tagGroup.values.forEach(userTag => {
        if (userTag.selected) {
          selectedMap[userTag.tag] = userTag.id;
        }
      });

      this.userTags.forEach(userTag => {
        if (selectedMap[userTag.tag]) {
          userTag.id = selectedMap[userTag.tag];
        }
      });
      tagGroup.values = this.userTags;
      this.recursiveSelection(tagGroup.values);
    }
  }

  public onSelect(tag, tagGroup) {
    tagGroup.updated = true;
    if (tag.selected) {
      tag.selected = false;
    } else {
      tag.selected = true;
    }
  }

  public secondLevelClick(event, tag, tagGroup) {
    tagGroup.updated = true;
    event.preventDefault();
    event.stopPropagation();
    tag.updated = true;
    if (tag.hasOwnProperty('selected')) {
      tag.selected = !tag.selected;
    } else {
      tag.selected = true;
    }

    this.toggleSelection(tag, this.selectedTagGroup);
  }

  /**
   * If property is not found in the current tagGroup it will
   * iterate up to all parents(and parents of parents) to find the instance of the tagGroup with that property.
   *
   * @param tagGroup - TagGroupInterface instance
   * @param property - any string
   *
   * @return closest parent with has give property or null
   */
  private findTagGroupOrParentWithProperty(
    tagGroup: TagGroupInterface,
    property: string
  ): TagGroupInterface {
    const recursiveParentSearch = (
      tGr: TagGroupInterface,
      prop: string
    ): TagGroupInterface => {
      if (tGr) {
        return _.has(tGr, prop) ? tGr : recursiveParentSearch(tGr.parent, prop);
      } else {
        return null;
      }
    };
    return recursiveParentSearch(tagGroup, property);
  }

  private toggleSelection(tag, tagGroup): void {
    const foundTagGroupWithTagGroupTypeProp = this.findTagGroupOrParentWithProperty(
      tagGroup,
      'tagGroupType'
    );
    const foundTagGroupWithMultipleValuesAllowedProp = this.findTagGroupOrParentWithProperty(
      tagGroup,
      'multipleValuesAllowed'
    );
    const isTagGroupTypeSelectable = foundTagGroupWithTagGroupTypeProp
      ? 'SELECTABLE' === foundTagGroupWithTagGroupTypeProp.tagGroupType
      : false;
    const areMultipleValuesAllowed = foundTagGroupWithMultipleValuesAllowedProp
      ? foundTagGroupWithMultipleValuesAllowedProp.multipleValuesAllowed
      : false;
    const recursiveSelection = tagsArray => {
      tagsArray.forEach(ta => {
        const isCurrentTag = ta.id === tag.id;
        if (
          isTagGroupTypeSelectable &&
          !areMultipleValuesAllowed &&
          !isCurrentTag // exclude current tag
        ) {
          ta.selected = false;
        }
        if (isCurrentTag) {
          ta.selected = tag.selected;
        }

        if (!ta.selected && !isEmpty(ta.values)) {
          recursiveSelection(ta.values);
        } else if (!ta.selected && !isEmpty(ta.children)) {
          recursiveSelection(ta.children);
        }
      });
    };
    recursiveSelection(this.currentStateTree);

    if (
      (tagGroup.tagGroupType === 'SELECTABLE' &&
        !tagGroup.multipleValuesAllowed) ||
      tagGroup.tagGroupType === 'USER'
    ) {
      const recursiveReset = tagsArray => {
        tagsArray.forEach(t => {
          if (tag.id !== t.id) {
            t.selected = false;
          }
          if (!isEmpty(t.children)) {
            recursiveReset(t.children);
          }
        });
      };

      recursiveReset(this.selectedTagGroup.values);
    }
  }

  public isAllChildrenSelected(tagGroup) {
    return (tagGroup.values || tagGroup.children).every(
      value => value.selected
    );
  }

  public isIndeterminate(tagGroup) {
    return (
      !this.isAllChildrenSelected(tagGroup) &&
      (tagGroup.values || tagGroup.children).some(value => value.selected)
    );
  }

  public selectAllChildren($event, tagGroup) {
    $event.stopPropagation();
    $event.preventDefault();
    const everyChildrenSelected = (tagGroup.values || tagGroup.children).every(
      value => value.selected
    );

    (tagGroup.values || tagGroup.children).forEach(value => {
      value.selected = !everyChildrenSelected;
    });

    const allUnselected = (tagGroup.values || tagGroup.children).every(
      value => value.selected === false
    );

    allUnselected ? (tagGroup.remove = true) : (tagGroup.remove = false);
  }

  public getSelectAllCount(tagGroup) {
    let count = 0;
    let selected = 0;

    (tagGroup.values || tagGroup.children).forEach(tag => {
      count++;
      if (tag.selected) {
        selected++;
      }
    });

    return [selected.toString(), count.toString()];
  }

  public getSelectedCountString(tagType, selectedTagGroup) {
    if (tagType === 'selectableTag') {
      const [countSelected, countAll] = this.getSelectAllCount(
        selectedTagGroup
      );

      // [i18n-tobeinternationalized]
      return `Select All (${countSelected} of ${countAll})`;
    }

    if (tagType === 'userTagsTemplate') {
      const countSelected = this.getSelectUsersCount();
      const countAll = selectedTagGroup.values.length;

      // [i18n-tobeinternationalized]
      return `Select All (${countSelected} of ${countAll})`;
    }
  }

  public getSelectUsersCount() {
    return this.userTags.filter(userTag => userTag.selected).length;
  }

  public truncate(string, overflow: string[], maxLength) {
    const more = overflow.length ? `, +${overflow.length} more` : '';
    const moreTrunc = string.slice(0, maxLength);
    const normalTrunc = string.slice(0, maxLength + 5);
    const trunc = overflow.length ? moreTrunc : normalTrunc;

    return `${trunc}...${more}`;
  }

  public getColumnText() {
    let string = '';
    const list = [];
    const overflow = [];
    const maxLength = 15;

    this.flatTags.forEach(tag => {
      if (list.join(',').length < maxLength) {
        list.push(tag.name);
      } else {
        overflow.push(tag.name);
      }
    });
    string = list.join(', ');

    if (string.length > maxLength || overflow.length) {
      string = this.truncate(string, overflow, maxLength);
      this.truncated = true;
    } else if (list.length > 1) {
      string = string.slice(0, string.length - 1);
      this.truncated = false;
    }
    return string;
  }
}
