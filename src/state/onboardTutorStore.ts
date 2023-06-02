import { createStore } from '@udecode/zustood';
import moment from 'moment-timezone';
import { Entity, Schedule, Tutor } from '../types';
import { TimestampedEntity } from '../../netlify/types';

export default createStore('onboardTutorStore')<Omit<Tutor, keyof Entity | keyof  TimestampedEntity>>({
  name: {
    first: "",
    last: ""
  },
  dob: "",
  email: "",
  courses: [],
  schedule: {} as Schedule,
  tz: moment.tz.guess(),
  rate: 0,
  occupation: "",
  highestLevelOfEducation: "",
  cv: "",
  teachLevel: [],
  avatar: "",
  description: ""
})