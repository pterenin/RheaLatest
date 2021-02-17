declare namespace PlatformNavigation {
  interface Config {
    /**
     * The ID of the App container.
     */
    appContainerId: string;
    /**
     * Called when the `window.trustArcPlatformNavigation` is ready and the Platform Navigation is rendered.
     */
    onReady: () => void;
  }
  /**
   * Representation of each menu item in the Platform Navigation .
   */
  interface MenuItem {
    /**
     * Id of the menu item and is set by the Platform Navigation.
     */
    id: string;
    /**
     * The sub-menu data.
     */
    menu?: {
      /**
       * Sub-menu items.
       */
      items: MenuItem[];
    };
    /**
     * The text displayed in the menu.
     */
    text: string;
    /**
     * The url of the menu.
     */
    url?: string;
  }
  /**
   * Events:
   * - menuToggled - An event triggered when expanding/collapsing the side navigation menu.
   * - menuSelected - An event triggered when a menu item which belongs to the current application
   * is clicked by the user.
   */
  type Events = 'menuToggled' | 'menuSelected';
  /**
   * The `MenuToggledEventCallback`'s data.
   */
  interface MenuToggledEventData {
    /**
     * Whether the side navigation menu is open or close.
     */
    clientMenuIsOpen: boolean;
  }
  /**
   * The `MenuSelectedEventCallback`'s data.
   */
  interface MenuSelectedEventData {
    /**
     * The currently selected menu item.
     */
    item: MenuItem;
    /**
     * The parent of the currently selected menu item, if there is any.
     */
    parent?: MenuItem;
  }
  interface EventCallback<T> {
    (data: T): void;
  }
  /**
   * Callback function to `Events.menuToggled` event.
   */
  type MenuToggledCallback = EventCallback<MenuToggledEventData>;
  /**
   * Callback function to `Events.menuSelected` event.
   */
  type MenuSelectedCallback = (data: MenuSelectedEventData) => void;
}
//----- Not all methods and properties available in window.trustArcPlatformNavigation
//----- are included in this interface because they are either used by the
//----- Platform Navigation web component or AAA Provider JS.
//----- In either way, you should never call these methods and use these properties
//----- in your application.
export interface TrustArcPlatformNavigation {
  /**
   * The element that contains the client application.
   */
  appContainer: HTMLElement;
  /**
   * The `window.platformNavConfig` object.
   */
  config?: PlatformNavigation.Config;
  /**
   * Removes all listeners registered for the specified `event`.
   */
  off: (event: PlatformNavigation.Events) => void;
  /**
   * Adds a listener for the specified `event`.
   */
  on: (
    event: PlatformNavigation.Events,
    listener:
      | PlatformNavigation.MenuToggledCallback
      | PlatformNavigation.MenuSelectedCallback
  ) => void;
  /**
   * The `ta-platform-navigation` web component.
   */
  platformNavigation: HTMLElement;
  /**
   * Selects a menu in the navigation and highlights it.
   *
   * @example
   * // selecting a level 2 menu item
   * trustarcPlatformNav.selectMenu(["Assessments"]);
   *
   * // selecting a level 3 menu item
   * trustarcPlatformNav.selectMenu(["Tasks", "All Tasks"]);
   *
   * // passing undefined, null, or empty array parameter will clear the selected menu.
   * trustarcPlatformNav.selectMenu();
   * trustarcPlatformNav.selectMenu(null);
   * trustarcPlatformNav.selectMenu([]);
   */
  selectMenu: (data?: string[] | null) => void;
  userInfo: any;
}
declare global {
  interface Window {
    onSignInCallback?: (token: any) => void;
    platformNavConfig?: PlatformNavigation.Config;
    trustArcPlatformNavigation: TrustArcPlatformNavigation;
    trustarcPlatformNav: any;
  }
}
