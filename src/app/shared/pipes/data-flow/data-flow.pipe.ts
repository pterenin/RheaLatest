import { Pipe, PipeTransform } from '@angular/core';
import { DataFlowTableType } from 'src/app/app.constants';

declare const _: any;

const isItemsInclusionCriteriaMet = (item, itemsFilter) => {
  if (itemsFilter.length === 0) {
    return true;
  }
  return itemsFilter.includes(item);
};

const isMultipleItemsInclusionCriteriaMet = (items, itemsFilter) => {
  if (itemsFilter.length === 0) {
    return true;
  }
  return items.some(de => itemsFilter.includes(de));
};

const isSearchCriteriaMet = (item, fields, searchTerm) => {
  if (!searchTerm || searchTerm.length === 0) {
    return true;
  }

  const tested = fields.map(field => {
    const regExp = new RegExp(searchTerm, 'gi');
    return regExp.test(item[field]);
  });

  const some = tested.some(test => test === true);
  return !!some;
};

@Pipe({
  name: 'dataFlowPipe'
})
export class DataFlowPipe implements PipeTransform {
  transform(
    data: any,
    type: string,
    filterData = {
      categories: [],
      locations: [],
      dataElements: [],
      processingPurposes: []
    },
    searchTerm = '',
    action: string = 'filter'
  ): any {
    if (action === 'filter') {
      if (type === DataFlowTableType.DATA_SUBJECT) {
        const { categories, locations, dataElements } = filterData;

        return data.filter(item => {
          const isCategoryTrue = isItemsInclusionCriteriaMet(
            item.category,
            categories
          );
          const isMultipleLocationsTrue = isMultipleItemsInclusionCriteriaMet(
            _.map(item.locations, 'id'),
            locations
          );
          const isDataElementsTrue = isMultipleItemsInclusionCriteriaMet(
            _.map(item.dataElements, 'id'),
            dataElements
          );
          const isSearchTrue = isSearchCriteriaMet(
            item,
            ['name', 'category'],
            searchTerm
          );

          return !!(
            isCategoryTrue &&
            isMultipleLocationsTrue &&
            isDataElementsTrue &&
            isSearchTrue
          );
        });
      }
      if (type === DataFlowTableType.DATA_RECIPIENT) {
        const {
          categories,
          locations,
          dataElements,
          processingPurposes
        } = filterData;

        return data.filter(item => {
          const isCategoryTrue = isItemsInclusionCriteriaMet(
            item.category,
            categories
          );
          const isMultipleLocationsTrue = isMultipleItemsInclusionCriteriaMet(
            _.map(item.locations, 'id'),
            locations
          );
          const isDataElementsTrue = isMultipleItemsInclusionCriteriaMet(
            _.map(item.dataElements, 'id'),
            dataElements
          );
          const isProcessingPurposesTrue = isMultipleItemsInclusionCriteriaMet(
            _.map(item.processingPurposes, 'id'),
            processingPurposes
          );
          const isSearchTrue = isSearchCriteriaMet(
            item,
            ['name', 'category'],
            searchTerm
          );

          return !!(
            isCategoryTrue &&
            isMultipleLocationsTrue &&
            isDataElementsTrue &&
            isProcessingPurposesTrue &&
            isSearchTrue
          );
        });
      }
      if (type === DataFlowTableType.SYSTEM) {
        const { locations, dataElements, processingPurposes } = filterData;

        return data.filter(item => {
          const isLocationsTrue = isItemsInclusionCriteriaMet(
            item.location.id,
            locations
          );
          const isDataElementsTrue = isMultipleItemsInclusionCriteriaMet(
            _.map(item.dataElements, 'id'),
            dataElements
          );
          const isProcessingPurposesTrue = isMultipleItemsInclusionCriteriaMet(
            _.map(item.processingPurposes, 'id'),
            processingPurposes
          );
          const isSearchTrue = isSearchCriteriaMet(
            item,
            ['name', 'legalEntityName'],
            searchTerm
          );

          return !!(
            isLocationsTrue &&
            isDataElementsTrue &&
            isProcessingPurposesTrue &&
            isSearchTrue
          );
        });
      }
    }
  }
}
