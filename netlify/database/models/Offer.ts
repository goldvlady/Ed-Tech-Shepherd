import moment from 'moment';
import { Schema, model } from 'mongoose';

import { TimestampedEntity } from '../../types';
import { Course } from './Course';
import { Level } from './Level';
import { PaymentMethod } from './PaymentMethod';
import { Student as StudentInterface } from './Student';
import { Tutor as TutorInterface } from './Tutor';

interface Schedule {
  [key: number]: {
    begin: String;
    end: String;
  };
}

export enum STATUS {
  DRAFT = 'draft',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  WITHDRAWN = 'withdrawn',
}

export interface Offer extends TimestampedEntity {
  course: Course;
  level: Level;
  schedule: Schedule;
  rate: number;
  note: string;
  status: STATUS;
  declinedNote: string;
  tutor: TutorInterface;
  student: StudentInterface;
  expirationDate: Date;
  contractStartDate: Date;
  contractEndDate: Date;
  completed?: boolean; //has been paid for
  paymentMethod?: PaymentMethod;
  expired: boolean;
}

const schema = new Schema<Offer>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      autopopulate: true,
      required: true,
    },
    level: {
      type: Schema.Types.ObjectId,
      ref: 'Level',
      autopopulate: true,
      required: true,
    },
    schedule: { type: Schema.Types.Mixed, required: true },
    rate: { type: Number, required: true },
    note: { type: String, required: false, default: '' },
    status: { type: String, enum: STATUS, default: STATUS.DRAFT },
    declinedNote: { type: String, required: false, default: '' },
    tutor: {
      type: Schema.Types.ObjectId,
      ref: 'Tutor',
      autopopulate: true,
      required: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      autopopulate: true,
      required: true,
    },
    expirationDate: { type: Date, required: true },
    contractStartDate: { type: Date, required: true },
    contractEndDate: { type: Date, required: true },
    completed: { type: Boolean, required: false },
    paymentMethod: {
      type: Schema.Types.ObjectId,
      ref: 'PaymentMethod',
      autopopulate: true,
      required: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

schema.plugin(require('mongoose-autopopulate'));

schema.virtual('amount').get(function () {
  return this.rate * 1;
});

schema.virtual('expired').get(function () {
  return moment().diff(this.expirationDate) >= 0;
});

export default model<Offer>('Offer', schema);
