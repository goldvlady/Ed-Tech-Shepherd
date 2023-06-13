import { Schema, model } from 'mongoose';

import { TimestampedEntity } from '../../types';
import { Tutor as TutorInterface } from './Tutor';
import { User } from './User';

export interface BookmarkedTutor extends TimestampedEntity {
  user: User;
  tutor: TutorInterface;
}

const schema = new Schema<BookmarkedTutor>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tutor: {
      type: Schema.Types.ObjectId,
      ref: 'Tutor',
      required: true,
      autopopulate: true,
    },
  },
  { timestamps: true }
);

schema.plugin(require('mongoose-autopopulate'));

export default model<BookmarkedTutor>('BookmarkedTutor', schema);
