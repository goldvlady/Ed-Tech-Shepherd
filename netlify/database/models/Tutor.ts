import { Schema, model } from 'mongoose';

import { Schedule } from '../../../src/types';
import { PipedriveService } from '../../services/PipedriveService';
import { TimestampedEntity } from '../../types';
import { Course } from './Course';
import { Level } from './Level';
import { TutorReview } from './TutorReview';
import { User } from './User';

interface TutorQualification {
  institution: string;
  degree: string;
  startDate: Date;
  endDate: Date;
}

interface TutorBankInfo {
  accountName: string;
  accountNumber: string;
  bankName: string;
}

interface TutorCourseAndLevel {
  course: Course;
  level: Level;
}

export interface Tutor extends TimestampedEntity {
  coursesAndLevels: Array<TutorCourseAndLevel>;
  schedule: Schedule;
  rate: number;
  active?: boolean;
  description?: string;
  avatar?: string;
  cv: string;
  tz: string;
  identityDocument?: string;
  introVideo?: string;
  qualifications?: Array<TutorQualification>;
  country?: string;
  bankInfo?: TutorBankInfo;

  pipedriveDealId?: string;

  // virtuals
  reviewCount: number;
  rating: number;
  user: User;
}

const paymentInformationSchema = new Schema({
  accountName: String,
  accountNumber: String,
  bankName: String,
});

interface TutorSchemaInterface extends Tutor {
  reviews: Array<TutorReview>;
}

const schema = new Schema<TutorSchemaInterface>(
  {
    coursesAndLevels: {
      type: [
        {
          course: { type: Schema.Types.ObjectId, ref: 'Course', autopopulate: true },
          level: { type: Schema.Types.ObjectId, ref: 'Level', autopopulate: true },
        },
      ],
      required: true,
    },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    schedule: { type: Schema.Types.Mixed, required: true },
    rate: { type: Number, required: true },
    active: { type: Boolean, required: false },
    description: { type: String, required: false },
    avatar: { type: String, required: false },
    cv: { type: String, required: true },
    tz: { type: String, required: true },
    identityDocument: { type: String, required: false },
    introVideo: { type: String, required: false },
    qualifications: { type: Schema.Types.Mixed, required: false },
    country: { type: String, required: false },
    bankInfo: { type: Schema.Types.Mixed, required: false },
    pipedriveDealId: { type: String, required: false },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, r) => {
        delete r.reviews;
        if (r.user) {
          delete r.user.tutor;
        }
      },
    },
    toObject: {
      virtuals: true,
      transform: (_, r) => {
        delete r.reviews;
        if (r.user) {
          delete r.user.tutor;
        }
      },
    },
  }
);

// @ts-expect-error
schema.post(['update', 'findOneAndUpdate', 'updateOne'], async function () {
  // @ts-expect-error
  const docToUpdate = await this.model.findOne(this.getQuery());

  if (!docToUpdate) {
    return;
  }

  const pd = new PipedriveService();
  await pd.updateTutorDeal(docToUpdate);
});

schema.virtual('user', {
  ref: 'User',
  localField: 'email',
  foreignField: 'email',
  justOne: true,
  autopopulate: { maxDepth: 1 },
});

schema.virtual('reviews', {
  ref: 'TutorReview',
  localField: '_id',
  foreignField: 'tutor',
  autopopulate: true,
});

schema.virtual('reviewCount').get(function () {
  return this.reviews.length;
});

schema.virtual('rating').get(function () {
  const ratingSum: number = this.reviews.reduce((total, a) => total + a.rating, 0);
  return ratingSum !== 0 ? parseFloat((ratingSum / this.reviews.length).toFixed(2)) : ratingSum;
});

schema.plugin(require('mongoose-autopopulate'));

export default model<Tutor>('Tutor', schema);
