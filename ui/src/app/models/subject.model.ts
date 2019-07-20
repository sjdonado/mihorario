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
  color?: string;
  textColor?: string;
  notificationTime?: number;
  googleSync?: boolean;
}
