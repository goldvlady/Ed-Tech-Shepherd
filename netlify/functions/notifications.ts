import UserNotification from '../database/models/UserNotification';
import authMiddleware from '../middlewares/authMiddleware';
import { HTTPEvent } from '../types';
import middy from '../utils/middy';

const notifications = async (event: HTTPEvent) => {
  let { user } = event;
  const notifications = await UserNotification.find({
    user: user._id,
  })
    .limit(100)
    .sort({ createdAt: -1 })
    .select('-user');

  return {
    statusCode: 200,
    body: JSON.stringify(notifications),
  };
};

export const handler = middy(notifications).use(authMiddleware());
