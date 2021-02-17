import {
  async,
  ComponentFixture,
  TestBed,
  tick,
  fakeAsync
} from '@angular/core/testing';
import { StepContainerService } from './step-container.service';
import { Location } from '@angular/common';
import { StepContainerComponent } from './step-container.component';
import { PageFooterModule } from '../../../shared/components/page-footer-nav/page-footer-nav.module';
import { RouterTestingModule } from '@angular/router/testing';
import {
  CreateBusinessProcessesRoutingModule,
  routes
} from '../create-business-processes-routing.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { CreateBusinessProcessesModule } from '../create-business-processes.module';
import { CREATE_BP_NAV_DATA } from 'src/app/business-processes/create-bp/create-business-processes.model';

describe('StepContainerComponent', () => {
  let component: StepContainerComponent;
  let fixture: ComponentFixture<StepContainerComponent>;
  let location: Location;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        CreateBusinessProcessesRoutingModule,
        CreateBusinessProcessesModule,
        HttpClientTestingModule,
        PageFooterModule,
        RouterTestingModule.withRoutes(routes)
      ],
      providers: [StepContainerService]
    }).compileComponents();
  }));

  beforeEach(() => {
    router = TestBed.get(Router);
    location = TestBed.get(Location);
    fixture = TestBed.createComponent(StepContainerComponent);
    component = fixture.componentInstance;
    component.pageSteps = CREATE_BP_NAV_DATA(false);
    router.initialNavigation();
    fixture.detectChanges();
  });

  it('should create', fakeAsync(() => {
    expect(component).toBeTruthy();
  }));

  it('should navigate forward', fakeAsync(() => {
    const service: StepContainerService = fixture.debugElement.injector.get(
      StepContainerService
    );
    component.selectedStep = 0;
    service.emitChange(1);
    tick();
    fixture.detectChanges();
    expect(location.path()).toBe('/owner');
  }));

  it('should navigate backward', fakeAsync(() => {
    const service: StepContainerService = fixture.debugElement.injector.get(
      StepContainerService
    );
    component.selectedStep = 2;
    service.emitChange(-1);
    tick();
    fixture.detectChanges();
    expect(location.path()).toBe('/owner');
  }));

  it('should hide back button when on /data-flow', fakeAsync(() => {
    component.currentUrl = 'data-flow';
    fixture.detectChanges();
    const backBtn = fixture.nativeElement.querySelector('#stepContainerPrev');
    expect(backBtn).toBeFalsy();
  }));

  it('back button should navigates to a previous page', fakeAsync(() => {
    component.selectedStep = 2;
    fixture.detectChanges();
    const backBtn = fixture.nativeElement.querySelector('#stepContainerPrev');
    backBtn.click();
    tick();

    fixture.detectChanges();
    expect(component.selectedStep).toBe(1);
    expect(location.path()).toBe('/owner');
  }));
});
