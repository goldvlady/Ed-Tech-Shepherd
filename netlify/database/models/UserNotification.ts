import { Schema, model } from 'mongoose';

import { TimestampedEntity } from '../../types';
import { User } from './User';

export enum Types {
  LESSON_SESSION_STARTED = 'lesson_session_started',
}

export interface UserNotification extends TimestampedEntity {
  user: User;
  text: string;
  type: Types;
  attributes?: Record<any, any>;
  readAt?: Date;
}

const schema = new Schema<UserNotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    type: { type: String, enum: Types, required: true },
    attributes: { type: Schema.Types.Mixed, required: false },
    readAt: { type: Date, required: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default model<UserNotification>('UserNotification', schema);
