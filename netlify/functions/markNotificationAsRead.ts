import UserNotification from '../database/models/UserNotification';
import authMiddleware from '../middlewares/authMiddleware';
import { HTTPEvent } from '../types';
import middy from '../utils/middy';

const markNotificationAsRead = async (event: HTTPEvent) => {
  let { user, body } = event;
  const { notificationId } = JSON.parse(body || '{}');

  if (notificationId) {
    await UserNotification.findOneAndUpdate(
      {
        _id: notificationId,
        user: user._id,
      },
      {
        readAt: new Date(),
      }
    );
  } else {
    await UserNotification.updateMany(
      {
        user: user._id,
        readAt: { $exists: false },
      },
      {
        readAt: new Date(),
      }
    );
  }

  return {
    statusCode: 200,
  };
};

export const handler = middy(markNotificationAsRead).use(authMiddleware());
