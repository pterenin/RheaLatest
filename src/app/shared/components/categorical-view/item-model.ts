import { defaultTo } from '../../utils/basic-utils';

export interface ItemInterface {
  label: string;
  selected: boolean;
  hidden: boolean;
  id: string;
  subItem: string;
  tag?: string;
  location?: string;
  senderId?: string;
  receiverId?: string;
  unReselectable?: boolean;
  isCustom?: boolean;
  locationIds?: string[];
  locations?: string[];
  isItSystem?: boolean;
  isDsOrDr?: boolean;
}

export class Item implements ItemInterface {
  label: string;
  selected: boolean;
  hidden: boolean;
  id: string;
  subItem: string;
  entityId?: string;
  tag?: string;
  location?: string;
  senderId?: string;
  receiverId?: string;
  unReselectable?: boolean;
  isCustom?: boolean;
  locationIds?: string[];
  locations?: string[];
  isItSystem?: boolean;
  isDsOrDr?: boolean;
  nodeId?: string;

  constructor(
    label: string,
    id: string,
    selected: boolean,
    subItem: string,
    tag,
    location: string,
    senderId,
    receiverId,
    unReselectable,
    isCustom?: boolean,
    locationIds?: string[],
    locations?: string[],
    entityId?: string,
    isItSystem?: boolean,
    isDsOrDr?: boolean,
    nodeId?: string
  ) {
    this.label = label;
    this.id = id;
    this.selected = selected;
    this.subItem = subItem;
    this.hidden = false;
    this.tag = tag;
    this.location = location;
    this.senderId = senderId;
    this.receiverId = receiverId;
    this.unReselectable = unReselectable;
    this.isCustom = isCustom;
    this.locationIds = defaultTo([], locationIds);
    this.locations = defaultTo([], locations);
    this.entityId = defaultTo(null, entityId);
    this.isItSystem = defaultTo(false, isItSystem);
    this.isDsOrDr = defaultTo(false, isDsOrDr);
    this.nodeId = defaultTo(null, nodeId);
  }
}
