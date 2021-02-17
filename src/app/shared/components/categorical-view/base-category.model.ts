import { formatCategoryLabel } from 'src/app/shared/utils/basic-utils';
import { CategoryInterface } from '../../models/subjects-recipients.model';

declare const _: any;

export interface BaseCategoryInterface<T> {
  id: string;
  label: string;
  items: T[];
  isCustom?: boolean;
}

export function isCategoryInterface(
  category: string | CategoryInterface
): category is CategoryInterface {
  return (category as CategoryInterface).categoryName !== undefined;
}

export function categorize<T extends { category: string | CategoryInterface }>(
  itemList: T[],
  labelField: string,
  highRiskType: boolean = true
): BaseCategoryInterface<T>[] {
  const result = _(itemList)
    .groupBy((item: T) => {
      return isCategoryInterface(item.category)
        ? item.category.categoryName
        : item.category;
    })
    .mapValues((value: T[], key: string) => ({
      label: formatCategoryLabel(key),
      items: value.map(item => {
        const obj = highRiskType
          ? {
              ...item,
              label: item[labelField],
              rheaHighRiskType: item['highRisks']
            }
          : {
              ...item,
              label: item[labelField]
            };

        // "dataSubjectType" - was removed from API and now is "dataSubject"
        // however, it is a required property and is used in further calls to API
        // so, we add it here only when processing Data Subjects
        if (labelField === 'dataSubject') {
          obj['dataSubjectType'] = item['dataSubject'];
        }
        const omissions = highRiskType
          ? ['category', 'highRisks']
          : ['category'];

        return _.omit(obj, omissions);
      }),
      isCustom: value.map(item => item['isCategoryCustom'])[0]
    }))
    .values();

  return result.value();
}
