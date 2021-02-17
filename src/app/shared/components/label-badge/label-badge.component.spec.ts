import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LabelBadgeComponent } from './label-badge.component';
import {
  TaBadgeModule,
  TaPopoverModule,
  TaSvgIconModule,
  TaTagsModule,
  TaTooltipModule
} from '@trustarc/ui-toolkit';
import { MockComponents, MockModule } from 'ng-mocks';
import { LocationTooltipComponent } from '../location-tooltip/location-tooltip.component';
import { ReplacePipeModule } from '../../pipes/replace/replace.module';
import { LocationService } from '../../services/location/location.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CustomCategoryTagModule } from '../custom-category-tag/custom-category-tag.module';

describe('LabelBadgeComponent', () => {
  let component: LabelBadgeComponent;
  let fixture: ComponentFixture<LabelBadgeComponent>;
  let dataItemMock: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LabelBadgeComponent,
        ...MockComponents(LocationTooltipComponent)
      ],
      providers: [LocationService],
      imports: [
        MockModule(ReplacePipeModule),
        MockModule(TaTooltipModule),
        TaBadgeModule,
        TaSvgIconModule,
        HttpClientTestingModule,
        TaPopoverModule,
        TaTagsModule,
        CustomCategoryTagModule
      ]
    }).compileComponents();

    dataItemMock = {
      id: 1,
      label: 'Item 1',
      isSelected: false
    };
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit removeFromList event on click remove item', done => {
    component.removeFromList.subscribe(e => {
      expect(e).toEqual(dataItemMock);
      done();
    });
    const $event = new Event('click');
    component.removeItem($event, dataItemMock);
  });

  it('should emit showInfoTooltip event on click item info', done => {
    component.showInfoTooltip.subscribe(e => {
      expect(e).toEqual(dataItemMock);
      done();
    });
    component.showInfo(dataItemMock);
  });
});
