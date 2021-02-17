import { Injectable } from '@angular/core';
import { MapDataPoint, MapDataRelationship } from './world-map.service';
import proj4 from 'proj4';

import { Entity } from '../../constants/data-flow.constants';

export const MapEntity = Entity;

export interface MapProperties {
  xOffset: number;
  yOffset: number;
  xMargin: number;
  yMargin: number;
  jsonRes: number;
  crs: string;
  scale: number;
}

@Injectable({
  providedIn: 'root'
})
export class MapUtilityService {
  constructor() {}

  /**
   * Creates path meta data between points
   * @param from: A point representing the start of a path.
   * @param to: A point representing the end of a path
   * @param invertCurve: Whether to invert the curve so that return paths will not be rendered on top of existing paths.
   * @returns relevant metadata about a curve between two points.
   */
  public createPathMetaDataForPoints(from, to, invertCurve) {
    const pointDistance = this.calculateDistanceBetweenPoints(from, to);
    const linearMiddlePoint = this.calculateLinearMiddlePoint(from, to);
    const ninetyDegreesInRadians = 1.5708;
    const curvePointDist = pointDistance * 0.3;
    const sign = invertCurve ? -1 : 1;

    const slopeRads = this.calculateSlopeInRadians(from, to);

    const curvePointX = this.calculateCurveQCoordinate(
      linearMiddlePoint.x,
      Math.cos,
      slopeRads,
      sign,
      curvePointDist,
      ninetyDegreesInRadians
    );

    const curvePointY = this.calculateCurveQCoordinate(
      linearMiddlePoint.y,
      Math.sin,
      slopeRads,
      sign,
      curvePointDist,
      ninetyDegreesInRadians
    );

    const curveMiddlePoint = this.getQuadraticCurvePoint(
      from,
      to,
      { x: curvePointX, y: curvePointY },
      0.5
    );

    return {
      slopeRads: slopeRads,
      curvePointX: curvePointX,
      curvePointY: curvePointY,
      curveMiddlePoint: curveMiddlePoint
    };
  }

  /**
   * Calculates the point which lies half-way between two points.
   * @param from: The 'from' point containing x and y coordinates.
   * @param to: The 'to' point containing x and y coordinates
   * @returns An object containing x and y points in the middle of the 'from' and 'to' points.
   */
  public calculateLinearMiddlePoint(from, to) {
    return {
      x: (from.x + to.x) / 2,
      y: (from.y + to.y) / 2
    };
  }

