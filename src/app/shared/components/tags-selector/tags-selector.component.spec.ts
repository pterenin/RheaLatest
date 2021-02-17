import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsSelectorComponent } from './tags-selector.component';
import { DropdownFieldModule } from '../dropdown/dropdown-field.module';
import { DropdownHierarchyModule } from '../dropdown-hierarchy/dropdown-hierarchy.module';
import {
  ControlContainer,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import {
  TaDropdownModule,
  TaTagsModule,
  TaToastModule
} from '@trustarc/ui-toolkit';
import { TagsSelectorService } from './tags-selector.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserService } from '../../services/user/user.service';
import { of } from 'rxjs';

describe('TagsSelectorComponent', () => {
  let component: TagsSelectorComponent;
  let fixture: ComponentFixture<TagsSelectorComponent>;
  const group1Values = [
    {
      id: 'tag-1',
      tag: 'Tag 1'
    },
    {
      id: 'tag-2',
      tag: 'Tag 2'
    }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TagsSelectorComponent],
      imports: [
        DropdownFieldModule,
        FormsModule,
        HttpClientModule,
        HttpClientTestingModule,
        TaToastModule,
        TaTagsModule,
        TaDropdownModule,
        ReactiveFormsModule,
        DropdownHierarchyModule
      ],
      providers: [
        FormBuilder,
        TagsSelectorService,
        {
          provide: ControlContainer,
          useValue: {
            // This must be a real control because the html depends on being
            // able to add the child tag controls to this.
            control: new FormGroup({})
          }
        },
        {
          provide: UserService,
          useValue: {
            getUsersSearch: () => of([]),
            getUsersResponse: () => of([])
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsSelectorComponent);
    component = fixture.componentInstance;
    component.allTags = [
      {
        id: 'group-1',
        multipleValuesAllowed: false,
        tagGroupName: 'Group 1',
        tagGroupType: 'SELECTABLE',
        values: group1Values
      },
      {
        id: 'group-2',
        multipleValuesAllowed: true,
        tagGroupName: 'Group 2',
        tagGroupType: 'TEXT',
        values: [
          {
            id: 'tag-3',
            tag: 'Tag 3'
          }
        ]
      }
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a form control for each tag group', () => {
    component.updateFormFields();
    expect(component.tagGroupFormArray.length).toEqual(2);
    expect(component.tagGroupFormArray.at(0).get('values').value).toEqual(
      group1Values
    );
  });

  it('should add 256 limit validator to text controls', () => {
    component.updateFormFields();
    component.tagGroupFormArray
      .at(1)
      .patchValue({ selected: new Array(256).join('z') });
    component.tagGroupFormArray.updateValueAndValidity();
    expect(component.tagGroupFormArray.at(1).valid).toEqual(true);
    component.tagGroupFormArray
      .at(1)
      .patchValue({ selected: new Array(257).join('z') });
    component.tagGroupFormArray.updateValueAndValidity();
    expect(component.tagGroupFormArray.at(1).valid).toEqual(false);
  });

  describe('getTags()', () => {
    it('should call getTags() and set baseDomainType correctly', () => {
      const tagsSelectorService = TestBed.get(TagsSelectorService);
      spyOn(tagsSelectorService, 'getAllTags').and.returnValue(of([]));
      spyOn(component, 'updateFormFields').and.callThrough();
      component.baseDomainType = 0;
      fixture.detectChanges();
      component.getTags().subscribe(() => {
        expect(component.updateFormFields).toHaveBeenCalledTimes(2);
        expect(tagsSelectorService.getAllTags).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('getSelectedTags()', () => {
    it('should call getSelectedTags() correctly', () => {
      const tagsSelectorService = TestBed.get(TagsSelectorService);
      spyOn(tagsSelectorService, 'getSelectedTags').and.returnValue(of([]));
      component.allTags = [
        {
          id: 'group-1',
          multipleValuesAllowed: false,
          tagGroupName: 'Group 1',
          tagGroupType: 'SELECTABLE',
          values: group1Values
        },
        {
          id: 'group-2',
          multipleValuesAllowed: true,
          tagGroupName: 'Group 2',
          tagGroupType: 'TEXT',
          values: [
            {
              id: 'tag-3',
              tag: 'Tag 3'
            }
          ]
        }
      ];
      fixture.detectChanges();
      spyOn(component, 'updateFormFields').and.callThrough();
      component.baseDomainId = 'baseDomainId';
      expect(component.updateFormFields).toHaveBeenCalledTimes(1);
    });
    it('should call getSelectedTags() correctly - baseDomainId undefined', () => {
      const tagsSelectorService = TestBed.get(TagsSelectorService);
      spyOn(tagsSelectorService, 'getSelectedTags').and.returnValue(of([]));
      component.selectedTags = [
        {
          id: 'id',
          multipleValuesAllowed: true,
          tagGroupName: 'tagGroupName',
          tagGroupType: 'tagGroupType',
          values: [
            {
              id: 'id',
              tag: 'tag'
            }
          ]
        },
        {
          id: 'id',
          multipleValuesAllowed: true,
          tagGroupName: 'tagGroupName',
          tagGroupType: 'tagGroupType',
          values: [
            {
              id: 'id',
              tag: 'tag'
            }
          ]
        }
      ];
      spyOn(component, 'updateFormFields').and.callThrough();
      component.baseDomainId = undefined;
      fixture.detectChanges();
      component.getSelectedTags().subscribe(res => {
        expect(Array.isArray(res)).toBeTruthy();
        expect(res.length === 0).toBeTruthy();
      });
    });
  });

  it('should call moveSelectedTagsIntoFormControls() correctly', () => {
    fixture.detectChanges();
    const selectedTags = [
      {
        id: 'group-1',
        multipleValuesAllowed: false,
        tagGroupName: 'Group 1',
        tagGroupType: 'SELECTABLE',
        values: group1Values
      },
      {
        id: 'group-2',
        multipleValuesAllowed: true,
        tagGroupName: 'Group 2',
        tagGroupType: 'TEXT',
        values: [
          {
            id: 'tag-3',
            tag: 'Tag 3'
          }
        ]
      }
    ];
    const tags = [
      {
        id: 'group-1',
        multipleValuesAllowed: false,
        tagGroupName: 'Group 1',
        tagGroupType: 'SELECTABLE',
        values: group1Values
      },
      {
        id: 'group-2',
        multipleValuesAllowed: true,
        tagGroupName: 'Group 2',
        tagGroupType: 'TEXT',
        values: [
          {
            id: 'tag-3',
            tag: 'Tag 3'
          }
        ]
      }
    ];
    component.createFormBasedOnTagGroups(tags);
    component.moveSelectedTagsIntoFormControls(selectedTags);
    expect(component.tagGroupFormArray.status).toEqual('VALID');
  });

  it('should call moveSelectedTagsIntoFormControls() correctly - with multipleValuesAllowed true', () => {
    fixture.detectChanges();
    const selectedTags = [
      {
        id: 'group-1',
        multipleValuesAllowed: true,
        tagGroupName: 'Group 1',
        tagGroupType: 'SELECTABLE',
        values: group1Values
      },
      {
        id: 'group-2',
        multipleValuesAllowed: true,
        tagGroupName: 'Group 2',
        tagGroupType: 'TEXT',
        values: [
          {
            id: 'tag-3',
            tag: 'Tag 3'
          }
        ]
      }
    ];
    const tags = [
      {
        id: 'group-1',
        multipleValuesAllowed: true,
        tagGroupName: 'Group 1',
        tagGroupType: 'SELECTABLE',
        values: group1Values
      },
      {
        id: 'group-2',
        multipleValuesAllowed: true,
        tagGroupName: 'Group 2',
        tagGroupType: 'TEXT',
        values: [
          {
            id: 'tag-3',
            tag: 'Tag 3'
          }
        ]
      }
    ];
    component.createFormBasedOnTagGroups(tags);
    component.moveSelectedTagsIntoFormControls(selectedTags);
    expect(component.tagGroupFormArray.status).toEqual('VALID');
  });

  describe('extractTagsFromFormControls()', () => {
    it('should call extractTagsFromFormControls() correctly', () => {
      component.selectedTags = [
        {
          id: 'group-1',
          multipleValuesAllowed: true,
          tagGroupName: 'Group 1',
          tagGroupType: 'SELECTABLE',
          values: group1Values
        },
        {
          id: 'group-2',
          multipleValuesAllowed: true,
          tagGroupName: 'Group 2',
          tagGroupType: 'TEXT',
          values: [
            {
              id: 'tag-3',
              tag: 'Tag 3'
            }
          ]
        }
      ];
      fixture.detectChanges();
      const tags = [
        {
          id: 'group-1',
          multipleValuesAllowed: false,
          tagGroupName: 'Group 1',
          tagGroupType: 'SELECTABLE',
          values: group1Values
        },
        {
          id: 'group-2',
          multipleValuesAllowed: false,
          tagGroupName: 'Group 2',
          tagGroupType: 'TEXT',
          values: [
            {
              id: 'tag-3',
              tag: 'Tag 3'
            }
          ]
        }
      ];
      component.createFormBasedOnTagGroups(tags);
      component.extractTagsFromFormControls();
      expect(component.tagGroupFormArray.status).toEqual('VALID');
    });
  });

  describe('requestForInfiniteList()', () => {
    it('should call requestForInfiniteList() correctly', () => {
      component.userTags = [];
      fixture.detectChanges();
      spyOn(component, 'searchUsers').and.returnValue(
        of({
          content: [],
          last: 'last'
        })
      );
      spyOn(component, 'updateUserOptionsListWithResponse').and.returnValue(
        of({})
      );
      component.requestForInfiniteList({ endIndex: 10 });
      expect(component.searchUsers).toHaveBeenCalledTimes(1);
      expect(component.updateUserOptionsListWithResponse).toHaveBeenCalledTimes(
        1
      );
      expect(component.updateUserOptionsListWithResponse).toHaveBeenCalledWith(
        []
      );
    });
  });

  describe('searchUsers()', () => {
    it('should call searchUsers() correctly with params', () => {
      const userService = TestBed.get(UserService);
      spyOn(userService, 'getUsersResponse').and.returnValue(of({}));
      component.searchUsers('searchTerm', 5);
      expect(userService.getUsersResponse).toHaveBeenCalledTimes(1);
      expect(userService.getUsersResponse).toHaveBeenCalledWith(
        'searchTerm',
        5
      );
    });

    it('should call searchUsers() correctly with params empty', () => {
      const userService = TestBed.get(UserService);
      spyOn(userService, 'getUsersResponse').and.returnValue(of({}));
      component.searchUsers('');
      expect(userService.getUsersResponse).toHaveBeenCalledTimes(1);
      expect(userService.getUsersResponse).toHaveBeenCalledWith('', 0);
    });

    it('should call searchUsers() correctly with params page = 0', () => {
      const userService = TestBed.get(UserService);
      spyOn(userService, 'getUsersResponse').and.returnValue(of({}));
      component.searchUsers('searchTerm', 0);
      expect(userService.getUsersResponse).toHaveBeenCalledTimes(1);
      expect(userService.getUsersResponse).toHaveBeenCalledWith(
        'searchTerm',
        0
      );
    });
  });

  describe('requestForInfiniteList()', () => {
    it('should call requestForInfiniteList() correctly with params', () => {
      const userService = TestBed.get(UserService);
      spyOn(userService, 'getUsersResponse').and.returnValue(of({}));
      component.searchUsers('searchTerm', 5);
      expect(userService.getUsersResponse).toHaveBeenCalledTimes(1);
      expect(userService.getUsersResponse).toHaveBeenCalledWith(
        'searchTerm',
        5
      );
    });
  });

  describe('updateUserOptionsListWithResponse()', () => {
    it('should call updateUserOptionsListWithResponse() correctly', () => {
      const users = [
        {
          id: 'id1',
          name: 'name1',
          email: 'email1'
        },
        {
          id: 'id2',
          name: 'name2',
          email: 'email2'
        }
      ];
      const userTags = component.updateUserOptionsListWithResponse(users);
      expect(userTags).toEqual(
        jasmine.objectContaining([
          {
            id: 'id1',
            tag: 'name1 - email1'
          },
          {
            id: 'id2',
            tag: 'name2 - email2'
          }
        ])
      );
    });
  });

  describe('isChanged()', () => {
    it('should call isChanged() correctly - currentTags != selectedTags', () => {
      component.extractTagsFromFormControls = () => [
        {
          id: 'id',
          multipleValuesAllowed: true,
          tagGroupName: 'tagGroupName',
          tagGroupType: 'tagGroupType',
          values: [
            {
              id: 'id',
              tag: 'tag'
            }
          ]
        }
      ];
      component.selectedTags = [
        {
          id: 'id',
          multipleValuesAllowed: true,
          tagGroupName: 'tagGroupName',
          tagGroupType: 'tagGroupType',
          values: [
            {
              id: 'id',
              tag: 'tag'
            }
          ]
        },
        {
          id: 'id',
          multipleValuesAllowed: true,
          tagGroupName: 'tagGroupName',
          tagGroupType: 'tagGroupType',
          values: [
            {
              id: 'id',
              tag: 'tag'
            }
          ]
        }
      ];
      fixture.detectChanges();
      const res = component.isChanged();
      expect(res).toBeTruthy();
    });

    it('should call isChanged() correctly - currentTags empty', () => {
      component.extractTagsFromFormControls = () => [];
      component.selectedTags = [];
      fixture.detectChanges();
      const res = component.isChanged();
      expect(res).toBeFalsy();
    });

    it('should call isChanged() correctly - currentTags non empty', () => {
      component.extractTagsFromFormControls = () => [
        {
          id: 'id1',
          multipleValuesAllowed: true,
          tagGroupName: 'tagGroupName',
          tagGroupType: 'tagGroupType',
          values: [
            {
              id: 'id',
              tag: 'tag'
            }
          ]
        },
        {
          id: 'id2',
          multipleValuesAllowed: true,
          tagGroupName: 'tagGroupName',
          tagGroupType: 'tagGroupType',
          values: [
            {
              id: 'id',
              tag: 'tag'
            }
          ]
        }
      ];
      component.selectedTags = [
        {
          id: 'id',
          multipleValuesAllowed: true,
          tagGroupName: 'tagGroupName',
          tagGroupType: 'tagGroupType',
          values: [
            {
              id: 'id',
              tag: 'tag'
            }
          ]
        },
        {
          id: 'id',
          multipleValuesAllowed: true,
          tagGroupName: 'tagGroupName',
          tagGroupType: 'tagGroupType',
          values: [
            {
              id: 'id',
              tag: 'tag'
            }
          ]
        }
      ];
      fixture.detectChanges();
      const res = component.isChanged();
      expect(res).toBeFalsy();
    });
  });

  describe('save()', () => {
    it('should call save() correctly - isChanged false', () => {
      component.isChanged = () => false;
      fixture.detectChanges();
      component.save().subscribe(res => {
        expect(res).toEqual(jasmine.objectContaining({}));
      });
    });

    it('should call save() correctly - isChanged true', () => {
      const tagsSelectorService = TestBed.get(TagsSelectorService);
      spyOn(tagsSelectorService, 'updateTags').and.returnValue(of({}));
      spyOn(component, 'extractTagsFromFormControls').and.returnValue({});
      const spy = spyOnProperty(component, 'baseDomainId', 'get');
      component.isChanged = () => true;
      component.ngOnInit = () => {};
      fixture.detectChanges();
      component.save().subscribe(() => {
        expect(tagsSelectorService.updateTags).toHaveBeenCalledTimes(1);
        expect(component.extractTagsFromFormControls).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledTimes(1);
      });
    });
  });
});
