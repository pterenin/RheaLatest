export const AAA_HEADER_CONFIG = {
  title: true, // whether to display the clientName or not. default: true
  fixed: false, // whether the top header position is fixed on top
  showBusinessName: true, // whether to display business,
  menu: [
    {
      text: 'Dashboard',
      url: '/dashboard'
    },
    {
      text: 'Business Processes',
      url: '/business-process'
    },
    {
      text: 'Data Inventory', // [i18n-tobeinternationalized]
      url: '/data-inventory'
    },
    {
      text: 'Settings', // [i18n-tobeinternationalized]
      url: '/settings',
      menu: [
        { text: 'Data Elements', url: '/settings/data-elements/categories' },
        { text: 'Data Subjects', url: '/settings/data-subjects/categories' },
        {
          text: 'Processing Purposes',
          url: '/settings/processing-purposes/categories'
        }
      ]
    },
    {
      text: 'Nymity Tools',
      url: 'https://nymitytools.nymity.com/home/'
    }
  ]
};
