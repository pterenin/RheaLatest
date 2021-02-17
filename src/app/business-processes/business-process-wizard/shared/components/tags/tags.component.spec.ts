import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TaBadgeModule,
  TaDropdownModule,
  TaActiveModal
} from '@trustarc/ui-toolkit';
import { TagsSelectorComponent } from 'src/app/shared/components/tags-selector/tags-selector.component';
import { TagsComponent } from './tags.component';
import { DropdownFieldModule } from 'src/app/shared/components/dropdown/dropdown-field.module';
import { TagsSelectorService } from '../../../../../shared/components/tags-selector/tags-selector.service';
// tslint:disable-next-line:max-line-length
import { BaseRecordsControllerService } from '../../../../../shared/_services/rest-api/base-records-controller/base-records-controller.service';
import { of, throwError } from 'rxjs';

describe('TagsComponent', () => {
  let component: TagsComponent;
  let fixture: ComponentFixture<TagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TagsComponent, TagsSelectorComponent],
      imports: [
        TaBadgeModule,
        ReactiveFormsModule,
        FormsModule,
        DropdownFieldModule,
        TaDropdownModule,
        HttpClientTestingModule
      ],
      providers: [TaActiveModal, TagsSelectorService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('selectedTagsChange()', () => {
    it('should call selectedTagsChange() correctly - selectedTags', () => {
      component.selectedTagsChange([]);
      fixture.detectChanges();

      expect(component.selectedTags.length).toEqual(0);
    });
    it('should call selectedTagsChange() correctly - selectedTags, length', () => {
      const selectedTags = [
        {
          id: 'id',
          tagGroupType: 'tagGroupType',
          values: [
            {
              id: 'id',
              tag: 'tag'
            }
          ]
        }
      ];
      component.selectedTagsChange(selectedTags);
      fixture.detectChanges();

      expect(component.selectedTags.length).toEqual(1);
    });
    it('should call selectedTagsChange() correctly - tagsCount', () => {
      const spy = spyOn(component.tagsCount, 'next');

      component.selectedTagsChange([]);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(0);
    });
    it('should call selectedTagsChange() correctly - tagFormsGroup', () => {
      const spy = spyOn(component.tagFormsGroup, 'markAsDirty');

      component.selectedTagsChange([]);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('saveTags()', () => {
    it('should call saveTags() correctly - success', () => {
      const baseRecordsService = TestBed.get(BaseRecordsControllerService);
      component.thereAreTagsBP = true;
      fixture.detectChanges();

      const spy = spyOn(
        component.tagsSelector,
        'extractTagsFromFormControls'
      ).and.returnValue([]);

      const baseRecordsServiceSpy = spyOn(
        baseRecordsService,
        'putTags'
      ).and.returnValue(of([]));

      component.saveTags();
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(baseRecordsServiceSpy).toHaveBeenCalledTimes(1);
    });
    it('should call saveTags() correctly - error', () => {
      const baseRecordsService = TestBed.get(BaseRecordsControllerService);
      component.thereAreTagsBP = true;
      fixture.detectChanges();

      const spy = spyOn(
        component.tagsSelector,
        'extractTagsFromFormControls'
      ).and.returnValue([]);

      const baseRecordsServiceSpy = spyOn(
        baseRecordsService,
        'putTags'
      ).and.returnValue(throwError('Error'));

      const consoleSpy = spyOn(console, 'error');

      component.saveTags();
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(baseRecordsServiceSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith('Error');
    });
  });

  describe('closeModal()', () => {
    it('should call closeModal() correctly - count > 0', () => {
      const spy = spyOn(component.activeModal, 'close');

      component.closeModal(3);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(3);
    });
    it('should call closeModal() correctly - count = 0', () => {
      component.selectedTags = [];
      const spy = spyOn(component.activeModal, 'close');

      component.closeModal(0);
      fixture.detectChanges();

      expect(component.selectedTags.length).toEqual(0);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(0);
    });
  });

  describe('onCancel()', () => {
    it('should call onCancel() correctly', () => {
      const spy = spyOn(component.activeModal, 'dismiss');
      component.onCancel();
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('dismissModal()', () => {
    it('should call dismissModal() correctly', () => {
      const spy = spyOn(component.activeModal, 'dismiss');
      component.dismissModal();
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('validateAllTagsForBP()', () => {
    it('should call validateAllTagsForBP() correctly - success', () => {
      const baseRecordsService = TestBed.get(BaseRecordsControllerService);
      const baseRecordsServiceSpy = spyOn(
        baseRecordsService,
        'getAllTags'
      ).and.returnValue(of(['tag1', 'tag2']));

      component.validateAllTagsForBP();
      fixture.detectChanges();

      expect(baseRecordsServiceSpy).toHaveBeenCalledTimes(1);
      expect(component.isFetching).toBeFalsy();
      expect(component.thereAreTagsBP).toBeTruthy();
      expect(component.allTags).toEqual(
        jasmine.objectContaining(['tag1', 'tag2'])
      );
    });
    it('should call validateAllTagsForBP() correctly - error', () => {
      const baseRecordsService = TestBed.get(BaseRecordsControllerService);
      const baseRecordsServiceSpy = spyOn(
        baseRecordsService,
        'getAllTags'
      ).and.returnValue(throwError('Error'));
      const consoleSpy = spyOn(console, 'error');

      component.validateAllTagsForBP();
      fixture.detectChanges();

      expect(consoleSpy).toHaveBeenCalledWith('Error');
      expect(baseRecordsServiceSpy).toHaveBeenCalledTimes(1);
      expect(component.isFetching).toBeFalsy();
      expect(component.isShowingSpinner).toBeFalsy();
      expect(component.allTags).toEqual(jasmine.objectContaining([]));
    });
  });
});
