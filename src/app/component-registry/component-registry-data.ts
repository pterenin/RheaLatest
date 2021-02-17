import {
  CategoryItemInterface,
  CategoryInterface
} from '../shared/components/async-categorical-dropdown/async-categorical-dropdown.model';
import { Observable } from 'rxjs';
import {
  SearchResponseInterface,
  SearchRequest
} from '../shared/models/search.model';

declare const _: any;

export const categoryTestData: CategoryInterface<any>[] = [
  { id: 'xyz', name: 'Category #1', items: [], metadata: null },
  { id: 'fgh', name: 'Category #2', items: [], metadata: null },
  { id: 'abc', name: 'Category #3', items: [], metadata: null }
];

const generateCategoryTestItems = (
  category: CategoryInterface<any>,
  searchTerm: string
) =>
  _.range(0, 20)
    .map(value => ({
      id: `cat-${category.id}-item-${value}`,
      name: `Category ${category.id}: Item #${value + 1}`,
      type: category.name,
      categoryId: category.id
    }))
    .filter(item => (searchTerm ? item.name.includes(searchTerm) : item));

const generatePageable = (categoryItems: CategoryItemInterface[]) => ({
  content: categoryItems,
  size: categoryItems.length,
  numberOfElements: categoryItems.length,
  first: true,
  last: true,
  number: 0,
  sort: [],
  totalElements: categoryItems.length,
  totalPages: 1
});

// RHEA-1531 - add call to server.
const getItemsForCategory = (
  category: CategoryInterface<any>,
  searchTerm: string,
  isDelayed: boolean
): Observable<SearchResponseInterface<CategoryItemInterface>> => {
  return new Observable(subscriber => {
    const categoryItems = generateCategoryTestItems(category, searchTerm);
    const pageable = generatePageable(categoryItems);

    const finish = () => {
      subscriber.next(pageable);
      subscriber.complete();
    };

    const timeoutSeconds = Math.random() * 5000 + 1;

    isDelayed ? setTimeout(finish, timeoutSeconds) : finish();
  });
};

const getAllItems = (
  searchTerm: string,
  isDelayed: boolean
): Observable<SearchResponseInterface<CategoryItemInterface>> => {
  return new Observable(subscriber => {
    const categoriesWithItems = _(categoryTestData)
      .flatMap(category => generateCategoryTestItems(category, searchTerm))
      .value();

    const pageable = generatePageable(categoriesWithItems);

    const finish = () => {
      subscriber.next(pageable);
      subscriber.complete();
    };

    const timeoutSeconds = Math.random() * 5000 + 1;

    isDelayed ? setTimeout(finish, timeoutSeconds) : finish();
  });
};

// Reuse old function, this function make unit test is crashed
// export const getRegistryCategoryLoaders = ({
//   isDelayed
// }: {
//   isDelayed: boolean;
// }) => {
//   return categoryTestData
//       .map(category => getItemsForCategory(category, '', isDelayed))
//       .concat(getAllItems('', isDelayed));
// };

export const getRegistryCategoryLoaders = ({
  isDelayed
}: {
  isDelayed: boolean;
}) => [
  {
    categoryId: 'xyz',
    requestFunction: ({ searchTerm }: SearchRequest) =>
      getItemsForCategory(
        categoryTestData.find(category => category.id === 'xyz'),
        searchTerm,
        isDelayed
      ),
    sort: 'name,ASC'
  },
  {
    categoryId: 'fgh',
    requestFunction: ({ searchTerm }: SearchRequest) =>
      getItemsForCategory(
        categoryTestData.find(category => category.id === 'fgh'),
        searchTerm,
        isDelayed
      ),
    sort: 'name,ASC'
  },
  {
    categoryId: 'abc',
    requestFunction: ({ searchTerm }: SearchRequest) =>
      getItemsForCategory(
        categoryTestData.find(category => category.id === 'abc'),
        searchTerm,
        isDelayed
      ),
    sort: 'name,ASC'
  },
  {
    categoryId: 'ALL',
    requestFunction: ({ searchTerm }: SearchRequest) =>
      getAllItems(searchTerm, isDelayed),
    sort: 'name,ASC'
  }
];

