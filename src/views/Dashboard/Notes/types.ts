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

export interface PinnedNoteDetails {
  user: NoteUser;
  topic: string;
  note: string;
  tags: Array<string>;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  [propName: string]: any;
}

export interface NoteFilter {
  user: NoteUser;
  topic: string;
  note: string;
  tags: Array<string>;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  [propName: string]: any;
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

export enum NoteEnums {
  PINNED_NOTE_STORE_ID = 'pinned_notes'
}
