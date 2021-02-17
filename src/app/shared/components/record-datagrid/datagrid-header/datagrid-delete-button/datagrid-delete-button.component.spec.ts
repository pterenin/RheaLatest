import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatagridDeleteButtonComponent } from './datagrid-delete-button.component';
import { TaDatagridModule, TaModal, TaToastModule } from '@trustarc/ui-toolkit';
import { DatagridHeaderService } from 'src/app/shared/services/record-listing/datagrid-header.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { ConfirmDeleteContentComponent } from '../../confirm-delete-content/confirm-delete-content.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('DatagridDeleteButtonComponent', () => {
  let component: DatagridDeleteButtonComponent;
  let fixture: ComponentFixture<DatagridDeleteButtonComponent>;

  beforeEach(async(() => {
    const datagridHeaderService = jasmine.createSpyObj(
      DatagridHeaderService.prototype
    );

    datagridHeaderService.viewSelectedPageItems.and.returnValue(of([]));

    TestBed.configureTestingModule({
      declarations: [DatagridDeleteButtonComponent],
      imports: [
        TaDatagridModule,
        HttpClientTestingModule,
        TaToastModule,
        RouterTestingModule
      ],
      providers: [
        {
          provide: DatagridHeaderService,
          useValue: datagridHeaderService
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatagridDeleteButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open confirm delete modal when clicked', () => {
    const modalService = TestBed.get(TaModal);
    spyOn(modalService, 'open').and.returnValue({
      result: Promise.resolve()
    });
    const deleteButton = fixture.debugElement.query(By.css('button'));

    deleteButton.triggerEventHandler('click', null);

    expect(modalService.open).toHaveBeenCalledWith(
      ConfirmDeleteContentComponent,
      {
        windowClass: 'modal-white'
      }
    );
  });
});
