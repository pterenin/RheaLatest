import { TestBed } from '@angular/core/testing';

import { MapProperties, MapUtilityService } from './map-utility.service';
import { MapDataPoint, MapDataRelationship } from './world-map.service';

const pointA: MapDataPoint = {
  name: 'pointA',
  type: 'IT_SYSTEM_1ST_PARTY',
  location: 'AA',
  coordinates: { lat: 10, lon: 20 },
  x: 20,
  y: 10
};

const pointB: MapDataPoint = {
  name: 'pointB',
  type: 'IT_SYSTEM_1ST_PARTY',
  location: 'AA',
  coordinates: { lat: 20, lon: 20 },
  x: 20,
  y: 20
};

const pointC: MapDataPoint = {
  name: 'pointE',
  type: 'IT_SYSTEM_1ST_PARTY',
  location: 'AA',
  coordinates: { lat: 10, lon: 10 },
  x: 10,
  y: 10
};

const pointD: MapDataPoint = {
  name: 'pointF',
  type: 'IT_SYSTEM_1ST_PARTY',
  location: 'AA',
  coordinates: { lat: 20, lon: 10 },
  x: 10,
  y: 20
};

const unidirectionalPointRelationsip: MapDataRelationship = {
  from: pointA,
  to: pointB
};

const bidirectionalPointRelationsip: MapDataRelationship = {
  from: pointA,
  to: pointB
};