export const locationData = [
  {
    name: 'Asia',
    countries: [
      {
        id: '0f49b027-5397-4ebd-8a52-998b6ea25b1e',
        version: 1,
        i18nKey: '',
        name: 'South Korea',
        threeLetterCode: 'KOR',
        twoLetterCode: 'KR',
        stateOrProvinces: [],
        globalRegions: [
          {
            id: 'c7e285a5-db97-40a7-ad10-79e4c467fca8',
            version: 0,
            i18nKey: '',
            name: 'Asia'
          }
        ],
        selected: true
      },
      {
        id: '0f49b027-5397-4ebd-8a52-998b6ea25b1f',
        version: 1,
        i18nKey: '',
        name: 'Philippines',
        threeLetterCode: 'PHL',
        twoLetterCode: 'PH',
        stateOrProvinces: [],
        globalRegions: [
          {
            id: 'c7e285a5-db97-40a7-ad10-79e4c467fca8',
            version: 0,
            i18nKey: '',
            name: 'Asia'
          }
        ],
        selected: true
      }
    ],
    id: 'c7e285a5-db97-40a7-ad10-79e4c467fca8'
  },
  {
    name: 'Europe',
    countries: [
      {
        id: '0b0975f3-94f4-49a3-9d7d-017e26565e5e',
        version: 1,
        i18nKey: '',
        name: 'Germany',
        threeLetterCode: 'DEU',
        twoLetterCode: 'DE',
        stateOrProvinces: [
          {
            id: '10d39319-e0a2-4e19-b233-64d42c147d59',
            version: 0,
            name: 'Baden-Württemberg',
            shortValue: 'BW',
            i18nKey: null
          },
          {
            id: '3112c2fd-5023-4ac2-af8f-27bd98335262',
            version: 0,
            name: 'Bayern',
            shortValue: 'BY',
            i18nKey: null
          },
          {
            id: '25580222-067b-45de-8cbe-f01c8a7c3fb3',
            version: 0,
            name: 'Berlin',
            shortValue: 'BE',
            i18nKey: null
          },
          {
            id: '9c975aae-5c75-4c39-a06f-c0b6aaf88eab',
            version: 0,
            name: 'Brandenburg',
            shortValue: 'BB',
            i18nKey: null
          },
          {
            id: '6c1279fe-2c21-44f2-8051-4dff1c20bc89',
            version: 0,
            name: 'Bremen',
            shortValue: 'HB',
            i18nKey: null
          },
          {
            id: 'd069fc50-39db-4a4e-85ec-3689e7741f2b',
            version: 0,
            name: 'Hamburg',
            shortValue: 'HH',
            i18nKey: null
          },
          {
            id: '99d00582-e7f5-4247-a46d-ee56e2368307',
            version: 0,
            name: 'Hessen',
            shortValue: 'HE',
            i18nKey: null
          },
          {
            id: 'f88fb873-56e0-4950-9bd5-3e0dece26e26',
            version: 0,
            name: 'Mecklenburg-Vorpommern',
            shortValue: 'MV',
            i18nKey: null
          },
          {
            id: '93973aa1-b3a7-410a-b9c7-c7058b776bb5',
            version: 0,
            name: 'Niedersachsen',
            shortValue: 'NI',
            i18nKey: null
          },
          {
            id: 'cce5d0c0-4825-4ac6-a446-13890441df18',
            version: 0,
            name: 'Nordrhein-Westfalen',
            shortValue: 'NW',
            i18nKey: null
          },
          {
            id: '951144d2-9d36-4335-bdd1-570152e0fc41',
            version: 0,
            name: 'Rheinland-Pfalz',
            shortValue: 'RP',
            i18nKey: null
          },
          {
            id: '60fa14c0-03c1-43b1-84a7-cfe8db1f8843',
            version: 0,
            name: 'Saarland',
            shortValue: 'SL',
            i18nKey: null
          },
          {
            id: 'd09abb70-ab7b-47e0-9850-0a76e5485888',
            version: 0,
            name: 'Sachsen',
            shortValue: 'SN',
            i18nKey: null
          },
          {
            id: 'cf4b50b6-2dbb-4d22-b05e-fa0ecd0fd3b7',
            version: 0,
            name: 'Sachsen-Anhalt',
            shortValue: 'ST',
            i18nKey: null
          },
          {
            id: '565e37cd-f1b9-4319-8582-64b2b4907d26',
            version: 0,
            name: 'Schleswig-Holstein',
            shortValue: 'SH',
            i18nKey: null
          },
          {
            id: 'da14679f-044d-4ccd-8f54-9739f208658c',
            version: 0,
            name: 'Thüringen',
            shortValue: 'TH',
            i18nKey: null
          }
        ],
        globalRegions: [
          {
            id: 'daab2e59-5be5-4e16-b5f7-68b88dbf8daa',
            version: 0,
            i18nKey: '',
            name: 'EU'
          },
          {
            id: 'a21e0f06-de1e-4ef7-aa17-a84bbf8b15a3',
            version: 0,
            i18nKey: '',
            name: 'Europe'
          }
        ],
        selected: true
      }
    ],
    id: 'a21e0f06-de1e-4ef7-aa17-a84bbf8b15a3'
  },
  {
    name: 'Africa',
    countries: [
      {
        id: 'aea9baab-455d-48c2-8ad7-698bdc3ed875',
        version: 1,
        i18nKey: '',
        name: 'Cape Verde',
        threeLetterCode: 'CPV',
        twoLetterCode: 'CV',
        stateOrProvinces: [],
        globalRegions: [
          {
            id: '96dba3d3-e39b-4e72-81e5-1245c2e5c2af',
            version: 0,
            i18nKey: '',
            name: 'Africa'
          }
        ],
        selected: true
      }
    ],
    id: '96dba3d3-e39b-4e72-81e5-1245c2e5c2af'
  }
];
