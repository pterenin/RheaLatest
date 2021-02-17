import {
  async,
  ComponentFixture,
  inject,
  TestBed
} from '@angular/core/testing';

import { CustomFiltersComponent } from './custom-filters.component';
import { SelectedFilterTypeComponent } from './selected-filter-type/selected-filter-type.component';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CustomFiltersService } from 'src/app/shared/services/custom-filters/custom-filters.service';
import { of, throwError } from 'rxjs';
import {
  TaButtonsModule,
  TaCheckboxModule,
  TaDropdownModule,
  TaPopoverModule,
  TaSvgIconModule,
  TaToastModule,
  TaTooltipModule,
  ToastService
} from '@trustarc/ui-toolkit';

const BODY = {
  filters: {
    RISK: {
      nestedFilterValue: null,
      value: []
    },
    TAG: {
      nestedFilterValue: null,
      value: []
    },
    OWN_ORG: {
      nestedFilterValue: null,
      value: []
    },
    OWN_ROLE: {
      nestedFilterValue: null,
      value: []
    },
    OWN_NAME: {
      nestedFilterValue: null,
      value: []
    },
    OWN_DEPT: {
      nestedFilterValue: null,
      value: []
    },
    SYS_OWN: {
      nestedFilterValue: null,
      value: []
    },
    OWN_EMAIL: {
      nestedFilterValue: null,
      value: []
    },
    SYS_LOC: {
      nestedFilterValue: null,
      value: []
    },
    SEC_CRL: {
      nestedFilterValue: null,
      value: []
    },
    STATUS: {
      nestedFilterValue: null,
      value: []
    }
  },
  name: 'string',
  version: 2,
  id: 'string'
};

