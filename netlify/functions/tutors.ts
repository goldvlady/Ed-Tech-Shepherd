import { MongooseQueryParser } from 'mongoose-query-parser';

import TutorLead from '../database/models/TutorLead';
import { HTTPEvent } from '../types';
import middy from '../utils/middy';

const tutors = async (event: HTTPEvent) => {
  const { queryStringParameters } = event;

  const parser = new MongooseQueryParser();
  const predefined = {
    active: true,
  };
  const parsed = parser.parse(queryStringParameters || '', predefined);

  let tutors = await TutorLead.aggregate([
    {
      $match: {
        $and: [parsed.filter],
      },
    },
  ]);

  tutors = await TutorLead.populate(tutors, [
    {
      path: 'reviews',
    },
  ]);

  tutors = tutors.map((t) => TutorLead.hydrate(t).toJSON());

  return {
    statusCode: 200,
    body: JSON.stringify(tutors),
  };
};

export const handler = middy(tutors);
