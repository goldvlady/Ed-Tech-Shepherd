import Booking from '../database/models/Booking';
import authMiddleware from '../middlewares/authMiddleware';
import { HTTPEvent } from '../types';
import middy from '../utils/middy';

const bookings = async (event: HTTPEvent) => {
  const { user } = event;

  let offerCriteria: Partial<Record<any, {}>> = {
    'tutor._id': user.tutor?._id,
  };
  if (user.type === 'student') {
    offerCriteria = { 'student._id': user.student?._id };
  }

  let allBookings = await Booking.find({ offer: { $ne: null } }).populate({
    path: 'offer',
    match: {
      ...offerCriteria,
    },
  });

  return {
    statusCode: 200,
    body: JSON.stringify(allBookings),
  };
};

export const handler = middy(bookings).use(authMiddleware());
