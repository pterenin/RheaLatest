import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatagridSearchBoxComponent } from './datagrid-search-box.component';
import { DatagridService, TaIconSearchModule } from '@trustarc/ui-toolkit';
import { DatagridHeaderService } from 'src/app/shared/services/record-listing/datagrid-header.service';

describe('DatagridSearchBoxComponent', () => {
  let component: DatagridSearchBoxComponent;
  let fixture: ComponentFixture<DatagridSearchBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DatagridSearchBoxComponent],
      imports: [TaIconSearchModule],
      providers: [DatagridHeaderService, DatagridService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatagridSearchBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
