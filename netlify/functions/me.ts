import middy from '../utils/middy';
import authMiddleware from "../middlewares/authMiddleware";
import { HTTPEvent } from "../types";
import User from "../database/models/User";

const me = async (event: HTTPEvent) => {
    const { firebaseUser } = event;
    let user = await User.findOne({ firebaseId: firebaseUser.user_id });
    
    // create the user if they don't exist
    if (!user) {
        user = await User.create({
            firebaseId: firebaseUser.user_id,
            email: firebaseUser.email,
            name: firebaseUser.name
        })
    }

    return {
        statusCode: 200,
        body: JSON.stringify(user)
    }
}

export const handler = middy(me).use(authMiddleware());