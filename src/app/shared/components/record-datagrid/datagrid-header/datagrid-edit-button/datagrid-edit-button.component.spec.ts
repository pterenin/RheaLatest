import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatagridEditButtonComponent } from './datagrid-edit-button.component';
import { TaDatagridModule, TaModal } from '@trustarc/ui-toolkit';
import { DatagridHeaderService } from 'src/app/shared/services/record-listing/datagrid-header.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('DatagridEditButtonComponent', () => {
  let component: DatagridEditButtonComponent;
  let fixture: ComponentFixture<DatagridEditButtonComponent>;
  let router: Router;
  const selectedId = 'test-id-123';

  beforeEach(async(() => {
    const datagridHeaderService = jasmine.createSpyObj(
      DatagridHeaderService.prototype
    );

    datagridHeaderService.viewSelectedPageItems.and.returnValue(
      of([{ id: selectedId }])
    );

    TestBed.configureTestingModule({
      declarations: [DatagridEditButtonComponent],
      imports: [TaDatagridModule, RouterTestingModule],
      providers: [
        {
          provide: TaModal,
          useValue: jasmine.createSpyObj(TaModal.prototype)
        },
        {
          provide: DatagridHeaderService,
          useValue: datagridHeaderService
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatagridEditButtonComponent);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open confirm delete modal when clicked', () => {
    const navigateSpy = spyOn(router, 'navigate');

    const editButton = fixture.debugElement.query(By.css('button'));

    editButton.triggerEventHandler('click', null);

    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith([
      '/business-process/' + selectedId
    ]);
  });
});
