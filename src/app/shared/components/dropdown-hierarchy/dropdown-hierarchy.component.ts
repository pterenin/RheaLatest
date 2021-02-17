import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

declare const _: any;

@Component({
  selector: 'ta-dropdown-hierarchy',
  templateUrl: './dropdown-hierarchy.component.html',
  styleUrls: ['./dropdown-hierarchy.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DropdownHierarchyComponent implements OnInit {
  @ViewChild('dropdownHierarchyRef') dropdownHierarchyRef: any;
  @Input() tagGroupForm: any;
  @Input() isMultiSelect = false;

  public selectAllCheckedStatus = true;
  public selectAllIndeterminate = false;
  public dropdownHierarchyView = false;
  public dropdownHierarchyTitle = '';
  public dropdownHierarchyList = {};
  public dropdownHierarchyParent: any;
  public dropdownHierarchyFlatTree = [];
  public dropdownHierarchySearchFilter = '';
  public dropdownActiveOptions = [];

  constructor() {}

  ngOnInit() {
    if (this.isMultiSelect) {
      const selected = this.tagGroupForm.get('selected').value;
      const values = this.tagGroupForm.get('values').value;

      selected.forEach(option => {
        values.forEach(o => {
          if (o.tag === option.tag) {
            o.selected = true;
          }
        });
      });

      this.dropdownActiveOptions = values;
      this.selectAllCheckedStatus = this.isFullSelection();
      this.selectAllIndeterminate = this.isIndeterminateSelection();
    }
  }

  public getActiveSelectionCount() {
    return this.dropdownActiveOptions.filter(option => option.selected).length;
  }

  public onDropdownHierarchySearch(filterString) {
    this.dropdownHierarchySearchFilter = filterString;
  }

  public handleNoneSelection() {
    if (!this.isMultiSelect) {
      this.tagGroupForm.get('selected').setValue([]);
      this.dropdownHierarchyRef.close();
    }
  }

  public isFullSelection() {
    const optionsLength = this.dropdownActiveOptions.length;
    const selections = this.dropdownActiveOptions.filter(
      option => option.selected
    );

    return selections.length && optionsLength === selections.length
      ? true
      : false;
  }

  public isIndeterminateSelection() {
    const selections = this.dropdownActiveOptions.filter(
      option => option.selected
    );
    const optionsLength = this.dropdownActiveOptions.length;

    return selections.length && optionsLength !== selections.length
      ? true
      : false;
  }

  public handleSelectAll(event) {
    const checkedStatus = event.target.checked;
    this.dropdownHierarchySearchFilter = '';

    const select = () => {
      this.dropdownActiveOptions.forEach(option => {
        option.selected = true;
        if (checkedStatus) {
          this.handleDropdownHierarchyChange(event, option, this.tagGroupForm);
        }
      });
    };

    const unselect = () => {
      this.dropdownActiveOptions.forEach(option => {
        option.selected = false;
        this.removeTagFromSelection(option, this.tagGroupForm);
      });
    };

    checkedStatus ? select() : unselect();
  }

  public handleCheckbox(event, option) {
    this.selectAllIndeterminate = true;
    const checkedStatus = event.target.checked;
    option.selected = checkedStatus;
    this.dropdownActiveOptions
      .filter(o => o.id === option.id)
      .forEach(o => {
        o.selected = checkedStatus;
      });

    checkedStatus
      ? this.handleDropdownHierarchyChange(event, option, this.tagGroupForm)
      : this.removeTagFromSelection(option, this.tagGroupForm);
  }

  public handleDropdownHierarchyChange(event, option, tagGroupForm) {
    // if option not selectable, prevent form manipulation
    if (!tagGroupForm || !option.selectable) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();

    if (!this.isMultiSelect) {
      this.dropdownHierarchyRef.close();
      this.dropdownHierarchyView = false;
      this.dropdownHierarchyFlatTree = [];
      this.dropdownHierarchySearchFilter = '';
    }

    const push = () => {
      const existsAlready = tagGroupForm
        .get('selected')
        .value.some(o => o.id === option.id);

      if (!existsAlready) {
        const value = tagGroupForm.get('selected').value;
        value.push(option);
        tagGroupForm.get('selected').setValue(value);
      }
    };

    const overwrite = () => tagGroupForm.get('selected').setValue(option);

    this.isMultiSelect ? push() : overwrite();
  }

  public removeTagFromSelection(option, tagGroupForm) {
    if (!tagGroupForm) {
      return;
    }

    const filtered = tagGroupForm
      .get('selected')
      .value.filter(tag => tag.id !== option.id);

    tagGroupForm.controls.selected.setValue(filtered);

    _.map(this.dropdownActiveOptions, item => {
      if (item.id === option.id) {
        item.selected = false;
      }
    });
  }

  public navigateDropdownHierarchy(option, direction = 'down') {
    const traverseDown = () => {
      this.dropdownHierarchyView = true;
      this.dropdownHierarchyParent = option;
      this.dropdownHierarchyTitle = option.tag;
      this.dropdownHierarchyList = option.children;
      this.dropdownActiveOptions = option.children;
      this.dropdownHierarchyFlatTree.push(option);

      const hasOption = _.find(this.dropdownHierarchyFlatTree, {
        id: option.id
      });

      if (!hasOption) {
        this.dropdownHierarchyFlatTree.push(option);
      }
    };

    const traverseUp = () => {
      const reset = () => {
        this.dropdownHierarchyView = false;
        this.dropdownHierarchyFlatTree = [];
        this.dropdownHierarchySearchFilter = '';
        this.dropdownActiveOptions = this.tagGroupForm.get('values').value;
      };

      const traverse = () => {
        this.dropdownHierarchyFlatTree.forEach((parent, index) => {
          if (parent.id === this.dropdownHierarchyParent.parentTagValueId) {
            this.dropdownHierarchyTitle = parent.tag;
            this.dropdownHierarchyList = parent.children;
            this.dropdownActiveOptions = parent.children;
            this.dropdownHierarchyParent = parent;
          }
        });
      };

      this.dropdownHierarchyParent.parentTagValueId ? traverse() : reset();
    };

    direction === 'down' ? traverseDown() : traverseUp();
  }
}
