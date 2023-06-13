import { Schema, model } from 'mongoose';

import { TimestampedEntity } from '../../types';
import { User } from './User';

export enum Types {
  LESSON_SESSION_STARTED = 'lesson_session_started',
  NEW_OFFER_RECEIVED = 'new_offer_received',
  OFFER_WITHDRAWN = 'offer_withdrawn',
}

type Attributes = Record<'offerId', {}>;

export interface UserNotification extends TimestampedEntity {
  user: User;
  text: string;
  type: Types;
  attributes?: Attributes;
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
