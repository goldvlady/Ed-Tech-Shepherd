import { Schema, model } from 'mongoose';

import { TimestampedEntity } from '../../types';
import { PaymentMethod } from './PaymentMethod';
import { Student as StudentType } from './Student';
import { Tutor as TutorType } from './Tutor';

export interface User extends TimestampedEntity {
  name: {
    first: string;
    last: string;
  };
  email: string;
  firebaseId: string;
  avatar?: string;
  dob: string;
  tutor?: TutorType;
  student?: StudentType;
  isVerified: boolean;
  type: 'student' | 'tutor';
  stripeCustomerId?: string;
  paymentMethods: PaymentMethod[];
}

const schema = new Schema<User>(
  {
    name: {
      type: new Schema({
        first: String,
        last: String,
      }),
      required: true,
    },
    isVerified: {type: Boolean, default: false},
    dob: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    firebaseId: { type: String, required: true },
    avatar: { type: String, required: false },
    stripeCustomerId: { type: String, required: false },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, r) => {
        if (r.tutor) {
          delete r.tutor.user;
        }
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, r) => {
        if (r.tutor) {
          delete r.tutor.user;
        }
      },
    },
  }
);

schema.virtual('tutor');
schema.virtual('student');
schema.virtual('type');

schema.virtual('paymentMethods', {
  ref: 'PaymentMethod',
  localField: '_id',
  foreignField: 'user',
});

schema.virtual('tutor', {
  ref: 'Tutor',
  localField: 'email',
  foreignField: 'email',
  justOne: true,
  autopopulate: true,
  options: {
    match: {
      active: true,
    },
  },
});

schema.virtual('student', {
  ref: 'Student',
  localField: 'email',
  foreignField: 'email',
  justOne: true,
  autopopulate: true,
});

schema.virtual('type').get(function () {
  if (this.tutor) {
    return 'tutor';
  }

  return 'student';
});

schema.plugin(require('mongoose-autopopulate'));

export default model<User>('User', schema);