  /**
   * Calculates the distance between two points
   * @param from: The 'from' point in the distance equation, containing x and y coordinates.
   * @param to: The 'to' point in the distance equation, containing x and y coordinates.
   * @returns The distance between the 'from' and 'to' points.
   */
  public calculateDistanceBetweenPoints(from, to) {
    return Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));
  }

  /**
   * Calculates the slope of a line between two points, in radians.
   * @param from: The 'from' point containing x and y coordinates.
   * @param to: The 'to' point containing x and y coordinates.
   * @returns The slope of the line between the 'from' and 'to' points, converted to radians.
   */
  public calculateSlopeInRadians(from, to) {
    if (from.y === to.y && from.x === to.x) {
      return 0;
    }
    return Math.atan((to.y - from.y) / (to.x - from.x));
  }

  /**
   * Calculates the Q coordinate of a quadratic Bezier curve which determines where the curve's apex will land
   * @param centerPoint: The center of the straight line between two points
   * @param angleFunction: either sin or cos, depending on if we are calculating X or Y coordinate.
   * @param slopeRadians: The slope of the straight line between two points
   * @param sign positive or negative 1 (0 is possible with Math.sign, so avoid that.)
   *   determines which side of a straight line the curve will exist on.
   * @param arcPointDistance: Amount of distance between the curve's apex point and the center of the straight line.
   * @param angleFromCenterOfLine: Angle to send the Q coordinate out at from the center point of the line between two points.
   * @returns The apex point
   */
  public calculateCurveQCoordinate(
    centerPoint: number,
    angleFunction: (number) => number,
    slopeRadians: number,
    sign: number,
    arcPointDistance: number,
    angleFromCenterOfLine: number
  ) {
    return (
      centerPoint +
      angleFunction(slopeRadians + angleFromCenterOfLine) *
        sign *
        arcPointDistance
    );
  }

  /**
   * Gets the quadratic Bezier curve's apex point.
   * @param from: The point where the curve begins.
   * @param to: The point where the curve ends.
   * @param centerQPoint: The Q coordinate of a quadratic Bezier curve which determines where the curve's apex will land
   * @param position: Distance on the Bezier curve, where the apex will be. Ranges from 0 to 1.
   * @returns An object containing the apex point's x and y values on the Bezier curve.
   */
  public getQuadraticCurvePoint(from, to, centerQPoint, position) {
    return {
      x: this.getBezierCurveApexPointValue(
        position,
        from.x,
        centerQPoint.x,
        to.x
      ),
      y: this.getBezierCurveApexPointValue(
        position,
        from.y,
        centerQPoint.y,
        to.y
      )
    };
  }

  /**
   * Gets the bezier curve's apex point value for x or y.
   * @param position: Distance on the Bezier curve, where the apex will be. Ranges from 0 to 1.
   * @param start: The point where the curve begins
   * @param centerQPoint: The Q coordinate of a quadratic Bezier curve which determines where the curve's apex will land
   * @param end: The point where the curve ends.
   * @returns The Bezier curve's x or y value for it's apex point.
   */
  public getBezierCurveApexPointValue(position, start, centerQPoint, end) {
    const iT = 1 - position;
    return (
      iT * iT * start +
      2 * iT * position * centerQPoint +
      position * position * end
    );
  }

  /**
   * Creates the SVG expression for rendering a Quadratic Bezier curve.
   * https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths
   * @param from: The point where the curve begins.
   * @param to: The point where the curve ends.
   * @param arcPointX: X coordinate of the Quadratic Bezier Curve's Q Point which determines where the curve's apex will land.
   * @param arcPointY: Y coordinate of the Quadratic Bezier Curve's Q Point which determines where the curve's apex will land.
   * @returns The SVG string expression for rendering a Quadratic Bezier curve.
   */
  public pointsToPath(from, to, arcPointX, arcPointY) {
    return (
      'M' +
      from.x +
      ',' +
      from.y +
      'Q' +
      arcPointX +
      ' ' +
      arcPointY +
      ',' +
      to.x +
      ' ' +
      to.y
    );
  }

  /**
   * Calculates arrow end point
   * @param from: point where data is coming from
   * @param to: point where data is going to
   * @param flipLine: determines which leg of the arrow to draw. Simply changes the angle at which the leg is drawn.
   * @param pathData: object containing information about the line and quadratic Bezier curve between two points.
   * @returns An array containing x and y coordinates for rendering an arrow's leg.
   */
  public calculateArrowEndPoint(
    from: MapDataPoint,
    to: MapDataPoint,
    flipLine: boolean,
    pathData
  ): [number, number] {
    const arrowDistance = 70;
    const directionSign = this.calculateDirectionSign(from, to);
    const angle = flipLine ? Math.PI / 4 : -Math.PI / 4; // 45 (+/-) degrees in radians

    const arrowPointX =
      pathData.curveMiddlePoint.x +
      directionSign.x *
        arrowDistance *
        Math.cos(Math.abs(pathData.slopeRads) + angle);

    const arrowPointY =
      pathData.curveMiddlePoint.y +
      directionSign.y *
        arrowDistance *
        Math.sin(Math.abs(pathData.slopeRads) + angle);

    return [arrowPointX, arrowPointY];
  }

  /**
   * Calculates direction sign
   * @param from - Point containing x and y coordinates of where arrow should be pointing from.
   * @param to - Point containing x and y coordinates of where arrow should be pointing to.
   * @returns an object containing x and y coordinates representing direction. Either -1 or 1.
   */
  public calculateDirectionSign(from, to) {
    let x = Math.sign(from.x - to.x);
    let y = Math.sign(from.y - to.y);
    if (x === 0) {
      x = y;
    }
    if (y === 0) {
      y = x;
    }
    return {
      x: x,
      y: y
    };
  }

  /**
   * Creates directional arrow data for rendering an arrow.
   * @param from: Point representing the source of data flow.
   * @param to: Point representing the sink of data flow.
   * @param isReturnPath: Boolean for bi-directional data to represent whether we want to get arrow data for the return path.
   * @returns An array containing three points representing the two legs of the arrow and the middle point.
   */
  public createDirectionalArrowData(from, to, isReturnPath: boolean) {
    const pathData = this.createPathMetaDataForPoints(from, to, isReturnPath);
    const arrowStart = this.calculateArrowEndPoint(from, to, false, pathData);
    const arrowEnd = this.calculateArrowEndPoint(from, to, true, pathData);

    return [
      {
        name: undefined,
        x: arrowStart[0],
        y: arrowStart[1]
      },
      {
        name: undefined,
        x: pathData.curveMiddlePoint.x,
        y: pathData.curveMiddlePoint.y
      },
      {
        name: undefined,
        x: arrowEnd[0],
        y: arrowEnd[1]
      }
    ];
  }

  public updateRelationshipWithCoordinates(
    relationship: MapDataRelationship,
    mapProperties: MapProperties
  ): MapDataRelationship {
    relationship.from = this.convertSingleLatLongToXYCoordinates(
      relationship.from,
      mapProperties
    );
    relationship.to = this.convertSingleLatLongToXYCoordinates(
      relationship.to,
      mapProperties
    );
    return relationship;
  }

  /**
   * Converts signle lat lon to xycoordinates
   * @param point: point containing lat and lon coordinates.
   * @param mapProperties: properties pulled from the GeoJson background map for rendering.
   * @returns the same point with updated x y coordinates for use in rendering information on top of the map..
   */
  public convertSingleLatLongToXYCoordinates(
    point: MapDataPoint,
    mapProperties: MapProperties
  ): MapDataPoint {
    if (point) {
      const points = proj4(proj4.defs('WGS84'), mapProperties.crs, [
        point.coordinates.lon,
        point.coordinates.lat
      ]);
      point.x =
        points[0] * mapProperties.scale * mapProperties.jsonRes -
        mapProperties.xMargin +
        629.5 -
        (mapProperties.xOffset * mapProperties.scale * mapProperties.jsonRes) /
          2;
      point.y =
        -points[1] * mapProperties.scale * mapProperties.jsonRes -
        mapProperties.yMargin +
        5 +
        mapProperties.yOffset * mapProperties.scale * mapProperties.jsonRes;
    }
    return point;
  }
}
