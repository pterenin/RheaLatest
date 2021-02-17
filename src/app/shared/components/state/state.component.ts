import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  CountryInterface,
  StateOrProvinceInterface
} from '../../models/location.model';

@Component({
  selector: 'ta-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.scss']
})
export class StateComponent implements OnInit {
  @Input() stateList: StateOrProvinceInterface[];
  @Input() selectedCountry: CountryInterface;
  @Input() selected: StateOrProvinceInterface[] = [];
  @Output() isSelectingStates: EventEmitter<boolean>;
  @Output() selectedStates: EventEmitter<string[]>;

  public searchValue = '';
  public stateListDisplay: StateOrProvinceInterface[] = [];
  public selectedIds: string[];

  constructor() {
    this.isSelectingStates = new EventEmitter<boolean>();
    this.selectedStates = new EventEmitter<string[]>();
  }

  ngOnInit() {
    this.getSelectedIds();
    this.mapSelections();
  }

  public navigateBack() {
    this.isSelectingStates.emit(false);
  }

  public getSelectedIds() {
    this.selectedIds = [];

    this.selected.forEach(item => {
      const value = item.id ? item.id : item;
      this.selectedIds.push(value as string);
    });
  }

  public onItemChange(state) {
    const stateSelected = this.selectedIds.includes(state.id);
    if (stateSelected) {
      this.selectedIds = this.selectedIds.filter(id => id !== state.id);
    } else {
      this.selectedIds.push(state.id);
    }
    this.selectedStates.emit(this.selectedIds);
  }

  public selectAll($event) {
    $event.preventDefault();
    if (this.selectedIds.length > 0) {
      this.clearAll();
    } else {
      this.selectedIds = this.stateList.map(state => state.id);
      this.selectedStates.emit(this.selectedIds);
      this.mapSelections();
    }
    this.searchValue = '';
    this.filterSearch();
  }

  public clearAll() {
    this.selectedIds = [];
    this.selectedStates.emit(this.selectedIds);
    this.mapSelections();
  }

  public isIndeterminate(): boolean {
    return (
      this.selectedIds.length > 0 &&
      this.selectedIds.length !== this.stateList.length
    );
  }

  public onSearchChange(search) {
    this.searchValue = search.searchValue || '';
    this.filterSearch();
  }

  private filterSearch() {
    this.stateListDisplay = this.stateList.filter(
      state =>
        String(state.name)
          .toLowerCase()
          .indexOf(this.searchValue.toLowerCase()) !== -1
    );
  }

  private mapSelections() {
    this.stateList = this.stateList.map(state => ({
      ...state,
      selected: this.isInitialSelection(state)
    }));
    this.stateListDisplay = [...this.stateList];
  }

  private isInitialSelection(state: StateOrProvinceInterface) {
    const selection = this.selectedIds.find(id => id === state.id);
    return selection !== undefined;
  }
}
