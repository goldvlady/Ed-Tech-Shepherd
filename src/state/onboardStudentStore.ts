import { createStore } from '@udecode/zustood';
import moment from 'moment-timezone';
import { Schedule } from '../types';

export default createStore('onboardStudentStore')({
  parentOrStudent: null,
  name: {
    first: "",
    last: ""
  },
  dob: "",
  email: "",
  courses: [] as string[],
  schedule: [] as Schedule[],
  tz: moment.tz.guess()
})