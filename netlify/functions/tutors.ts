import moment from 'moment';
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

  const {
    filter: { startTime, endTime, tz, ...filters },
  } = parser.parse(queryStringParameters || '', predefined) as any;

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
        $and: [filters],
      },
    },
    {
      $addFields: {
        _scheduleArr: { $objectToArray: '$schedule' },
      },
    },
    {
      $addFields: {
        _scheduleArr: {
          $reduce: {
            input: '$_scheduleArr',
            initialValue: [],
            in: { $concatArrays: ['$$value', '$$this.v'] },
          },
        },
      },
    },
    {
      $unset: ['reviews', 'floorRating'],
    },
  ]);

  tutors = await TutorLead.populate(tutors, [
    {
      path: 'reviews',
    },
    {
      path: 'coursesAndLevels.course',
    },
    {
      path: 'coursesAndLevels.level',
    },
  ]);

  tutors = tutors.map((t) => TutorLead.hydrate(t).toJSON());
  if (startTime && endTime) {
    let momentStartTime = moment(startTime, 'hh:mm A');
    let momentEndTime = moment(endTime, 'hh:mm A');

    if (tz) {
      momentStartTime = momentStartTime.tz(tz, true);
      momentEndTime = momentEndTime.tz(tz, true);
    }

    tutors = tutors.map((t) => {
      t._scheduleArr = t._scheduleArr.map((s) => {
        s.begin = moment(s.begin, 'hh:mm A');
        s.end = moment(s.end, 'hh:mm A');

        return s;
      });

      return t;
    });

    tutors = tutors.filter((t) => {
      return !!t._scheduleArr.find((s) => {
        return momentStartTime.isSameOrAfter(s.begin) && momentEndTime.isSameOrBefore(s.end);
      });
    });
  }

  // delete the _scheduleArr property added in the aggregation
  tutors = tutors.map((t) => {
    delete t._scheduleArr;
    return t;
  });

  return {
    statusCode: 200,
    body: JSON.stringify(tutors),
  };
};

export const handler = middy(tutors);
