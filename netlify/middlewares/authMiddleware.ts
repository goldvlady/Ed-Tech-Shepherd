import middy from '@middy/core';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getAuth } from 'firebase-admin/auth';

import User from '../database/models/User';

const middleware = (): middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult> => {
  const before: middy.MiddlewareFn<APIGatewayProxyEvent, APIGatewayProxyResult> = async (
    request
  ) => {
    try {
      const token = request.event.headers?.authorization?.replace('Bearer ', '') || '';

      const firebaseUser = await getAuth().verifyIdToken(token);
      request.event['firebaseUser'] = firebaseUser;

      const user = await User.findOne({
        firebaseId: firebaseUser.user_id,
      }).populate('paymentMethods');

      request.event['user'] = user;
    } catch (e) {
      return {
        statusCode: 401,
      };
    }
  };

  return {
    before,
  };
};

export default middleware;
