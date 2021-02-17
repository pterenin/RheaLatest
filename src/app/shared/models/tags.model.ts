export interface TagInterface {
  id: string;
  /** If this value was recieved from the server, it must be sent.  Otherwise it can be left out. */
  externalId?: string;
  /**
   * This is the tag name
   */
  tag: string;
  children?: [any];
}

export interface TagGroupInterface {
  id: string;
  /** This value is in server responses, but not needed for requests. */
  multipleValuesAllowed?: boolean;
  /** This value is in server responses, but not needed for requests. */
  tagGroupName?: string;
  /**
   * The group type is needed for update requests because the server currently
   * does not have a way to look this up on its own and requires it.
   */
  tagGroupType: string;
  values: TagInterface[];
  parent?: TagGroupInterface;
}

export interface TagGroupAndValueInterface {
  groupId: string;
  groupName: string;
  id: string;
  value: string;
  valueId: string;
  version: number;
}
