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
      $lookup: {
        from: 'tutorreviews',
        localField: '_id',
        foreignField: 'tutor',
        as: 'reviews',
      },
    },
    {
      $addFields: {
        rating: { $avg: '$reviews.rating' },
      },
    },
    {
      $addFields: {
        rating: {
          $cond: {
            if: {
              $eq: [
                {
                  $ifNull: ['$rating', ''],
                },
                '',
              ],
            },
            then: 0,
            else: '$rating',
          },
        },
      },
    },
    {
      $addFields: {
        reviewCount: { $size: '$reviews' },
        rating: { $round: ['$rating', 1] },
        floorRating: { $floor: '$rating' },
      },
    },
    {
      $match: {
        $and: [parsed.filter],
      },
    },
    {
      $unset: ['reviews', 'floorRating'],
    },
  ]);

  return {
    statusCode: 200,
    body: JSON.stringify(tutors),
  };
};

export const handler = middy(tutors);
