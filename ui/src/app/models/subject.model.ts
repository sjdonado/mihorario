export interface Subject {
  nrc: number;
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
}
