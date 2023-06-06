import middy from '../utils/middy';
import { HTTPEvent } from "../types";
import User from "../database/models/User";
import { getAuth } from 'firebase-admin/auth';
import { first, last } from 'lodash';
import authMiddleware from '../middlewares/authMiddleware';

const me = async (event: HTTPEvent) => {
    let { firebaseUser, user } = event;

    if (!user) {
        const firebaseUserObject = await getAuth().getUser(firebaseUser.user_id);
        const names = firebaseUserObject.displayName?.split(' ');

        user = await User.create({
            firebaseId: firebaseUser.user_id,
            email: firebaseUser.email,
            name: {
                first: first(names),
                last: last(names)
            }
        })
    }

    await user.attachLeads();

    return {
        statusCode: 200,
        body: JSON.stringify(user)
    }
}

export const handler = middy(me).use(authMiddleware());