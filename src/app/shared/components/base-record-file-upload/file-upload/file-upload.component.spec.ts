import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FileUploadComponent } from './file-upload.component';
import { CommonModule } from '@angular/common';
import {
  TaButtonsModule,
  TaDatagridModule,
  TaDropdownModule,
  ToastService
} from '@trustarc/ui-toolkit';
import { RouterModule } from '@angular/router';
import { FileUploadService } from './file-upload.validation.service';

const testFiles = [
  {
    lastModified: 1500514945000,
    lastModifiedDate: 'Thu Mar 20 2019 09:42:25 GMT+0800 (CST)',
    name: 'test1.csv',
    type: 'csv',
    size: 223678
  },
  {
    lastModified: 1500514945000,
    lastModifiedDate: 'Thu Mar 20 2019 09:42:25 GMT+0800 (CST)',
    name: 'test2.png',
    type: 'png',
    size: 116873
  }
];

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;
  let testHostComponent: TestHostComponent;
  let testHostFixture: ComponentFixture<TestHostComponent>;

  @Component({
    selector: `ta-test-host-component`,
    template: `
      <ta-file-upload [text]="text" [linkText]="linkText"></ta-file-upload>
    `
  })
  class TestHostComponent {
    private text: string;
    private linkText: string;

    setInputs(inputName: string, value: string) {
      this[inputName] = value;
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FileUploadComponent, TestHostComponent],
      imports: [
        CommonModule,
        RouterTestingModule,
        TaDatagridModule,
        TaDropdownModule,
        TaButtonsModule
      ],
      providers: [RouterModule, FileUploadService, ToastService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadComponent);
    testHostFixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    testHostComponent = testHostFixture.componentInstance;
    testHostFixture.detectChanges();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display provided text', () => {
    const text = 'test text';
    testHostComponent.setInputs('text', text);
    testHostFixture.detectChanges();
    expect(
      testHostFixture.nativeElement.querySelector('div').innerText
    ).toContain(text);
  });

  it('should display provided Link text', () => {
    const linkText = 'test linkText';
    testHostComponent.setInputs('linkText', linkText);
    testHostFixture.detectChanges();
    expect(
      testHostFixture.nativeElement.querySelector('label').innerText
    ).toContain(linkText);
  });

  it('should call selectFiles method on every file Drop', () => {
    const testEvent = new CustomEvent('drop') as any;
    testEvent.dataTransfer = {
      files: testFiles
    };
    spyOn(component, 'selectFiles');
    component.onDrop(testEvent);
    expect(component.selectFiles).toHaveBeenCalled();
  });

  it('should call selectFiles method on every file Drop and handle file restriction', () => {
    const toastService = TestBed.get(ToastService);
    const testEvent = new CustomEvent('drop') as any;
    component.fileRestriction = 'csv';
    testEvent.dataTransfer = {
      files: testFiles
    };
    spyOn(component, 'selectFiles');
    spyOn(toastService, 'error');
    component.onDrop(testEvent);
    expect(component.selectFiles).toHaveBeenCalledTimes(1);
    expect(toastService.error).toHaveBeenCalledTimes(1);
  });

  it('should call selectFiles method on every file selected', () => {
    const testEvent = {
      target: {
        files: testFiles
      }
    };
    spyOn(component, 'selectFiles');
    component.onFileSelected(testEvent);
    expect(component.selectFiles).toHaveBeenCalled();
  });

  it('should propogate formControl change on every file fileSelect call', () => {
    spyOn(component, 'propagateChange');
    component.selectFiles(testFiles);
    expect(component.propagateChange).toHaveBeenCalled();
  });

  it('no "dragging-over" class initially', () => {
    expect(component.draggingOver).toEqual(false);
  });

  it('should add "dragging-over" class to container onDragOver', () => {
    const event = new CustomEvent('dragoverd');
    component.onDragOver(event);
    expect(component.draggingOver).toEqual(true);
  });

  it('should remove "dragging-over" class  ononDragLeave', () => {
    const event = new CustomEvent('dragleave');
    component.onDragLeave(event);
    expect(component.draggingOver).toEqual(false);
  });

  it('should call registerOnChange and assign propagate change', () => {
    const fn = () => 'test';
    component.registerOnChange(fn);
    const test = component.propagateChange();
    expect(test).toEqual('test');
  });

  it('should not accept `null` or `undefined` values', () => {
    component.writeValue(testFiles);
    expect(component.files).toBeDefined();
    component.writeValue(null);
    expect(component.files).toBeDefined();
    expect(component.files).not.toBe(null);
    component.writeValue(undefined);
    expect(component.files).not.toBeUndefined();
  });
});
