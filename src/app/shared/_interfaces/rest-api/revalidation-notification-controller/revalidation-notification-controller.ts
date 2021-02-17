export interface RevalidationDetailsInterface {
  comments: string;
  date: string;
  id: string;
  notificationAlert?: boolean;
  notificationEmail: boolean;
  notificationTask?: boolean;
  notificationTimings: NotificationTimingsInterface[];
  recurrence: string;
  users: Users[];
}

interface Users {
  email: string;
  fullName: string;
  userId: string;
}

export interface NotificationTimingsInterface {
  id: string;
  name: string;
  checked?: boolean;
}

export interface NotificationTypeOptionsInterface {
  id: string;
  name: string;
  checked: boolean;
}

export interface RecurrenceOptionsInterface {
  id: string;
  name: string;
}