describe('MapRenderUtilityServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MapUtilityService = TestBed.get(MapUtilityService);
    expect(service).toBeTruthy();
  });

  it('Should return a slope of about +45 degrees given the test data points A and B.', () => {
    const service: MapUtilityService = TestBed.get(MapUtilityService);
    const result1 = service.createPathMetaDataForPoints(pointA, pointB, false)
      .slopeRads;
    const result2 = service.createPathMetaDataForPoints(pointA, pointB, true)
      .slopeRads;
    expect(result1).toBeGreaterThan(1.5707);
    expect(result1).toBeLessThan(1.5708);
    expect(result2).toBeGreaterThan(1.5707);
    expect(result2).toBeLessThan(1.5708);
  });

  it('Should return a slope of about -45 degrees given the test data points B and A.', () => {
    const service: MapUtilityService = TestBed.get(MapUtilityService);
    const result1 = service.createPathMetaDataForPoints(pointB, pointA, false)
      .slopeRads;
    const result2 = service.createPathMetaDataForPoints(pointB, pointA, true)
      .slopeRads;
    expect(result1).toBeLessThan(-1.5707);
    expect(result1).toBeGreaterThan(-1.5708);
    expect(result2).toBeLessThan(-1.5707);
    expect(result2).toBeGreaterThan(-1.5708);
  });

  it('Should return a slope of about +45 degrees given the test data points E and F.', () => {
    const service: MapUtilityService = TestBed.get(MapUtilityService);
    const result1 = service.createPathMetaDataForPoints(pointC, pointD, false)
      .slopeRads;
    const result2 = service.createPathMetaDataForPoints(pointC, pointD, true)
      .slopeRads;
    expect(result1).toBeGreaterThan(1.5707);
    expect(result1).toBeLessThan(1.5708);
    expect(result2).toBeGreaterThan(1.5707);
    expect(result2).toBeLessThan(1.5708);
  });

  it('calculateLinearMiddlePoint should return a middle point.', () => {
    const service: MapUtilityService = TestBed.get(MapUtilityService);
    expect(service.calculateLinearMiddlePoint(pointC, pointB)).toEqual({
      x: 15,
      y: 15
    });
  });

  it('calculateDistanceBetweenPoints should return an accurate distance', () => {
    const service: MapUtilityService = TestBed.get(MapUtilityService);
    expect(service.calculateDistanceBetweenPoints(pointA, pointB)).toEqual(10);
  });

  it('calculateSlopeInRadians should calculate the slope between two points in radians', () => {
    const service: MapUtilityService = TestBed.get(MapUtilityService);
    expect(service.calculateSlopeInRadians(pointA, pointB)).toEqual(
      1.5707963267948966
    );
  });

  it(`calculateCurveQCoordinate should calculate the Curve's quadratic coordinate`, () => {
    const service: MapUtilityService = TestBed.get(MapUtilityService);
    const centerPoint = 0;
    const slopeRadians = Math.atan(0);
    const sign = 1;
    const arcPointDistance = 2;
    const angleFromCenterOfLine = Math.atan(Infinity);
    expect(
      service.calculateCurveQCoordinate(
        centerPoint,
        Math.sin,
        slopeRadians,
        sign,
        arcPointDistance,
        angleFromCenterOfLine
      )
    ).toEqual(2);

    // javascript isn't 100% accurate, so this is just checking for 'very close to 0'
    const result2 = service.calculateCurveQCoordinate(
      centerPoint,
      Math.cos,
      slopeRadians,
      sign,
      arcPointDistance,
      angleFromCenterOfLine
    );
    expect(result2).toBeLessThan(0.00001);
    expect(result2).toBeGreaterThan(-0.00001);
  });

  it('getQuadraticCurvePoint should return the correct apex point for a Quadratic curve', () => {
    const service: MapUtilityService = TestBed.get(MapUtilityService);

    // Points A and C have the same y coordinate.
    const yCurve = service.getQuadraticCurvePoint(
      pointC,
      pointA,
      { x: pointA.x - pointC.x, y: pointC.y },
      0.5
    );
    expect(yCurve).toEqual({ x: 12.5, y: 10 });

    // Points A and B have the same x coordinate.
    const xCurve = service.getQuadraticCurvePoint(
      pointA,
      pointB,
      { y: pointB.y - pointA.y, x: pointA.x },
      0.5
    );
    expect(xCurve).toEqual({ x: 20, y: 12.5 });
  });

  it('getBezierCurveApexPointValue should return the correct x value', () => {
    const service: MapUtilityService = TestBed.get(MapUtilityService);
    const xVal = service.getBezierCurveApexPointValue(
      0.5,
      pointA.x,
      pointA.x - pointC.x,
      pointC.x
    );
    expect(xVal).toEqual(12.5);
  });

  it('getBezierCurveApexPointValue should return the correct y value', () => {
    const service: MapUtilityService = TestBed.get(MapUtilityService);
    const yVal = service.getBezierCurveApexPointValue(
      0.5,
      pointA.y,
      pointA.y - pointB.y,
      pointB.y
    );
    expect(yVal).toEqual(2.5);
  });

  it('pointsToPath should return a the correct SVG string for creating a Quadratic Bezier Curve', () => {
    const service: MapUtilityService = TestBed.get(MapUtilityService);
    const path = service.pointsToPath(pointA, pointB, 10, 20);
    expect(path).toEqual('M20,10Q10 20,20 20');
  });

  it('calculateArrowEndpoint should create a point at the curve middle point given some pathData', () => {
    const service: MapUtilityService = TestBed.get(MapUtilityService);
    const pathData = {
      slopeRads: 0,
      curveMiddlePoint: { x: 10, y: 10 }
    };
    let point = service.calculateArrowEndPoint(pointA, pointB, false, pathData);
    expect(point).toEqual([-39.49747468305833, 59.49747468305832]);

    point = service.calculateArrowEndPoint(pointC, pointC, false, pathData);
    expect(point).toEqual([10, 10]);
  });

  it('calculateDirectionSign should return the correct sign', () => {
    const service: MapUtilityService = TestBed.get(MapUtilityService);
    let from = { x: 5, y: 5 };
    let to = { x: 4, y: 4 };
    expect(service.calculateDirectionSign(from, to)).toEqual({ x: 1, y: 1 });

    [from, to] = [to, from];
    expect(service.calculateDirectionSign(from, to)).toEqual({ x: -1, y: -1 });

    from = { x: 4, y: 5 };
    to = { x: 5, y: 4 };
    expect(service.calculateDirectionSign(from, to)).toEqual({ x: -1, y: 1 });

    [from, to] = [to, from];
    expect(service.calculateDirectionSign(from, to)).toEqual({ x: 1, y: -1 });

    from = { x: 5, y: 4 };
    to = { x: 5, y: 4 };
    expect(service.calculateDirectionSign(from, to)).toEqual({ x: 0, y: 0 });
  });

  it('createDirectionalArrowData should return an arrow with three points', () => {
    const service: MapUtilityService = TestBed.get(MapUtilityService);
    const arrow = service.createDirectionalArrowData(pointA, pointB, false);
    expect(arrow.length).toEqual(3);
  });

  it('convertSignleLatLongToXYCoordinates should convert lat and long coordinates to x y coordinates', () => {
    const service: MapUtilityService = TestBed.get(MapUtilityService);
    const mapProperties: MapProperties = {
      xOffset: 0,
      yOffset: 0,
      xMargin: 0,
      yMargin: 0,
      jsonRes: 1,
      crs:
        '+proj=mill +lat_0=0 +lon_0=0 +x_0=0 +y_0=0 +R_A +datum=WGS84 +units=m +no_defs',
      scale: 1
    };

    const point: MapDataPoint = {
      location: 'AA',
      coordinates: { lon: 10, lat: 10 },
      name: 'Test Point',
      type: 'DATA_SUBJECT'
    };

    const newPoint = service.convertSingleLatLongToXYCoordinates(
      point,
      mapProperties
    );

    const expectedPoint: MapDataPoint = point;
    expectedPoint.x = 1113824.4079327355;
    expectedPoint.y = -1109450.1865564885;
    expect(newPoint).toEqual(expectedPoint);
  });
});
