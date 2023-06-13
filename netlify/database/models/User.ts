import { Schema, model } from 'mongoose';

import { TimestampedEntity } from '../../types';
import { PaymentMethod } from './PaymentMethod';
import StudentLead, { StudentLead as StudentLeadType } from './StudentLead';
import TutorLead, { TutorLead as TutorLeadType } from './TutorLead';

export interface User extends TimestampedEntity {
  name: {
    first: string;
    last: string;
  };
  email: string;
  firebaseId: string;
  avatar?: string;
  tutorLead?: TutorLeadType;
  studentLead?: StudentLeadType;
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
        if (r.tutorLead) {
          delete r.tutorLead.user;
        }
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, r) => {
        if (r.tutorLead) {
          delete r.tutorLead.user;
        }
      },
    },
  }
);

schema.virtual('tutorLead');
schema.virtual('studentLead');
schema.virtual('type');

schema.virtual('paymentMethods', {
  ref: 'PaymentMethod',
  localField: '_id',
  foreignField: 'user',
});

schema.virtual('tutorLead', {
  ref: 'TutorLead',
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

schema.virtual('studentLead', {
  ref: 'StudentLead',
  localField: 'email',
  foreignField: 'email',
  justOne: true,
  autopopulate: true,
});

schema.virtual('type').get(function () {
  if (this.tutorLead) {
    return 'tutor';
  }

  return 'student';
});

schema.plugin(require('mongoose-autopopulate'));

export default model<User>('User', schema);
