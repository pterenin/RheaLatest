import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FlowchartUtilityService {
  constructor() {}
  /* *************************constants*********************** */
  private chartStateDefaults = {
    xNodeMargin: 0,
    yNodeMargin: 0,
    xNodeGapSize: 50,
    yNodeGapSize: 20,
    nodeWidth: 96,
    nodeHeight: 64,
    arrowSize: 6,
    linePaddingIncrement: 4,
    linePadding: 0.00001,
    halfLegalEntityTypeHeight: 8
  };

  public chartState = this.chartStateDefaults;

  public resetDefaultState() {
    this.chartState = this.chartStateDefaults;
  }

  /* *************************Legal Entity Labels*********************** */
  public calculateLegalEntityLabelLocation(colLevel, rowLevel) {
    const x =
      this.calculateNodeLeftSideXCoordinate(colLevel) +
      this.chartState.nodeWidth -
      48;

    const y =
      this.calculateYNodeCoordinate(rowLevel) +
      this.chartState.nodeHeight -
      this.chartState.halfLegalEntityTypeHeight * 2;

    return [x, y];
  }

  /* *************************Lines*********************** */
  public createStraightPath(x1, y1, x2, y2) {
    const xDirection = x2 - x1 >= 0 ? 1 : -1;
    return ['M', x1, y1, 'L', x2, y2];
  }

  /**
   * TODO: TIMF-4757 Refactor dataflow lines to not have any hard-corners.
   * Main method for creating a non-linear path.
   * @param x1 - x coordinate for path to start from, currently, always representing the right side of a node.
   * @param y1 - y coordinate for path to start from, representing the middle of the right side of a node.
   * @param x2 - x coordinate for path to end, currently, always representing the left-side of a node.
   * @param y2 - y coordinate for path to end, representing the middle of the left side of a node.
   * @param from - information about where the from-node exists in the grid.
   * @param to - information about where the to-node exists in the grid.
   * @returns An array representing an SVG path, connecting two nodes, to be rendered
   */
  public createFlowPath(x1, y1, x2, y2, from, to) {
    const fromCol = from.col;
    const toCol = to.col;
    const fromRow = from.row;
    const toRow = to.row;
    let startX = x1;
    const startY = y1;
    let endX = x2;
    const endY = y2;

    const verticalDirection = fromRow <= toRow ? 1 : -1;
    const horizontalDirection = fromCol <= toCol ? 1 : -1;

    const rowDist = toRow - fromRow;
    const colDist = toCol - fromCol;

    // Draw line when nodes are in the same col
    if (fromCol === toCol) {
      endX = x2 + this.chartState.nodeWidth;
      const path = [
        'M',
        startX,
        startY,
        'L',
        startX + 5,
        startY,
        'C',
        startX + 12,
        startY,
        startX + 12,
        startY + 12 * verticalDirection,
        startX + 12,
        startY + 10 * verticalDirection,
        'L',
        startX + 12,
        endY - 10 * verticalDirection,
        'C',
        startX + 12,
        endY,
        startX + 5,
        endY,
        startX + 5,
        endY,
        'L',
        endX,
        endY
      ];
      return path;
    } else {
      // draw flowpath when nodes are in the same row
      if (fromRow === toRow) {
        if (fromCol > toCol) {
          startX = x1 - this.chartState.nodeWidth;
          endX = x2 + this.chartState.nodeWidth;
        }
        let colRange = Math.abs(fromCol - toCol);
        if (colRange > 5) {
          colRange = 5;
        }
        const path = [
          'M',
          startX,
          startY,
          'L',
          startX + (5 + 6 * colRange) * horizontalDirection,
          startY,
          'C',
          startX + (10 + 6 * colRange) * horizontalDirection,
          startY,
          startX + (13 + 6 * colRange) * horizontalDirection,
          startY + 4 * colRange - 5,
          startX + (15 + 6 * colRange) * horizontalDirection,
          startY + 4 * colRange,
          'L',
          startX + (15 + 6 * colRange) * horizontalDirection,
          startY + 4 * colRange,
          'L',
          startX + (20 + 6 * colRange) * horizontalDirection,
          startY + 20 + 4 * colRange,
          'C',
          startX + (23 + 6 * colRange) * horizontalDirection,
          startY + 30 + 4 * colRange,
          startX + (30 + 6 * colRange) * horizontalDirection,
          startY + 30 + 4 * colRange,
          startX + (30 + 6 * colRange) * horizontalDirection,
          startY + 30 + 4 * colRange,
          'L',
          startX + (30 + 6 * colRange) * horizontalDirection,
          startY + 30 + 4 * colRange,
          'L',
          endX - (30 + 6 * colRange) * horizontalDirection,
          startY + 30 + 4 * colRange,
          'C',
          endX - (23 + 6 * colRange) * horizontalDirection,
          startY + 30 + 4 * colRange,
          endX - (20 + 6 * colRange) * horizontalDirection,
          startY + 20 + 4 * colRange,
          endX - (20 + 6 * colRange) * horizontalDirection,
          startY + 20 + 4 * colRange,
          'L',
          endX - (15 + 6 * colRange) * horizontalDirection,
          endY + 4 * colRange,
          'C',
          endX - (12 + 6 * colRange) * horizontalDirection,
          endY,
          endX - (8 + 4 * colRange) * horizontalDirection,
          endY,
          endX - (5 + 6 * colRange) * horizontalDirection,
          endY,
          'L',
          endX - (5 + 6 * colRange) * horizontalDirection,
          endY,
          'L',
          endX,
          endY
        ];
        return path;
        // draw flowpath when nodes are on different rows
      } else {
        // case: distance between 2 cols is 1
        if (Math.abs(colDist) === 1) {
          let curVal = 5;
          if (fromCol > toCol) {
            curVal = -5;
          }
          const path = [
            'M',
            startX,
            startY,
            'L',
            startX + curVal,
            startY,
            'C',
            startX + curVal,
            startY,
            startX + (endX - startX) / 4,
            startY,
            startX + (endX - startX) / 4,
            startY + (y2 - startY) / 8,
            'C',
            startX + (2 * (endX - startX)) / 4,
            endY,
            startX + (3 * (endX - startX)) / 4,
            endY,
            endX - curVal * 1.5,
            endY,
            'C',
            endX - curVal * 1.5,
            endY,
            endX - curVal * 1.4,
            endY,
            endX - curVal,
            endY,
            'L',
            endX,
            endY
          ];
          return path;
        } else {
          if (fromCol < toCol) {
            if (fromRow < toRow) {
              const path = [
                'M',
                startX,
                startY,
                'L',
                startX + 15,
                startY,
                'C',
                startX + 20,
                startY,
                startX + 23,
                startY + 5,
                startX + 25,
                startY + 10,
                'L',
                startX + 25,
                startY + 10,
                'L',
                startX + 30,
                startY + 30,
                'C',
                startX + 30,
                startY + 30,
                startX + 32,
                startY + 45,
                startX + 40,
                startY + 45,
                'L',
                startX + 40,
                startY + 45,
                'L',
                endX - 50,
                startY + 45,
                'L',
                endX - 50,
                startY + 45,
                'C',
                endX - 43,
                startY + 48,
                endX - 40,
                startY + 55,
                endX - 40,
                startY + 55,
                'L',
                endX - 25,
                endY - 10,
                'C',
                endX - 20,
                endY,
                endX - 18,
                endY,
                endX - 15,
                endY,
                'L',
                endX - 15,
                endY,
                'L',
                endX,
                endY
              ];
              return path;
            } else {
              const path = [
                'M',
                startX,
                startY,
                'L',
                startX + 15,
                startY,
                'C',
                startX + 20,
                startY,
                startX + 23,
                startY + 5,
                startX + 25,
                startY + 10,
                'L',
                startX + 25,
                startY + 10,
                'L',
                startX + 30,
                startY + 30,
                'C',
                startX + 30,
                startY + 30,
                startX + 32,
                startY + 45,
                startX + 40,
                startY + 45,
                'L',
                startX + 40,
                startY + 45,
                'L',
                endX - 50,
                startY + 45,
                'L',
                endX - 50,
                startY + 45,
                'C',
                endX - 43,
                startY + 42,
                endX - 40,
                startY + 30,
                endX - 40,
                startY + 30,
                'L',
                endX - 25,
                endY + 10,
                'C',
                endX - 20,
                endY,
                endX - 18,
                endY,
                endX - 15,
                endY,
                'L',
                endX - 15,
                endY,
                'L',
                endX,
                endY
              ];
              return path;
            }
          } else {
            startX = x1 - this.chartState.nodeWidth;
            endX = x2 + this.chartState.nodeWidth;

            if (fromRow < toRow) {
              const path = [
                'M',
                startX,
                startY,
                'L',
                startX - 15,
                startY,
                'C',
                startX - 20,
                startY,
                startX - 23,
                startY + 5,
                startX - 25,
                startY + 10,
                'L',
                startX - 25,
                startY + 10,
                'L',
                startX - 30,
                startY + 30,
                'C',
                startX - 30,
                startY + 30,
                startX - 32,
                startY + 45,
                startX - 40,
                startY + 45,
                'L',
                startX - 40,
                startY + 45,
                'L',
                endX + 50,
                startY + 45,
                'L',
                endX + 50,
                startY + 45,
                'C',
                endX + 43,
                startY + 48,
                endX + 40,
                startY + 55,
                endX + 40,
                startY + 55,
                'L',
                endX + 25,
                endY - 10,
                'C',
                endX + 20,
                endY,
                endX + 18,
                endY,
                endX + 15,
                endY,
                'L',
                endX + 15,
                endY,
                'L',
                endX,
                endY
              ];
              return path;
            } else {
              const path = [
                'M',
                startX,
                startY,
                'L',
                startX - 15,
                startY,
                'C',
                startX - 20,
                startY,
                startX - 23,
                startY + 5,
                startX - 25,
                startY + 10,
                'L',
                startX - 25,
                startY + 10,
                'L',
                startX - 30,
                startY + 30,
                'C',
                startX - 30,
                startY + 30,
                startX - 32,
                startY + 45,
                startX - 40,
                startY + 45,
                'L',
                startX - 40,
                startY + 45,
                'L',
                endX + 50,
                startY + 45,
                'L',
                endX + 50,
                startY + 45,
                'C',
                endX + 43,
                startY + 42,
                endX + 40,
                startY + 30,
                endX + 40,
                startY + 30,
                'L',
                endX + 25,
                endY + 10,
                'C',
                endX + 20,
                endY,
                endX + 18,
                endY,
                endX + 15,
                endY,
                'L',
                endX + 15,
                endY,
                'L',
                endX,
                endY
              ];
              return path;
            }
          }
        }
      }
    }
  }
  public createStraightFlowPath(x1, y1, x2, y2, from, to, type) {
    const fromCol = from.col;
    const toCol = to.col;
    const fromRow = from.row;
    const toRow = to.row;
    let startX = x1;
    const startY = y1;
    let endX = x2;
    const endY = y2;

    const verticalDirection = fromRow <= toRow ? 1 : -1;
    const horizontalDirection = fromCol <= toCol ? 1 : -1;
    if (fromCol > toCol) {
      startX = x1 - this.chartState.nodeWidth;
      endX = x2 + this.chartState.nodeWidth;
    }

    let curVal = 5;
    if (fromCol > toCol) {
      curVal = -5;
    }
    if (type === 1) {
      const startCurveX =
        endX - this.chartState.xNodeGapSize * horizontalDirection;
      const path = [
        'M',
        startX,
        startY,
        'L',
        startCurveX,
        startY,
        'L',
        startCurveX + curVal,
        startY,
        'C',
        startCurveX + curVal,
        startY,
        startCurveX + (endX - startCurveX) / 4,
        startY,
        startCurveX + (endX - startCurveX) / 4,
        startY + (y2 - startY) / 8,
        'C',
        startCurveX + (2 * (endX - startCurveX)) / 4,
        endY,
        startCurveX + (3 * (endX - startCurveX)) / 4,
        endY,
        endX - curVal * 1.5,
        endY,
        'C',
        endX - curVal * 1.5,
        endY,
        endX - curVal * 1.4,
        endY,
        endX - curVal,
        endY,
        'L',
        endX,
        endY
      ];
      return path;
    }
    if (type === 2) {
      const endCurveX =
        startX + this.chartState.xNodeGapSize * horizontalDirection;
      const path = [
        'M',
        startX,
        startY,
        'L',
        startX + curVal,
        startY,
        'C',
        startX + curVal,
        startY,
        startX + (endCurveX - startX) / 4,
        startY,
        startX + (endCurveX - startX) / 4,
        startY + (y2 - startY) / 8,
        'C',
        startX + (2 * (endCurveX - startX)) / 4,
        endY,
        startX + (3 * (endCurveX - startX)) / 4,
        endY,
        endCurveX - curVal * 1.5,
        endY,
        'C',
        endCurveX - curVal * 1.5,
        endY,
        endCurveX - curVal * 1.4,
        endY,
        endCurveX - curVal,
        endY,
        'L',
        endCurveX,
        endY,
        'L',
        endX,
        endY
      ];
      return path;
    }
  }
  /**
   * Creates initial points for a path heading to another node on the same row
   * @param startX - Start-point's x-coordinate
   * @param startY - Start-point's y-coordinate
   * @param verticalDirection - Which direction the path should travle (up or down, -1 or 1, respectively.)
   * @param horizontalDirection - Which direction the path should travle (left or right, -1 or 1, respectively.)
   * @returns An array of points for rendering an SVG path.
   */
  private createInitialPointsForPathOnSameRow(
    startX,
    startY,
    verticalDirection,
    horizontalDirection
  ): { x: number; y: number }[] {
    // traveling on the same row. Can be farther than just one node away.
    const p1 = { x: 0, y: 0 };
    p1.x = startX + this.chartState.xNodeGapSize / 2;
    p1.y = startY;

    const p2 = { x: 0, y: 0 };
    p2.x = p1.x;
    p2.y = startY + (this.chartState.nodeHeight / 2) * verticalDirection;

    const p3 = { x: 0, y: 0 };
    p3.x = p2.x + (this.chartState.nodeWidth / 2) * horizontalDirection;
    p3.y = p2.y + (this.chartState.yNodeGapSize / 2) * verticalDirection;

    const p4 = { x: 0, y: 0 };
    p4.x = p3.x + (this.chartState.xNodeGapSize / 2) * horizontalDirection;
    p4.y = p3.y;

    const p5 = { x: 0, y: 0 };
    p5.x = p4.x + (this.chartState.nodeWidth / 2) * horizontalDirection;
    p5.y = p4.y;
    const p6 = p5;

    return [p1, p2, p3, p4, p5, p6];
  }

  /**
   * Creates a path-extension for traveling right to a node on the same row
   * @param startX x-point for this path extension to start from.
   * @param startY y-point for this path extension to start from.
   * @param verticalDirection - which direction the path will follow (1 or -1)
   * @param horizontalDirection - which direction the path will follow (1 or -1) (should be 1 for this method)
   * @param colDist - Number of columns in between the two nodes to be connected by this path.
   * @param endX - x-oint where this path should end.
   * @param endY - y-point where this path should end.
   * @returns an array of SVG coordinates to be used to extend an existing array of coordinates.
   */
  createPathForTravelingRightToNodeOnSameRow(
    startX,
    startY,
    verticalDirection,
    horizontalDirection,
    colDist,
    endX,
    endY
  ) {
    const points: {
      x: number;
      y: number;
    }[] = this.createInitialPointsForPathOnSameRow(
      startX,
      startY,
      verticalDirection,
      horizontalDirection
    );

    const lastPoint = points[points.length - 1];
    for (let i = 0; i < Math.abs(colDist) - 2; i++) {
      const newX =
        lastPoint.x +
        (this.chartState.nodeWidth + this.chartState.xNodeGapSize) *
          horizontalDirection;
      lastPoint.x = newX;
      points.push({
        x: newX,
        y: lastPoint.y
      });
      points.push({
        x: newX,
        y: lastPoint.y
      });
    }

    const p7 = { x: 0, y: 0 };
    p7.x =
      lastPoint.x + (this.chartState.xNodeGapSize / 2) * horizontalDirection;
    p7.y = lastPoint.y;

    points.push(p7);

    const p8 = { x: 0, y: 0 };
    p8.x = p7.x;
    p8.y = p7.y + (this.chartState.yNodeGapSize / 2) * -verticalDirection;

    points.push(p8);

    const p9 = { x: 0, y: 0 };
    p9.x = p8.x + (this.chartState.xNodeGapSize / 4) * horizontalDirection;
    p9.y = p8.y + (this.chartState.nodeHeight / 2) * -verticalDirection;

    points.push(p9);

    points.push({ x: endX, y: endY });

    return points;
  }

  /**
   * Creates a path-extension for traveling left to a node on the same row
   * @param startX x-point for this path extension to start from.
   * @param startY y-point for this path extension to start from.
   * @param verticalDirection - which direction the path will follow (1 or -1)
   * @param horizontalDirection - which direction the path will follow (1 or -1) (should be -1 for this method)()
   * @param colDist - Number of columns in between the two nodes to be connected by this path.
   * @param endX - x-oint where this path should end.
   * @param endY - y-point where this path should end.
   * @returns an array of SVG coordinates to be used to extend an existing array of coordinates.
   */
  public createPathForTravelingLeftToNodeOnSameRow(
    startX,
    startY,
    verticalDirection,
    horizontalDirection,
    colDist,
    endX,
    endY
  ) {
    const points: {
      x: number;
      y: number;
    }[] = this.createInitialPointsForPathOnSameRow(
      startX,
      startY,
      verticalDirection,
      horizontalDirection
    );

    const lastPoint = points[points.length - 1];
    for (let i = 0; i < Math.abs(colDist) - 1; i++) {
      const newX =
        lastPoint.x +
        (this.chartState.nodeWidth + this.chartState.xNodeGapSize) *
          horizontalDirection;
      lastPoint.x = newX;
      points.push({
        x: newX,
        y: lastPoint.y
      });
      points.push({
        x: newX,
        y: lastPoint.y
      });
    }

    const p7 = { x: 0, y: 0 };
    p7.x =
      lastPoint.x +
      (this.chartState.xNodeGapSize + this.chartState.nodeWidth / 2) *
        horizontalDirection;
    p7.y = lastPoint.y;

    points.push(p7);
    points.push(p7);

    const p8 = { x: 0, y: 0 };
    p8.x =
      p7.x +
      (this.chartState.xNodeGapSize / 2 + this.chartState.nodeWidth / 2) *
        horizontalDirection;
    p8.y = p7.y;

    points.push(p8);

    const p9 = { x: 0, y: 0 };
    p9.x = p8.x;
    p9.y = p8.y + (this.chartState.yNodeGapSize / 2) * -verticalDirection;

    points.push(p9);

    const p10 = { x: 0, y: 0 };
    p10.x = p9.x + (this.chartState.xNodeGapSize / 4) * -horizontalDirection;
    p10.y = p9.y + (this.chartState.nodeHeight / 2) * -verticalDirection;

    points.push(p10);

    points.push({ x: endX, y: endY });

    return points;
  }

  /**
   * Increments a line-padding variable used to offset lines enough to prevent them from overlapping.
   * This function first flips the sign of the padding before incrementing it (toward the new sign) so that the padding moves
   * in both directions. This allows for more possible lines to exist between any given nodes in a graph.
   * As the number of lines increases the spacing between nodes increases, so theoretically we should always have
   * enough space for new lines.
   */
  private incrementLinePadding() {
    this.chartState.linePadding +=
      -1 *
      Math.sign(-this.chartState.linePadding) *
      this.chartState.linePaddingIncrement;

    if (
      Math.abs(this.chartState.linePadding) >= this.chartState.xNodeGapSize ||
      Math.abs(this.chartState.linePadding) >= this.chartState.yNodeGapSize
    ) {
      this.chartState.linePadding = 1.5;
    }
  }

  /* *************************Arrow Heads*********************** */
  /**
   * Creates a right arrowhead path string for SVG rendering
   * @param x2 - Start and end point x coordinate of the path.
   * @param y2 - Start and end point y coordinate of the path.
   * @returns left arrowhead path
   */
  public createRightArrowheadPath(x2, y2): Array<any> {
    return [
      'M',
      x2 - this.chartState.arrowSize,
      y2 + (this.chartState.arrowSize * 2) / 3,
      'L',
      x2,
      y2,
      'L',
      x2 - this.chartState.arrowSize,
      y2 - (this.chartState.arrowSize * 2) / 3,
      'L',
      x2 - this.chartState.arrowSize,
      y2 + (this.chartState.arrowSize * 2) / 3
    ];
  }

  /**
   * Creates a left arrowhead path string for SVG rendering
   * @param x2 - Start and end point x coordinate of the path.
   * @param y2 - Start and end point y coordinate of the path.
   * @returns left arrowhead path
   */
  public createLeftArrowheadPath(x2, y2): Array<any> {
    return [
      'M',
      x2 + this.chartState.arrowSize,
      y2 + (this.chartState.arrowSize * 2) / 3,
      'L',
      x2,
      y2,
      'L',
      x2 + this.chartState.arrowSize,
      y2 - (this.chartState.arrowSize * 2) / 3,
      'L',
      x2 + this.chartState.arrowSize,
      y2 + (this.chartState.arrowSize * 2) / 3
    ];
  }

  /* *************************Node Grid & Coordinates*********************** */

  /**
   * Calculates the coordinates of the beginning and ending of a joining line between two nodes.
   * @param fromColLevel - The column number of where the node in which data is flowing from is located in the node-grid.
   * @param fromRowLevel - The column number of where the node in which data is flowing to is located in the node-grid.
   * @param toColLevel - The row number of where the node in which data is flowing to is located in the node-grid.
   * @param toRowLevel - The row number of where the node in which data is flowing to is located in the node-grid.
   * @param isUpstream - Whether or not the 'to' node was rendered first.
   * @returns Four coordinates as x and y values of where the line joining two nodes starts and where it ends.
   */
  public calculateLineCoordinates(
    fromColLevel,
    fromRowLevel,
    toColLevel,
    toRowLevel,
    isUpstream
  ): Array<number> {
    let x1, x2;
    if (Math.abs(fromColLevel - toColLevel) === 1) {
      x1 = isUpstream
        ? this.calculateNodeLeftSideXCoordinate(fromColLevel)
        : this.calculateNodeRightSideXCoordinate(fromColLevel);
      x2 = isUpstream
        ? this.calculateNodeRightSideXCoordinate(toColLevel)
        : this.calculateNodeLeftSideXCoordinate(toColLevel);
    } else {
      x1 = this.calculateNodeRightSideXCoordinate(fromColLevel);
      x2 = this.calculateNodeLeftSideXCoordinate(toColLevel);
    }

    const y1 =
      this.calculateYNodeCoordinate(fromRowLevel) +
      this.chartState.nodeHeight / 2;

    const y2 =
      this.calculateYNodeCoordinate(toRowLevel) +
      this.chartState.nodeHeight / 2;

    return [x1, y1, x2, y2];
  }

  /**
   * Calculates node Left side x coordinate
   * @param colLevel - Which column in the grid the node will appear in.
   * @returns The leftmost side of the node's x coordinate.
   */
  public calculateNodeLeftSideXCoordinate(colLevel: number): number {
    return (
      this.chartState.xNodeMargin +
      this.chartState.nodeWidth * colLevel +
      this.chartState.xNodeGapSize * colLevel
    );
  }

  /**
   * Calculates node right side x coordinate
   * @param colLevel - Which column in the grid the node will appear in.
   * @returns The rightmost side of the node's x coordinate.
   */
  public calculateNodeRightSideXCoordinate(colLevel: number): number {
    return (
      this.chartState.xNodeMargin +
      this.chartState.nodeWidth * colLevel +
      this.chartState.xNodeGapSize * colLevel +
      this.chartState.nodeWidth
    );
  }

  /**
   * Calculates the coordinates of a node in the chart based on it's row-level.
   * @param rowLevel - Which row in the grid the node will appear in.
   * @returns The top of the node's y coordinate.
   */
  public calculateYNodeCoordinate(rowLevel: number): number {
    return (
      this.chartState.yNodeMargin +
      this.chartState.nodeHeight * rowLevel +
      this.chartState.yNodeGapSize * rowLevel
    );
  }

  public drawArrowHeadDirection(flowRelationship, nodeWidth, drawCallback) {
    const from = flowRelationship.from;
    const to = flowRelationship.to;
    const isUpstream = flowRelationship.isUpstream;

    const [x1, y1, x2, y2] = this.calculateLineCoordinates(
      from.col,
      from.row,
      to.col,
      to.row,
      isUpstream
    );

    const fromClass = from.id.split(' ').join('_');
    const toClass = to.id.split(' ').join('_');
    const arrowClass = fromClass + ' ' + toClass;

    const isOneAway = Math.abs(to.col - from.col) === 1;
    const isSameRow = to.row === from.row;
    const isSameCol = to.col === from.col;
    const isBackWay = isSameCol || to.col < from.col;
    const isLeftArrow = (isUpstream && isOneAway && isSameRow) || isBackWay;
    const xLeftSideCoordinate =
      x2 === this.calculateNodeLeftSideXCoordinate(to.col);
    const direction = isLeftArrow ? 'left' : 'right';
    const x = isLeftArrow && xLeftSideCoordinate ? x2 + nodeWidth : x2;
    const y = y2;
    const cbOptions = { direction, x, y, arrowClass };

    drawCallback(cbOptions);
  }

  public drawPath(flowRelationship, nodeLocations, pathCallback) {
    const from = flowRelationship.from;
    const to = flowRelationship.to;
    const isUpstream = flowRelationship.isUpstream;

    const [x1, y1, x2, y2] = this.calculateLineCoordinates(
      from.col,
      from.row,
      to.col,
      to.row,
      isUpstream
    );

    let fromRowIsEmpty = true;
    let toRowIsEmpty = true;
    if (from.col === to.col) {
      fromRowIsEmpty = false;
      toRowIsEmpty = false;
    } else {
      for (const key of Object.keys(nodeLocations)) {
        const nodeLocation = nodeLocations[key];
        if (
          nodeLocation.col > Math.min(from.col, to.col) &&
          nodeLocation.col < Math.max(from.col, to.col)
        ) {
          fromRowIsEmpty = !(
            nodeLocation.row === from.row || nodeLocation.row === to.row
          );
        }
      }
    }

    const pathType = '';
    const type = 1;
    const cbOptions = { pathType, x1, y1, x2, y2, from, to, type };
    const isOneAway = Math.abs(to.col - from.col) === 1;
    const haveBoth = !fromRowIsEmpty && !toRowIsEmpty;

    if (from.row === to.row) {
      cbOptions.pathType =
        isOneAway || fromRowIsEmpty ? 'straightPath' : 'flowPath';
    } else {
      cbOptions.pathType =
        isOneAway || haveBoth ? 'flowPath' : 'straightFlowPath';
      cbOptions.type =
        cbOptions.pathType === 'straightFlowPath' && !fromRowIsEmpty ? type : 2;
    }

    pathCallback(cbOptions);
  }
}
