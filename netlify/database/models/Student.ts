import { Schema, model } from 'mongoose';

import { Schedule } from '../../../src/types';
import { TimestampedEntity } from '../../types';
import { Course } from './Course';

export interface SkillLevel {
  course: String;
  skillLevel: String;
}

const skillLevelSchema = new Schema<SkillLevel>({
  course: { type: String, required: false },
  skillLevel: { type: String, required: false },
});

export interface Student extends TimestampedEntity {
  name: {
    first: string;
    last: string;
  };
  email: string;
  parentOrStudent: string;
  dob: string;
  courses: Array<Course> | Array<String>;
  gradeLevel?: string;
  somethingElse?: string;
  topic?: string;
  skillLevels?: (typeof skillLevelSchema)[];
  schedule: Schedule;
  tz: string;
  pipedriveDealId?: string;
}

const schema = new Schema<Student>(
  {
    name: {
      type: new Schema({
        first: String,
        last: String,
      }),
      required: true,
    },
    email: { type: String, required: true },
    parentOrStudent: { type: String, required: true },
    dob: { type: String, required: true },
    courses: [{ type: Schema.Types.ObjectId, ref: 'Course', autopopulate: true }],
    somethingElse: { type: String, required: false },
    gradeLevel: { type: String, required: false },
    topic: { type: String, required: false },
    skillLevels: { type: [skillLevelSchema], required: false },
    schedule: { type: Schema.Types.Mixed, required: true },
    tz: { type: String, required: true },

    pipedriveDealId: { type: String, required: false },
  },
  { timestamps: true }
);

schema.plugin(require('mongoose-autopopulate'));

export default model<Student>('Student', schema);
