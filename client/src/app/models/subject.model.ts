import { EventColor } from './event-color.model';

export interface Subject {
  nrc: string;
  name: string;
  shortName: string;
  place: string;
  type: string;
  start: string;
  end: string;
  startDate: Date;
  endDate: Date;
  color?: EventColor;
  notificationTime?: number;
  googleSynced?: boolean;
}
