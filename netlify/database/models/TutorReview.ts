import { Schema, model } from 'mongoose';

import { Student, Tutor } from '../../../src/types';
import { TimestampedEntity } from '../../types';

type Rating = 1 | 2 | 3 | 4 | 5;

export interface TutorReview extends TimestampedEntity {
  tutor: Tutor;
  student: Student;
  rating: Rating;
  review: string;
}

const schema = new Schema<TutorReview>(
  {
    tutor: {
      type: Schema.Types.ObjectId,
      ref: 'Tutor',
      required: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      autopopulate: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      get: (v: Rating) => Math.round(v) as Rating,
      set: (v: Rating) => Math.round(v),
      required: true,
    },
    review: { type: String, required: false },
  },
  { timestamps: true }
);

schema.plugin(require('mongoose-autopopulate'));

export default model('TutorReview', schema);
