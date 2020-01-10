import { EventColor } from './event-color.model';

export interface Subject {
  nrc: string;
  name: string;
  shortName: string;
  instructors: string;
  place: string;
  type: string;
  startTime: string;
  endTime: string;
  startDate: Date;
  endDate: Date;
  firstMeetingDate: Date;
  lastMeetingDate: Date;
  color?: EventColor;
  notificationTime?: number;
  googleSynced?: boolean;
}
