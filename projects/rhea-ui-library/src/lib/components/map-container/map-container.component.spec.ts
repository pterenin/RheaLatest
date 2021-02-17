import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapContainerComponent } from './map-container.component';
// tslint:disable-next-line:max-line-length
import { HighchartsChartModule } from 'highcharts-angular';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { WorldMapService } from './world-map.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastService, TaProgressbarModule } from '@trustarc/ui-toolkit';
import { RouterTestingModule } from '@angular/router/testing';

describe('MapContainerComponent', () => {
  let component: MapContainerComponent;
  let fixture: ComponentFixture<MapContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MapContainerComponent],
      imports: [
        HighchartsChartModule,
        HttpClientTestingModule,
        RouterTestingModule,
        TaProgressbarModule
      ],
      providers: [HttpClient, HttpHandler, WorldMapService, ToastService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a highcharts element', () => {
    expect(
      fixture.nativeElement.querySelector('highcharts-chart').className
    ).toBeTruthy();
  });

  it('should bind Highcharts', () => {
    expect(component.highcharts).toBeTruthy();
  });

  it('should have correct class name', () => {
    expect(
      fixture.nativeElement.querySelector('highcharts-chart').className
    ).toBe('mapContainer');
  });

  it('updatePointsWithLatLons method', () => {
    let inputData = [];
    let expectedOutputData = [];

    spyOn(
      component['worldMapService'],
      'convertCountryCodeToLocation'
    ).and.callFake(function(location, stateOrProvince) {
      if (location === 'US') {
        return { lat: 37.09024, lon: -95.712891 };
      }

      if (location === 'AT') {
        return { lat: 47.516231, lon: 14.550072 };
      }

      if (location === 'CN') {
        return { lat: 35.86166, lon: 104.195397 };
      }

      return undefined;
    });

    const invalidDstDataNoFromCoordinates = {
      from: {
        coordinates: null,
        location: 'EH',
        name: 'Contractor',
        type: 'DATA_SUBJECT'
      },
      needsLineRender: true,
      pathCount: 0,
      to: {
        coordinates: { lat: 37.09024, lon: -95.712891 },
        location: 'US',
        name: 'is1',
        type: 'IT_SYSTEM_3RD_PARTY',
        x: 1430.8463242462049,
        y: -7639.600282544052
      }
    };
    const validDstDataNoToCoordinates = {
      from: {
        coordinates: { lat: 47.516231, lon: 14.550072 },
        location: 'AT',
        name: 'Contractor',
        originalName: 'Contractor',
        pointColor: '#214676',
        type: 'DATA_SUBJECT',
        x: 4680.951855328893,
        y: -8009.3329250400275
      },
      needsLineRender: false,
      pathCount: 0,
      to: undefined
    };
    const validDstData = {
      from: {
        coordinates: { lat: 47.516231, lon: 14.550072 },
        location: 'AT',
        name: 'Contractor',
        originalName: 'Contractor',
        pointColor: '#214676',
        type: 'DATA_SUBJECT',
        x: 4680.951855328893,
        y: -8009.3329250400275
      },
      needsLineRender: true,
      pathCount: 0,
      to: {
        coordinates: { lat: 37.09024, lon: -95.712891 },
        location: 'US',
        name: 'is1',
        type: 'IT_SYSTEM_3RD_PARTY',
        x: 1430.8463242462049,
        y: -7639.600282544052
      }
    };
    const drtData = {
      from: {
        coordinates: { lat: 37.09024, lon: -95.712891 },
        location: 'US',
        name: 'is1',
        type: 'IT_SYSTEM_3RD_PARTY',
        x: 1430.8463242462049,
        y: -7639.600282544052
      },
      needsLineRender: false,
      to: undefined
    };
    const validIsData = {
      from: {
        coordinates: { lat: 37.09024, lon: -95.712891 },
        lineColor: '#4294B6',
        location: 'US',
        name: 'is1',
        originalName: 'is1',
        pointColor: '#4294B6',
        type: 'IT_SYSTEM_3RD_PARTY',
        x: 1430.8463242462049,
        y: -7639.600282544052
      },
      needsLineRender: true,
      pathCount: 0,
      to: {
        coordinates: { lat: 35.86166, lon: 104.195397 },
        location: 'CN',
        name: 'Senior Leader',
        type: 'DATA_RECIPIENT',
        x: 7323.332929545129,
        y: -7598.263333072462
      }
    };
    const invalidIsDataMissingFromLat = {
      from: {
        coordinates: { lat: undefined, lon: -95.712891 },
        lineColor: '#4294B6',
        location: 'EH',
        name: 'is2',
        originalName: 'is2',
        pointColor: '#4294B6',
        type: 'IT_SYSTEM_3RD_PARTY',
        x: 1430.8463242462049,
        y: -7639.600282544052
      },
      needsLineRender: true,
      pathCount: 0,
      to: {
        coordinates: { lat: 35.86166, lon: 104.195397 },
        location: 'CN',
        name: 'Senior Leader',
        type: 'DATA_RECIPIENT',
        x: 7323.332929545129,
        y: -7598.263333072462
      }
    };

    inputData = inputData.concat([
      invalidDstDataNoFromCoordinates,
      validDstDataNoToCoordinates,
      validDstData,
      drtData,
      invalidIsDataMissingFromLat,
      validIsData
    ]);
    expectedOutputData = expectedOutputData.concat([
      validDstDataNoToCoordinates,
      validDstData,
      drtData,
      validIsData
    ]);

    expect(component['updatePointsWithLatLons'](inputData)).toEqual(
      expectedOutputData
    );
  });
});
