import { Schema, model } from 'mongoose';

import { Course, Schedule } from '../../../src/types';
import { PipedriveService } from '../../services/PipedriveService';
import { TimestampedEntity } from '../../types';
import { TutorReview } from './TutorReview';

export interface TutorLead extends TimestampedEntity {
  name: {
    first: string;
    last: string;
  };
  email: string;
  dob: string;
  courses: Array<Course>;
  schedule: Schedule;
  rate: number;
  active?: boolean;
  description?: string;
  avatar?: string;
  occupation?: string;
  highestLevelOfEducation: string;
  cv: string;
  teachLevel: string[];
  tz: string;
  identityDocument?: string;

  pipedriveDealId?: string;

  // virtuals
  reviewCount: number;
  rating: number;
}

interface TutorLeadSchemaInterface extends TutorLead {
  reviews: Array<TutorReview>;
}

const schema = new Schema<TutorLeadSchemaInterface>(
  {
    name: {
      type: new Schema({
        first: String,
        last: String,
      }),
      required: true,
    },
    email: { type: String, required: true },
    dob: { type: String, required: true },
    courses: [{ type: Schema.Types.ObjectId, ref: 'Course', autopopulate: true }],
    schedule: { type: Schema.Types.Mixed, required: true },
    rate: { type: Number, required: true },
    active: { type: Boolean, required: false },
    description: { type: String, required: false },
    avatar: { type: String, required: false },
    occupation: { type: String, required: false },
    highestLevelOfEducation: { type: String, required: true },
    cv: { type: String, required: true },
    teachLevel: { type: [String], required: true },
    tz: { type: String, required: true },
    identityDocument: { type: String, required: false },

    pipedriveDealId: { type: String, required: false },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, r) => {
        delete r.reviews;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, r) => {
        delete r.reviews;
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

export default model<TutorLead>('TutorLead', schema);
