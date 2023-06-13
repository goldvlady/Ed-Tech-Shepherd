/**
 * Updates old tutor schedule to match the new schema
 * TODO: Remove when the new app (dev branch) has finally been deployed
 */
import { Handler, schedule } from '@netlify/functions';
import moment from 'moment';

import Tutor from '../database/models/Tutor';
import { HTTPEvent } from '../types';
import middy from '../utils/middy';

const fixTutorSchedule = async (event: HTTPEvent) => {
  const tutors = await Tutor.find();

  tutors.map(async (t) => {
    if (Array.isArray(t.schedule)) {
      const days = {};
      t.schedule.map((s) => {
        const dayOfWeek = new Date(s.begin).getDay();
        if (!days[dayOfWeek]) {
          days[dayOfWeek] = [];
        }

        days[dayOfWeek].push({
          begin: moment(s.begin).format('hh:mm A'),
          end: moment(s.end).format('hh:mm A'),
        });
      });

      await Tutor.findByIdAndUpdate(t._id, {
        schedule: days,
      });
    }
  });

  return {
    statusCode: 200,
    body: JSON.stringify({}),
  };
};

export const handler = schedule('*/5 * * * *', middy(fixTutorSchedule) as unknown as Handler);
