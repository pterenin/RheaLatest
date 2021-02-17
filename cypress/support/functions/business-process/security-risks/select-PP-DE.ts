import * as CategoricalDropDown from '../../../../support/functions/shared/categorical-dropdown';
import { CyDescription } from '../../../../support/functions/shared/models-ui';

export function selectPPDETypes(
  cySelectElement: CyDescription,
  selections: any[]
) {
  const parentSelector = cySelectElement.selector;
  CategoricalDropDown.selectItemsOfCategories(parentSelector, selections);
}
