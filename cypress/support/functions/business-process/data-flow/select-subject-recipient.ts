import * as CategoricalDropDown from '../../../../support/functions/shared/categorical-dropdown';
import { CyDescription } from '../../../../support/functions/shared/models-ui';

//#region   Select Data Subject

export function selectDataUserTypes(
  cySelectElement: CyDescription,
  selections: any[],
  searchTerm: string
) {
  selections.forEach(select => {
    selectDataUserType(
      cySelectElement,
      select.searchPrefix === '%' ? searchTerm : select.searchPrefix,
      select.category,
      select.locations
    );
  });
}

export function selectDataUserType(
  cySelectElement: CyDescription,
  searchTerm: string,
  category: string,
  locations: any,
  selectItemIndex?: number
) {
  const parentSelector = cySelectElement.selector;
  CategoricalDropDown.selectItemOfCategoryAndLocationsForDataFlow(
    parentSelector,
    searchTerm,
    category,
    locations,
    selectItemIndex ? selectItemIndex : 0
  );
}

//#endregion
