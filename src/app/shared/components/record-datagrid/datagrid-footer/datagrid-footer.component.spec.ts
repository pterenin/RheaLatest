import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TaDropdownModule, TaPaginationModule } from '@trustarc/ui-toolkit';
import { DatagridFooterComponent } from './datagrid-footer.component';

describe('DatagridFooterComponent', () => {
  let component: DatagridFooterComponent;
  let fixture: ComponentFixture<DatagridFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DatagridFooterComponent],
      imports: [TaPaginationModule, TaDropdownModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatagridFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init with a collectionSize of 0', () => {
    expect(component.collectionSize).toEqual(0);
  });

  it('should init on page 1', () => {
    expect(component.page).toEqual(1);
  });

  it('should init with a page size of 25', () => {
    expect(component.pageSize).toEqual(25);
  });

  it('should update the page-size member on page size change', () => {
    component.onChangePageSize(50);
    expect(component.pageSize).toEqual(50);
  });

  it('should update the old-page-value if old-page and current page are not equal on ngAfterContentChecked()', () => {
    component.oldPageValue = 5;
    expect(component.oldPageValue).toEqual(5);
    component.ngAfterContentChecked();
    expect(component.oldPageValue).toEqual(1);
    component.page = 10;
    expect(component.oldPageValue).toEqual(1);
    component.ngAfterContentChecked();
    expect(component.oldPageValue).toEqual(10);
  });
});
