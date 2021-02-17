import { defaultTo } from '../utils/basic-utils';

declare const _: any;

export type DataControllerProcessor =
  | 'DATA_CONTROLLER'
  | 'DATA_CONTROLLER_DATA_PROCESSOR'
  | 'JOINT_DATA_CONTROLLER'
  | 'JOINT_DATA_CONTROLLER_DATA_PROCESSOR'
  | 'NOT_APPLICABLE'
  | 'NOT_DETERMINED'
  | 'DATA_PROCESSOR';

/* [i18n-tobeinternationalized] */
export const DATA_CONTROLLER_PROCESSOR_OPTIONS = [
  { name: 'Data Controller', short: 'DC', id: 'DATA_CONTROLLER' },
  { name: 'Data Processor', short: 'DP', id: 'DATA_PROCESSOR' },
  {
    name: 'Data Controller & Data Processor',
    short: 'DC & DP',
    id: 'DATA_CONTROLLER_DATA_PROCESSOR'
  },
  { name: 'Joint Data Controller', short: 'JC', id: 'JOINT_DATA_CONTROLLER' },
  {
    name: 'Joint Data Controller & Data Processor',
    short: 'JC & DP',
    id: 'JOINT_DATA_CONTROLLER_DATA_PROCESSOR'
  },
  { name: 'Not Applicable', short: 'NA', id: 'NOT_APPLICABLE' },
  { name: 'Not Determined', short: 'ND', id: 'NOT_DETERMINED' }
];

export const DATA_CONTROLLER_PROCESSOR_MAP = _.keyBy(
  DATA_CONTROLLER_PROCESSOR_OPTIONS,
  'id'
);

/* [i18n-tobeinternationalized] */
export const getRoleInitialism = (role: string) => {
  const initials: string = role
    ? defaultTo('ND', DATA_CONTROLLER_PROCESSOR_MAP[role]['short'])
    : 'ND';

  return `(${initials.toLocaleLowerCase()})`;
};
