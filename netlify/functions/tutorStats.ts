import Offer, { STATUS as OFFER_STATUS } from '../database/models/Offer';
import authMiddleware from '../middlewares/authMiddleware';
import { HTTPEvent } from '../types';
import middy from '../utils/middy';

const tutorStats = async (event: HTTPEvent) => {
  let { user } = event;

  const data: Array<any> = await Offer.aggregate([
    {
      $facet: {
        totalClients: [
          { $match: { tutor: user.tutor?._id, status: OFFER_STATUS.ACCEPTED, completed: true } },
          { $group: { _id: '$student' } },
        ],
        currentClients: [
          {
            $match: {
              tutor: user.tutor?._id,
              status: OFFER_STATUS.ACCEPTED,
              completed: true,
              contractEndDate: { $gte: new Date() },
            },
          },
          { $group: { _id: '$student' } },
        ],
        hours: [
          { $match: { tutor: user.tutor?._id } },
          {
            $lookup: {
              from: 'bookings',
              localField: '_id',
              foreignField: 'offer',
              as: 'bookings',
              pipeline: [
                {
                  $match: {
                    amountPaid: { $exists: true },
                  },
                },
                {
                  $set: {
                    hoursDiff: {
                      $dateDiff: {
                        startDate: '$startDate',
                        endDate: '$endDate',
                        unit: 'hour',
                      },
                    },
                  },
                },
                {
                  $project: {
                    hoursDiff: '$hoursDiff',
                  },
                },
              ],
            },
          },
          {
            $project: {
              hoursDiff: { $sum: '$bookings.hoursDiff' },
            },
          },
        ],
      },
    },
    {
      $project: {
        totalClients: { $size: '$totalClients' },
        currentClients: { $size: '$currentClients' },
        hoursOfTutoring: { $ceil: { $sum: '$hours.hoursDiff' } },
      },
    },
  ]);

  return {
    statusCode: 200,
    body: JSON.stringify({ ...data[0], totalEarned: 0 }), // TODO: totalEarned should use transactions
  };
};

export const handler = middy(tutorStats).use(authMiddleware());
