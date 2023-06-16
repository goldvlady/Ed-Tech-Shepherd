import { getAuth } from 'firebase-admin/auth';
import { first, last } from 'lodash';

import User from '../database/models/User';
import authMiddleware from '../middlewares/authMiddleware';
import { HTTPEvent } from '../types';
import middy from '../utils/middy';

const me = async (event: HTTPEvent) => {
  let { firebaseUser, user } = event;

  if (!user) {
    const firebaseUserObject = await getAuth().getUser(firebaseUser.user_id);
    const names = firebaseUserObject.displayName?.split(' ');

    // Try to find the user first
    const persistedUser = await User.findOne({ firebaseId: firebaseUser.user_id });

    if(persistedUser) user = persistedUser
    else{
        user = await User.create({
          firebaseId: firebaseUser.user_id,
          email: firebaseUser.email,
          name: {
            first: first(names),
            last: last(names),
          },
        });
    }   
  }

  return {
    statusCode: 200,
    body: JSON.stringify(user),
  };
};

export const handler = middy(me).use(authMiddleware());
