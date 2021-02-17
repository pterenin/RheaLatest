declare global {
  interface Window {
    truste: Truste;
    staticHeaderConfig: HeaderConfig;
  }
}

export interface HeaderConfig {
  title: Boolean; // whether to display the clientName or not. default: true
  fixed: Boolean; // whether the top header position is fixed on top
  showBusinessName: Boolean; // whether to display the business name,
  menu: Array<MenuConfig>; // an array of an object that contains MenuConfig
}

interface MenuConfig {
  text: String; // Title of the link
  url: String; // URL of the link
}

export interface ClientApp {
  clientId: String;
  logo: String;
  name: String;
  url: String;
}

interface Truste {
  aaa: AAA;
}

interface AAA {
  topHeader: TopHeader;
}

interface TopHeader {
  accountBusinessName: String;
  accountType: String;
  clientId: String;
  clientName: String;
  client_apps: Array<Object>;
  currentRole: String;
  currentRoleName: String;
  fullName: String;
  hasMultipleUsers: Boolean;
  helpUri: String;
  lastLoginDate: Number;
  logoURL: String;
  name: String;
  profilePhotoURL: String;
  profileURL: String;
  signOutURL: String;
  staticBaseURL: String;
  userId: String;
  userMakeDefaultURL: String;
  userResourceURL: String;
  userSwitchURL: String;
}
