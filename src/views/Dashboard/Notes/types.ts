import { TimestampedEntity, User } from '../../../types';

export interface NoteServerResponse<T = any> {
  message: string;
  error?: any;
  stack?: any;
  data?: T;
}

export type NoteUser = User;

export interface NoteDetails {
  user: NoteUser;
  topic: string;
  note: string;
  tags: Array<string>;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  [propName: string]: any;
}
