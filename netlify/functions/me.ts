import middy from '../utils/middy';
import authMiddleware from "../middlewares/authMiddleware";
import { HTTPEvent } from "../types";
import User from "../database/models/User";
import { getAuth } from 'firebase-admin/auth';
import { first, last } from 'lodash';

const me = async (event: HTTPEvent) => {
    return {
        statusCode: 200,
        body: JSON.stringify({'fs': "fd"})
    }
}

export const handler = middy(me);