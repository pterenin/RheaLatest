import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  TaBadgeModule,
  TaButtonsModule,
  TaCheckboxModule,
  TaDropdownModule,
  TaPaginationModule,
  TaSvgIconModule,
  TaTableModule,
  TaToastModule
} from '@trustarc/ui-toolkit';
import { PageWrapperModule } from 'src/app/shared/components/page-wrapper/page-wrapper.module';
import { DataElementDetailsInterface } from 'src/app/shared/models/data-elements.model';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { MockModule } from 'ng-mocks';
import { TranslateModule } from '@ngx-translate/core';
import { EntityTypePipeModule } from 'src/app/shared/pipes/entity-type/entity-type.module';
import { CustomItemDetailsComponent } from './custom-item-details.component';
// tslint:disable-next-line:max-line-length
import { DataElementDetailsService } from '../../../../../settings/data-elements/data-element-categories/data-element-category/data-element-details/data-element-details.service';

describe('CustomItemDetailsComponent', () => {
  let component: CustomItemDetailsComponent;
  let fixture: ComponentFixture<CustomItemDetailsComponent>;

  const mockData: DataElementDetailsInterface = {
    id: '9b01130a-c13f-11e9-a32f-2a2ae2dbcce4',
    name: 'Influence Ranking',
    isCustom: false,
    version: 1,
    businessProcesses: [
      {
        id: '9b01130a-c95f-11e9-a32f-2a2ae2dbcce4',
        version: 1,
        name: 'Customer Success',
        linkedRecords: [
          {
            id: '9b0116ac-c95f-11e9-a32f-2a2ae2dbcce4',
            name: 'Customer',
            type: 'STEP_6',
            version: 1,
            businessProcessId: '9b01130a-c95f-11e9-a32f-2a2ae2dbcce4',
            businessProcessName: 'Influence Ranking'
          },
          {
            id: '9b0117e2-c95f-11e9-a32f-2a2ae2dbcce4',
            name: 'Service',
            type: 'IT_SYSTEM',
            version: 1,
            businessProcessId: '9b01130a-c95f-11e9-a32f-2a2ae2dbcce4',
            businessProcessName: 'Influence Ranking'
          }
        ]
      },
      {
        id: '9b011562-c95f-11e9-a32f-2a2ae2dbcce4',
        version: 1,
        name: 'Digital Marketing',
        linkedRecords: [
          {
            id: '9b0119fe-c95f-11e9-a32f-2a2ae2dbcce4',
            name: 'Digital Marketing',
            type: 'STEP_6',
            version: 2,
            businessProcessId: '9b011562-c95f-11e9-a32f-2a2ae2dbcce4',
            businessProcessName: 'Digital Marketing'
          },
          {
            id: '9b011b3e-c95f-11e9-a32f-2a2ae2dbcce4',
            name: 'Marketo',
            type: 'IT_SYSTEM',
            version: 1,
            businessProcessId: '9b011562-c95f-11e9-a32f-2a2ae2dbcce4',
            businessProcessName: 'Digital Marketing'
          }
        ]
      }
    ]
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomItemDetailsComponent],
      imports: [
        FormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        PageWrapperModule,
        TaTableModule,
        TranslateModule.forRoot(),
        MockModule(EntityTypePipeModule),
        MockModule(TaBadgeModule),
        MockModule(TaButtonsModule),
        MockModule(TaCheckboxModule),
        MockModule(TaDropdownModule),
        MockModule(TaPaginationModule),
        MockModule(TaSvgIconModule),
        MockModule(TaToastModule)
      ],
      providers: [
        DataElementDetailsService,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ dataElementId: 'de-Id-123' })
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomItemDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hide another row details when open row', fakeAsync(() => {
    jasmine.clock().install();
    component.tableData = mockData.businessProcesses;
    tick(10);
    fixture.detectChanges();
    const rows = fixture.debugElement.queryAll(By.css('ta-table ta-table-row'));
    // open first row
    const firstRow = rows[0].query(By.css('.ta-table-row'));
    firstRow.nativeElement.click();
    tick(10);
    fixture.detectChanges();
    // should open row clicked (remove hidden class)
    const firstRowDetail = rows[0].query(By.css('#dataElementRowDetail_0'));
    expect(
      firstRowDetail.nativeElement.classList.contains('ta-table-cell-hidden')
    ).toBeFalsy();

    // toggle second row
    const secondRow = rows[1].query(By.css('.ta-table-row'));
    secondRow.nativeElement.click();
    tick(10);
    fixture.detectChanges();
    // should open second row detail(remove hidden class)
    const secondRowDetail = rows[1].query(By.css('#dataElementRowDetail_1'));
    expect(
      secondRowDetail.nativeElement.classList.contains('ta-table-cell-hidden')
    ).toBeFalsy();
    // first row should hidden
    expect(
      firstRowDetail.nativeElement.classList.contains('ta-table-cell-hidden')
    ).toBeTruthy();
    jasmine.clock().uninstall();
  }));
});
