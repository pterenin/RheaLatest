import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LocationTooltipComponent } from './location-tooltip.component';

describe('LocationTooltipComponent', () => {
  let component: LocationTooltipComponent;
  let fixture: ComponentFixture<LocationTooltipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LocationTooltipComponent],
      imports: []
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
