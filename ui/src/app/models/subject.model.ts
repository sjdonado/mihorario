import { EventColor } from './event-color.model';

export interface Subject {
  nrc: string;
  name: string;
  shortName: string;
  place: string;
  start: string;
  finish: string;
  startDate: Date;
  finishDate: Date;
  subjectType: string;
  teacher: string;
  type: string;
  color?: EventColor;
  notificationTime?: number;
  googleSynced?: boolean;
}
