import { Injectable } from '@angular/core';
import { MapDataRelationship } from './world-map.service';
import {
  MapEntity,
  MapProperties,
  MapUtilityService
} from './map-utility.service';

import { MultiEntity } from '../../constants/data-flow.constants';

declare const _: any;

@Injectable({
  providedIn: 'root'
})
export class PlottingService {
  constructor(private mapUtilityService: MapUtilityService) {}

  /**
   * Sets alternate paths
   * @param relationshipList A list of from-to point-relationships and associated data.
   * @returns A list of relationships where alternate-paths are set so that outgoing paths do not overlap incoming paths.
   */
  private setAlternatePaths(relationshipList: Array<MapDataRelationship>) {
    const updatedRelationship = relationshipList.map(relationship => {
      // 1. check if there are any incoming paths that this point is also outGoing to.
      // Since we are looping through the list of relationships, and each from-to relationship is unique,
      // we are only concerned with getting the exact opposite from-to relationship.
      const inverseRelationship = relationshipList.find(
        inverse =>
          inverse.to.location === relationship.from.location &&
          relationship.to.location === inverse.from.location
      );
      if (inverseRelationship) {
        relationship.alternatePathToLocation = !inverseRelationship.alternatePathToLocation;
      }

      return relationship;
    });

    return updatedRelationship;
  }

  private setShouldRenderPath(relationshipList: Array<MapDataRelationship>) {
    const seenPaths = new Map();
    const updatedRelationships = relationshipList.map(relationship => {
      relationship.needsLineRender = !seenPaths.has(
        relationship.from.location + '_' + relationship.to.location
      );

      seenPaths.set(
        relationship.from.location + '_' + relationship.to.location,
        true
      );

      return relationship;
    });

    return updatedRelationships;
  }

  /**
   * Calculates relationship data
   * @param pointRelationship: data for one or two points.
   * @returns Series data containing one or two points, and path(s) between them if there is more than one point.
   */
  public calculateRelationshipData(pointRelationship: MapDataRelationship) {
    // create initial point.
    let data = [
      {
        name: pointRelationship.from.name,
        x: pointRelationship.from.x,
        y: pointRelationship.from.y,
        path: undefined
      }
    ];

    // create line.
    if (pointRelationship.to) {
      // Creates all data needed to render the path./
      const pathData = this.mapUtilityService.createPathMetaDataForPoints(
        pointRelationship.from,
        pointRelationship.to,
        pointRelationship.alternatePathToLocation
      );
      data = data.concat({
        name: pointRelationship.to.name,
        x: pointRelationship.to.x,
        y: pointRelationship.to.y,
        // Add the actual line to the data.
        path: this.mapUtilityService.pointsToPath(
          pointRelationship.from,
          pointRelationship.to,
          pathData.curvePointX,
          pathData.curvePointY
        )
      });
    }

    return data;
  }

  public prepareRelationshipDataForRendering(
    relationshipList: Array<MapDataRelationship>,
    mapProperties: MapProperties
  ): Array<MapDataRelationship> {
    // Set up point color and initial line color. Multi-entity-data lines will be found and updated later.
    let updatedRelationships = relationshipList;
    updatedRelationships = this.setRelationshipPointColorsAndDisplayName(
      relationshipList
    );

    // Split relationships that contain paths from single points
    let withoutToRelationships = updatedRelationships.filter(
      relationship => !relationship.to
    );
    let withToRelationships = updatedRelationships.filter(
      relationship => relationship.to
    );

    withoutToRelationships = withoutToRelationships.map(relationship => {
      relationship.needsLineRender = false;
      return relationship;
    });

    // Which lines are being drawn on which path needs to be known before knowing whether to render each line or not.
    withToRelationships = this.setAlternatePaths(withToRelationships);
    withToRelationships = this.setShouldRenderPath(withToRelationships);

    withToRelationships = this.initializeLineColors(withToRelationships);

    withToRelationships = this.setMultiEntityLineColors(withToRelationships);

    // filter in only the relationships we need to render
    withToRelationships = withToRelationships.filter(
      relationship => relationship.needsLineRender
    );
    updatedRelationships = withToRelationships.concat(withoutToRelationships);

    updatedRelationships.forEach(data => {
      data = this.mapUtilityService.updateRelationshipWithCoordinates(
        data,
        mapProperties
      );
      return data;
    });

    return updatedRelationships;
  }

  /**
   * Sets relationship from-point color
   *   If a relationship's 'from' location appears in more than one relationship
   *   it is a multi-entity location, and should be colorized as such.
   */
  private setRelationshipPointColorsAndDisplayName(
    relationshipList: Array<MapDataRelationship>
  ) {
    const updatedList: Array<MapDataRelationship> = relationshipList.map(
      relationship => {
        const fromsAtSameLocation = relationshipList.find(
          relationshipInList =>
            relationshipInList.from.location === relationship.from.location &&
            (relationshipInList.from.name !== relationship.from.name ||
              relationshipInList.from.name === MultiEntity.value)
        );

        if (fromsAtSameLocation) {
          relationship.from.pointColor = MultiEntity.color;
          relationship.from.originalName = relationship.from.name;
          relationship.from.name = MultiEntity.value;
        } else {
          relationship.from.pointColor =
            MapEntity[relationship.from.type].color;
          relationship.from.originalName = relationship.from.name;
        }

        return relationship;
      }
    );

    return updatedList;
  }

  private setMultiEntityLineColors(
    relationshipList: Array<MapDataRelationship>
  ) {
    const pathsWithCounts = relationshipList.map(path => {
      const samePathFilterCondition = relationshipList.filter(
        elem =>
          elem.from.location === path.from.location &&
          elem.to.location === path.to.location &&
          elem.from.name !== path.from.name
      );
      path.pathCount = samePathFilterCondition.length;
      return path;
    });

    const updatedRelationships = pathsWithCounts.map(relationship => {
      if (relationship.pathCount && relationship.pathCount >= 1) {
        relationship.from.lineColor = MultiEntity.color;
      }

      return relationship;
    });

    return updatedRelationships;
  }

  private initializeLineColors(relationshipList: Array<MapDataRelationship>) {
    const updatedList = relationshipList.map(relationship => {
      relationship.from.lineColor = MapEntity[relationship.from.type].color;
      return relationship;
    });
    return updatedList;
  }
}
