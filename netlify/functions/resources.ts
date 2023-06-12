import Course from '../database/models/Course';
import Level from '../database/models/Level';
import { HTTPEvent } from '../types';
import middy from '../utils/middy';

const resources = async (event: HTTPEvent) => {
  const [courses, levels] = await Promise.all([Course.find(), Level.find()]);

  return {
    statusCode: 200,
    body: JSON.stringify({
      courses,
      levels,
    }),
  };
};

export const handler = middy(resources);