describe('CustomFiltersComponent', () => {
  let component: CustomFiltersComponent;
  let fixture: ComponentFixture<CustomFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomFiltersComponent, SelectedFilterTypeComponent],
      imports: [
        CommonModule,
        RouterTestingModule,
        TaButtonsModule,
        TaDropdownModule,
        TaCheckboxModule,
        TaSvgIconModule,
        TaToastModule,
        TaPopoverModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        TaTooltipModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('clearFilters()', () => {
    it('should call clearFilters correctly', () => {
      component.filterTypes = [
        {
          name: 'name1',
          subType: 'subType1',
          parentType: 'parentType1',
          selected: true,
          filterOptions: [
            {
              name: 'name1',
              selected: true
            }
          ]
        },
        {
          name: 'name2',
          subType: 'subType2',
          parentType: 'parentType2',
          selected: true,
          filterOptions: [
            {
              name: 'name2',
              selected: true
            }
          ]
        }
      ];
      spyOn(component, 'removeFilterType');
      component.clearFilters();
      expect(component.removeFilterType).toHaveBeenCalledTimes(2);
      expect(component.selectedFilterView).toEqual(null);
    });
  });

  describe('editFilterView()', () => {
    it('should call editFilterView correctly', () => {
      const filterView = {
        id: 'id1',
        editMode: false
      };
      const event = {
        preventDefault: () => {},
        stopPropagation: () => {}
      };
      spyOn(event, 'preventDefault');
      spyOn(event, 'stopPropagation');
      component.editFilterView(event, filterView);
      expect(event.preventDefault).toHaveBeenCalledTimes(1);
      expect(event.stopPropagation).toHaveBeenCalledTimes(1);
      expect(filterView.editMode).toBeTruthy();
    });
  });

  describe('cancelEdit()', () => {
    it('should call cancelEdit correctly', () => {
      const filterView = {
        id: 'id1',
        editMode: false,
        name: 'name'
      };
      component.cancelEdit(filterView);
      expect(filterView.editMode).toBeFalsy();
    });
  });

  describe('removeFilterViewFromList()', () => {
    it('should call removeFilterViewFromList correctly', () => {
      component.filterViewList = [
        {
          id: 'id1'
        },
        {
          id: 'id2'
        }
      ];
      const view = {
        id: 'id2'
      };
      component.removeFilterViewFromList(view);
      expect(component.filterViewList).toEqual(
        jasmine.objectContaining([
          {
            id: 'id1'
          }
        ])
      );
    });
  });

  describe('deleteFilter', () => {
    it('should call deleteFilter correctly', inject(
      [CustomFiltersService, ToastService],
      (service: CustomFiltersService, toastService: ToastService) => {
        const filterView = {
          id: 'id1'
        };
        const event = {
          preventDefault: () => {},
          stopPropagation: () => {}
        };
        spyOn(event, 'preventDefault');
        spyOn(event, 'stopPropagation');
        spyOn(component, 'removeFilterViewFromList');
        spyOn(service, 'deleteFilterView').and.returnValue(of(filterView));
        spyOn(toastService, 'error');
        component.deleteFilter(event, filterView);
        expect(component.removeFilterViewFromList).toHaveBeenCalledTimes(1);
        expect(service.deleteFilterView).toHaveBeenCalledTimes(1);
        expect(toastService.error).toHaveBeenCalledTimes(0);
      }
    ));
    it('should call deleteFilter correctly and handle error', inject(
      [CustomFiltersService, ToastService],
      (service: CustomFiltersService, toastService: ToastService) => {
        const filterView = {
          id: 'id1'
        };
        const event = {
          preventDefault: () => {},
          stopPropagation: () => {}
        };
        spyOn(event, 'preventDefault');
        spyOn(event, 'stopPropagation');
        spyOn(component, 'removeFilterViewFromList');
        spyOn(service, 'deleteFilterView').and.returnValue(
          throwError(new Error('Error'))
        );
        spyOn(toastService, 'error');
        component.deleteFilter(event, filterView);
        expect(component.removeFilterViewFromList).toHaveBeenCalledTimes(0);
        expect(service.deleteFilterView).toHaveBeenCalledTimes(1);
        expect(toastService.error).toHaveBeenCalledTimes(1);
      }
    ));
  });

  describe('updateFilterViewName', () => {
    it('should call updateFilterViewName correctly', inject(
      [CustomFiltersService, ToastService],
      (service: CustomFiltersService, toastService: ToastService) => {
        const filterView = {
          id: 'id1'
        };
        component.editFilterForm.patchValue({
          editedFilterName: 'test-' + Date.now()
        });
        spyOn(service, 'getFullFilterView').and.returnValue(of({}));
        spyOn(service, 'updateFilterView').and.returnValue(of({}));
        spyOn(toastService, 'error');
        component.updateFilterViewName(filterView);
        expect(service.getFullFilterView).toHaveBeenCalledTimes(1);
        expect(service.updateFilterView).toHaveBeenCalledTimes(1);
        expect(toastService.error).toHaveBeenCalledTimes(0);
      }
    ));
    it('should call updateFilterViewName correctly and handle error', inject(
      [CustomFiltersService, ToastService],
      (service: CustomFiltersService, toastService: ToastService) => {
        const filterView = {
          id: 'id1'
        };
        component.editFilterForm.patchValue({
          editedFilterName: 'test-' + Date.now()
        });
        spyOn(service, 'getFullFilterView').and.returnValue(
          throwError(new Error('Error'))
        );
        spyOn(service, 'updateFilterView').and.returnValue(of({}));
        spyOn(toastService, 'error');
        component.updateFilterViewName(filterView);
        expect(service.getFullFilterView).toHaveBeenCalledTimes(1);
        expect(service.updateFilterView).toHaveBeenCalledTimes(0);
        expect(toastService.error).toHaveBeenCalledTimes(1);
      }
    ));
  });

  describe('applyFilters()', () => {
    it('should call applyFilters correctly', () => {
      spyOn(component.applyFiltersEvent, 'emit');
      component.selectedFilterTypes = [
        {
          name: 'name1',
          subType: 'subType1',
          parentType: 'parentType1',
          selected: true,
          filterOptions: [
            {
              name: 'name1',
              selected: true
            }
          ]
        },
        {
          name: 'name2',
          subType: 'subType2',
          parentType: 'parentType2',
          selected: true,
          filterOptions: [
            {
              name: 'name2',
              selected: true
            }
          ]
        }
      ];
      const applyFiltersObject = {
        filters: {
          subType1: {
            nestedFilterValue: null,
            value: ['name1']
          },
          subType2: {
            nestedFilterValue: null,
            value: ['name2']
          }
        },
        name: null,
        id: null
      };
      fixture.detectChanges();
      component.applyFilters();
      expect(component.applyFiltersEvent.emit).toHaveBeenCalledTimes(1);
      expect(component.applyFiltersEvent.emit).toHaveBeenCalledWith(
        applyFiltersObject
      );
      expect(component.isFiltersDirty).toEqual(false);
    });
  });

  describe('saveAsNew()', () => {
    it('should call saveAsNew correctly', () => {
      const event = {
        stopPropagation: () => {}
      };
      spyOn(event, 'stopPropagation');
      component.saveAsNew(event);
      expect(event.stopPropagation).toHaveBeenCalledTimes(1);
      expect(component.isSavingAsNew).toEqual(true);
      expect(component.selectedFilterView).toEqual(null);
    });
  });

  describe('filterOptionChanged()', () => {
    it('should call filterOptionChanged correctly', () => {
      component.filterOptionChanged();
      expect(component.isFiltersDirty).toEqual(true);
    });
  });

  describe('validateName()', () => {
    it('should call validateName correctly - already exists', () => {
      const control = new FormControl('');
      control.setValue('name1');
      component.filterViewList = [
        {
          name: 'name1'
        },
        {
          name: 'name2'
        }
      ];
      const validated = component.validateName(control);
      expect(validated.alreadyExists).toEqual(true);
    });
    it('should call validateName correctly - does not exist', () => {
      const control = new FormControl('');
      control.setValue('name3');
      component.filterViewList = [
        {
          name: 'name1'
        },
        {
          name: 'name2'
        }
      ];
      const validated = component.validateName(control);
      expect(validated).toEqual(null);
    });
  });

  describe('removeFilter()', () => {
    it('should call removeFilter correctly', () => {
      const filterType = {
        name: 'name1',
        subType: 'subType1',
        parentType: 'parentType1',
        selected: true,
        filterOptions: [
          {
            name: 'name1',
            selected: true
          }
        ]
      };
      component.removeFilterType(filterType);
      expect(filterType.selected).toBeFalsy();
    });
  });

  describe('selectFilterView', () => {
    it('should call selectFilterView correctly', inject(
      [CustomFiltersService],
      (service: CustomFiltersService) => {
        component.filterTypes = [
          {
            name: 'name1',
            subType: 'subType1',
            parentType: 'parentType1',
            selected: true,
            filterOptions: [
              {
                name: 'name1',
                selected: true
              }
            ]
          },
          {
            name: 'name2',
            subType: 'subType2',
            parentType: 'parentType2',
            selected: true,
            filterOptions: [
              {
                name: 'name2',
                selected: true
              }
            ]
          }
        ];
        spyOn(component, 'deselectAllFilterTypes');
        spyOn(component, 'addFilterType');
        spyOn(service, 'getFullFilterView').and.returnValue(of(BODY));
        component.selectFilterView({ id: 'id1' });
        expect(component.selectedFilterView).toEqual(
          jasmine.objectContaining(BODY)
        );
        expect(component.deselectAllFilterTypes).toHaveBeenCalledTimes(1);
        expect(service.getFullFilterView).toHaveBeenCalledTimes(1);
      }
    ));
    it('should call selectFilterView correctly and handle http error', inject(
      [CustomFiltersService, ToastService],
      (service: CustomFiltersService, toastService: ToastService) => {
        spyOn(component, 'deselectAllFilterTypes');
        spyOn(toastService, 'error');
        spyOn(service, 'getFullFilterView').and.returnValue(
          throwError(new Error('error'))
        );
        component.selectFilterView({ id: 'id1' }); // here we will test unsubscribe
        component.selectFilterView({ id: 'id1' });
        expect(component.deselectAllFilterTypes).toHaveBeenCalledTimes(2);
        expect(service.getFullFilterView).toHaveBeenCalledTimes(2);
        expect(toastService.error).toHaveBeenCalledTimes(2);
      }
    ));
  });

  describe('addFilterType()', () => {
    it('should call addFilterType correctly', () => {
      const filterType = {
        name: 'name1',
        subType: 'subType1',
        parentType: 'parentType1',
        selected: true,
        filterOptions: [
          {
            name: 'name1',
            selected: true
          }
        ]
      };
      spyOn(component, 'getFilterOptions');
      component.addFilterType(filterType);
      expect(filterType.selected).toBeTruthy();
    });
  });

  describe('isOptionSelected()', () => {
    it('should call isOptionSelected correctly', () => {
      const filterType = {
        name: 'name1',
        subType: 'RISK',
        parentType: 'parentType1',
        selected: true,
        filterOptions: [
          {
            name: 'name1',
            selected: false
          },
          {
            name: 'name2',
            selected: false
          }
        ]
      };
      component.selectedFilterView = Object.assign({}, BODY);
      component.selectedFilterView.filters.RISK.value = ['name1'];
      filterType.filterOptions[0].selected = component.isOptionSelected(
        filterType.filterOptions[0]
      );
      expect(filterType.filterOptions[0].selected).toBeTruthy();
    });
  });

  describe('allFiltersClick()', () => {
    it('should call allFiltersClick correctly for empty filter selections', () => {
      spyOn(component, 'deselectAllFilterTypes');
      spyOn(component, 'selectFilterTypes');
      component.selectedFilterTypes = [];
      const event = {
        preventDefault: () => {}
      };
      spyOn(event, 'preventDefault');
      component.allFiltersClick(event);
      expect(event.preventDefault).toHaveBeenCalledTimes(1);
      expect(component.deselectAllFilterTypes).toHaveBeenCalledTimes(0);
      expect(component.selectFilterTypes).toHaveBeenCalledTimes(1);
    });
    it('should call allFiltersClick correctly for non-empty filter selections', () => {
      spyOn(component, 'deselectAllFilterTypes');
      spyOn(component, 'selectFilterTypes');
      component.selectedFilterTypes = ['some'];
      const event = {
        preventDefault: () => {}
      };
      spyOn(event, 'preventDefault');
      component.allFiltersClick(event);
      expect(event.preventDefault).toHaveBeenCalledTimes(1);
      expect(component.deselectAllFilterTypes).toHaveBeenCalledTimes(1);
      expect(component.selectFilterTypes).toHaveBeenCalledTimes(0);
    });
  });

  describe('selectFilterTypes()', () => {
    it('should call selectFilterTypes correctly', () => {
      component.filterTypes = [
        {
          name: 'name1',
          subType: 'subType1',
          parentType: 'parentType1',
          selected: true,
          filterOptions: [
            {
              name: 'name1',
              selected: false
            }
          ]
        },
        {
          name: 'name2',
          subType: 'subType2',
          parentType: 'parentType2',
          selected: true,
          filterOptions: [
            {
              name: 'name2',
              selected: false
            }
          ]
        }
      ];
      spyOn(component, 'addFilterType');
      component.selectFilterTypes(component.filterTypes);
      expect(component.filterTypes[0]).toBeTruthy();
      expect(component.filterTypes[1]).toBeTruthy();
    });
  });

  describe('deselectAllFilterTypes()', () => {
    it('should call deselectAllFilterTypes correctly', () => {
      component.filterTypes = [
        {
          name: 'name1',
          subType: 'subType1',
          parentType: 'parentType1',
          selected: true,
          filterOptions: [
            {
              name: 'name1',
              selected: false
            }
          ]
        },
        {
          name: 'name2',
          subType: 'subType2',
          parentType: 'parentType2',
          selected: true,
          filterOptions: [
            {
              name: 'name2',
              selected: false
            }
          ]
        }
      ];
      spyOn(component, 'removeFilterType');
      component.deselectAllFilterTypes();
      expect(component.removeFilterType).toHaveBeenCalledTimes(2);
    });
  });

  describe('onFilterTypeClick()', () => {
    it('should call onFilterTypeClick correctly for selected filter types', () => {
      spyOn(component, 'addFilterType');
      spyOn(component, 'removeFilterType');
      const filterType = {
        name: 'name1',
        subType: 'subType1',
        parentType: 'parentType1',
        selected: true,
        filterOptions: [
          {
            name: 'name1',
            selected: false
          }
        ]
      };
      component.onFilterTypeClick(filterType);
      expect(component.removeFilterType).toHaveBeenCalledTimes(0);
    });
    it('should call onFilterTypeClick correctly for non-selected filter types', () => {
      spyOn(component, 'addFilterType');
      spyOn(component, 'removeFilterType');
      const filterType = {
        name: 'name1',
        subType: 'subType1',
        parentType: 'parentType1',
        selected: false,
        filterOptions: [
          {
            name: 'name1',
            selected: false
          }
        ]
      };
      component.onFilterTypeClick(filterType);
      expect(component.addFilterType).toHaveBeenCalledTimes(0);
      expect(component.removeFilterType).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateFilter', () => {
    it('should call updateFilter correctly', inject(
      [CustomFiltersService, ToastService],
      (service: CustomFiltersService, toastService: ToastService) => {
        component.filterTypes = [
          {
            name: 'name1',
            subType: 'subType1',
            parentType: 'parentType1',
            selected: true,
            filterOptions: [
              {
                name: 'name1',
                selected: true
              }
            ]
          },
          {
            name: 'name2',
            subType: 'subType2',
            parentType: 'parentType2',
            selected: true,
            filterOptions: [
              {
                name: 'name2',
                selected: true
              }
            ]
          }
        ];
        component.selectedFilterView = BODY;
        spyOn(service, 'updateFilterView').and.returnValue(of({}));
        spyOn(toastService, 'error');
        component.updateFilter();
        expect(service.updateFilterView).toHaveBeenCalledTimes(1);
        expect(toastService.error).toHaveBeenCalledTimes(0);
      }
    ));
    it('should call updateFilter and handle http error', inject(
      [CustomFiltersService, ToastService],
      (service: CustomFiltersService, toastService: ToastService) => {
        component.filterTypes = [
          {
            name: 'name1',
            subType: 'subType1',
            parentType: 'parentType1',
            selected: true,
            filterOptions: [
              {
                name: 'name1',
                selected: true
              }
            ]
          },
          {
            name: 'name2',
            subType: 'subType2',
            parentType: 'parentType2',
            selected: true,
            filterOptions: [
              {
                name: 'name2',
                selected: true
              }
            ]
          }
        ];
        component.selectedFilterView = BODY;
        spyOn(service, 'updateFilterView').and.returnValue(
          throwError(new Error('error'))
        );
        spyOn(toastService, 'error');
        component.updateFilter(); // Here we will unsubscribe
        component.updateFilter();
        expect(service.updateFilterView).toHaveBeenCalledTimes(2);
        expect(toastService.error).toHaveBeenCalledTimes(2);
      }
    ));
  });

  describe('saveFilter', () => {
    it('should call saveFilter correctly', inject(
      [CustomFiltersService, ToastService],
      (service: CustomFiltersService, toastService: ToastService) => {
        component.filterTypes = [
          {
            name: 'name1',
            subType: 'subType1',
            parentType: 'parentType1',
            selected: true,
            filterOptions: [
              {
                name: 'name1',
                selected: true
              }
            ]
          },
          {
            name: 'name2',
            subType: 'subType2',
            parentType: 'parentType2',
            selected: true,
            filterOptions: [
              {
                name: 'name2',
                selected: true
              }
            ]
          }
        ];
        component.selectedFilterView = BODY;
        spyOn(service, 'saveFilterView').and.returnValue(of(BODY));
        spyOn(toastService, 'error');
        spyOn(component, 'getFilterViewList');
        component.saveFilter();
        expect(component.isSavingAsNew).toBeFalsy();
        expect(component.getFilterViewList).toHaveBeenCalledTimes(1);
        expect(service.saveFilterView).toHaveBeenCalledTimes(1);
        expect(toastService.error).toHaveBeenCalledTimes(0);
      }
    ));
    it('should call saveFilter correctly and handle http error', inject(
      [CustomFiltersService, ToastService],
      (service: CustomFiltersService, toastService: ToastService) => {
        component.filterTypes = [
          {
            name: 'name1',
            subType: 'subType1',
            parentType: 'parentType1',
            selected: true,
            filterOptions: [
              {
                name: 'name1',
                selected: true
              }
            ]
          },
          {
            name: 'name2',
            subType: 'subType2',
            parentType: 'parentType2',
            selected: true,
            filterOptions: [
              {
                name: 'name2',
                selected: true
              }
            ]
          }
        ];
        component.selectedFilterView = BODY;
        spyOn(service, 'saveFilterView').and.returnValue(
          throwError(new Error('error'))
        );
        spyOn(toastService, 'error');
        spyOn(component, 'getFilterViewList');
        component.saveFilter(); // Here we will unsubscribe
        component.saveFilter();
        expect(component.getFilterViewList).toHaveBeenCalledTimes(0);
        expect(service.saveFilterView).toHaveBeenCalledTimes(2);
        expect(toastService.error).toHaveBeenCalledTimes(2);
      }
    ));
  });

  describe('getFilterViewList', () => {
    it('should call getFilterViewList correctly', inject(
      [CustomFiltersService, ToastService],
      (service: CustomFiltersService, toastService: ToastService) => {
        component.filterTypes = [
          {
            name: 'name1',
            subType: 'subType1',
            parentType: 'parentType1',
            selected: true,
            filterOptions: [
              {
                name: 'name1',
                selected: true
              }
            ]
          },
          {
            name: 'name2',
            subType: 'subType2',
            parentType: 'parentType2',
            selected: true,
            filterOptions: [
              {
                name: 'name2',
                selected: true
              }
            ]
          }
        ];
        component.selectedFilterView = BODY;
        spyOn(service, 'getFilterViewList').and.returnValue(of([]));
        spyOn(toastService, 'error');
        component.getFilterViewList();
        expect(component.filterViewList).toEqual([]);
        expect(service.getFilterViewList).toHaveBeenCalledTimes(1);
        expect(toastService.error).toHaveBeenCalledTimes(0);
      }
    ));
    it('should call getFilterViewList correctly and handle http error', inject(
      [CustomFiltersService, ToastService],
      (service: CustomFiltersService, toastService: ToastService) => {
        component.filterTypes = [
          {
            name: 'name1',
            subType: 'subType1',
            parentType: 'parentType1',
            selected: true,
            filterOptions: [
              {
                name: 'name1',
                selected: true
              }
            ]
          },
          {
            name: 'name2',
            subType: 'subType2',
            parentType: 'parentType2',
            selected: true,
            filterOptions: [
              {
                name: 'name2',
                selected: true
              }
            ]
          }
        ];
        component.selectedFilterView = BODY;
        spyOn(service, 'getFilterViewList').and.returnValue(throwError([]));
        spyOn(toastService, 'error');
        component.getFilterViewList();
        expect(component.filterViewList).toEqual([]);
        expect(service.getFilterViewList).toHaveBeenCalledTimes(1);
        expect(toastService.error).toHaveBeenCalledTimes(1);
      }
    ));
  });

  describe('getFilterOptions', () => {
    it('should call getFilterOptions correctly', inject(
      [CustomFiltersService, ToastService],
      (service: CustomFiltersService, toastService: ToastService) => {
        const response = {
          filterOptions: {
            content: [
              {
                name: 'name1'
              },
              {
                name: 'name2'
              }
            ],
            pageable: 'string',
            last: false,
            totalPages: 1,
            totalElements: 1,
            sort: {
              sorted: true,
              unsorted: false,
              empty: false
            },
            numberOfElements: 1,
            first: true,
            size: 5,
            number: 1,
            empty: false
          }
        };
        const filterType = {
          name: 'name1',
          subType: 'subType1',
          parentType: 'parentType1',
          selected: false,
          filterOptions: [
            {
              name: 'name1',
              selected: false
            }
          ]
        };
        component.filterTypes = [
          {
            name: 'name1',
            subType: 'subType1',
            parentType: 'parentType1',
            selected: true,
            filterOptions: [
              {
                name: 'name1',
                selected: true
              }
            ]
          },
          {
            name: 'name2',
            subType: 'subType2',
            parentType: 'parentType2',
            selected: true,
            filterOptions: [
              {
                name: 'name2',
                selected: true
              }
            ]
          }
        ];
        component.selectedFilterView = BODY;
        spyOn(service, 'getFilterSubTypeOptions').and.returnValue(of(response));
        spyOn(toastService, 'error');
        component.getFilterOptions([filterType]);
        expect(service.getFilterSubTypeOptions).toHaveBeenCalledTimes(1);
        expect(toastService.error).toHaveBeenCalledTimes(0);
      }
    ));
    it('should call getFilterOptions correctly and handle error', inject(
      [CustomFiltersService, ToastService],
      (service: CustomFiltersService, toastService: ToastService) => {
        const filterType = {
          name: 'name1',
          subType: 'subType1',
          parentType: 'parentType1',
          selected: false,
          filterOptions: [
            {
              name: 'name1',
              selected: false
            }
          ]
        };
        spyOn(component, 'getFilterTypeOptions').and.returnValue(
          throwError(new Error('error'))
        );
        component.getFilterOptions([filterType]);
        expect(component.getFilterTypeOptions).toHaveBeenCalledTimes(1);
      }
    ));
  });

  describe('initFilterTypes', () => {
    it('should call initFilterTypes correctly', inject(
      [CustomFiltersService, ToastService],
      (service: CustomFiltersService, toastService: ToastService) => {
        const filterTypes = [
          {
            name: 'name1',
            subType: 'subType1',
            parentType: 'parentType1',
            selected: true,
            filterOptions: [
              {
                name: 'name1',
                selected: true
              }
            ]
          },
          {
            name: 'name2',
            subType: 'subType2',
            parentType: 'parentType2',
            selected: true,
            filterOptions: [
              {
                name: 'name2',
                selected: true,
                content: []
              }
            ]
          }
        ];
        const response = {
          filterOptions: {
            content: [
              {
                name: 'name1'
              },
              {
                name: 'name2'
              }
            ],
            pageable: 'string',
            last: false,
            totalPages: 1,
            totalElements: 1,
            sort: {
              sorted: true,
              unsorted: false,
              empty: false
            },
            numberOfElements: 1,
            first: true,
            size: 5,
            number: 1,
            empty: false
          }
        };
        component.filterTypes = filterTypes;
        spyOn(service, 'getFilterTypes').and.returnValue(of(response));
        spyOn(service, 'emitFilterTypesUpdated').and.returnValue(
          of(filterTypes)
        );
        spyOn(component, 'clearFilters');
        spyOn(toastService, 'error');
        component.initFilterTypes();
        expect(service.getFilterTypes).toHaveBeenCalledTimes(1);
        expect(service.emitFilterTypesUpdated).toHaveBeenCalledTimes(1);
        expect(toastService.error).toHaveBeenCalledTimes(0);
      }
    ));
    it('should call initFilterTypes correctly - handle service error', inject(
      [CustomFiltersService, ToastService],
      (service: CustomFiltersService, toastService: ToastService) => {
        const filterTypes = [
          {
            name: 'name1',
            subType: 'subType1',
            parentType: 'parentType1',
            selected: true,
            filterOptions: [
              {
                name: 'name1',
                selected: true
              }
            ]
          },
          {
            name: 'name2',
            subType: 'subType2',
            parentType: 'parentType2',
            selected: true,
            filterOptions: [
              {
                name: 'name2',
                selected: true,
                content: []
              }
            ]
          }
        ];
        const response = {
          filterOptions: {
            content: [
              {
                name: 'name1'
              },
              {
                name: 'name2'
              }
            ],
            pageable: 'string',
            last: false,
            totalPages: 1,
            totalElements: 1,
            sort: {
              sorted: true,
              unsorted: false,
              empty: false
            },
            numberOfElements: 1,
            first: true,
            size: 5,
            number: 1,
            empty: false
          }
        };
        component.filterTypes = filterTypes;
        spyOn(service, 'getFilterTypes').and.returnValue(
          throwError(new Error('Error'))
        );
        spyOn(service, 'emitFilterTypesUpdated');
        spyOn(component, 'clearFilters');
        spyOn(toastService, 'error');
        component.initFilterTypes();
        expect(service.getFilterTypes).toHaveBeenCalledTimes(1);
        expect(service.emitFilterTypesUpdated).toHaveBeenCalledTimes(0);
        expect(component.clearFilters).toHaveBeenCalledTimes(0);
        expect(toastService.error).toHaveBeenCalledTimes(1);
      }
    ));
  });
});
