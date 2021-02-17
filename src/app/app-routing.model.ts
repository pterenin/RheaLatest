import { RouteType } from './app.constants';

export const BUSINESS_PROCESS_LEFT_NAV_ROUTES: LeftNavRoutesInterface[] = [
  {
    label: 'Dashboard', // [i18n-tobeinternationalized]
    slug: 'dashboard',
    parent: false
  },
  {
    label: 'Data Inventory Hub', // [i18n-tobeinternationalized]
    slug: 'business-process',
    parent: false
  }
];

export const MY_INVENTORY_LEFT_NAV_ROUTES: LeftNavRoutesInterface[] = [
  {
    label: 'My Inventory', // [i18n-tobeinternationalized]
    slug: 'data-inventory',
    parent: false
  }
];

export const SETTINGS_LEFT_NAV_ROUTES: LeftNavRoutesInterface[] = [
  {
    label: 'Data Elements', // [i18n-tobeinternationalized]
    slug: 'settings/data-elements',
    parent: false
  },
  {
    label: 'Data Subjects', // [i18n-tobeinternationalized]
    slug: 'settings/data-subjects',
    parent: false
  },
  {
    label: 'Processing Purposes', // [i18n-tobeinternationalized]
    slug: 'settings/processing-purposes',
    parent: false
  }
];

export const getLeftNavRoutes = (routeType: RouteType) => {
  switch (routeType) {
    case 'BUSINESS_PROCESS':
      return BUSINESS_PROCESS_LEFT_NAV_ROUTES;
    case 'MY_INVENTORY':
      return MY_INVENTORY_LEFT_NAV_ROUTES;
    case 'SETTINGS':
      return SETTINGS_LEFT_NAV_ROUTES;
  }
};

export interface LeftNavRoutesInterface {
  label: string;
  slug: string;
  parent: boolean;
  children?: LeftNavChildRoutesInterface[];
}

interface LeftNavChildRoutesInterface {
  label: string;
  slug: string;
}
