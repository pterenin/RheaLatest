import { Injectable } from '@angular/core';
import { TaPopover } from '@trustarc/ui-toolkit';

declare const _: any;
@Injectable({
  providedIn: 'root'
})
export class InlineTagEditorService {
  private treeTags = [];
  private popover: TaPopover | any = {};
  private unsetEditMode: Function | false;

  constructor() {}

  public overwriteTreeTags(treeTags) {
    this.treeTags = _.cloneDeep(treeTags);
    return _.cloneDeep(this.treeTags);
  }

  public overwriteByTagGroup(tagGroup) {
    this.treeTags.forEach(tg => {
      if (tg.id === tagGroup.id) {
        tg.values = _.cloneDeep(tg.values);
      }
    });
    return _.cloneDeep(this.treeTags);
  }

  public overwriteByTag(tag) {
    this.treeTags.forEach(tgp => {
      const recursiveUpdate = tgArray => {
        return tgArray.map(tg => {
          if (tg.id === tag.id) {
            tg.selected = tag.selected;
          }
          if (tg.children && tg.children.length) {
            tg.children = recursiveUpdate(tg.children);
          }
          return tg;
        });
      };
      tgp.values = recursiveUpdate(tgp.values);
    });
    return _.cloneDeep(this.treeTags);
  }

  public getTreeTagCopy() {
    return _.cloneDeep(this.treeTags);
  }

  public triggerPopover(popover) {
    if (this.popover.hasOwnProperty('autoClose')) {
      this.popover.close();
    }
    this.popover = popover;
    this.triggerUnsetEditMode();
  }
  public editModeChanges({ editMode, unset }) {
    this.unsetEditMode = unset;
  }

  public triggerUnsetEditMode() {
    if (this.unsetEditMode) {
      this.unsetEditMode();
      this.unsetEditMode = false;
    }
  }
}
