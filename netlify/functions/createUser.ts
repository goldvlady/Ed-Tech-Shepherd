
import User, { User as UserType } from '../database/models/User';
import { HTTPEvent } from '../types';

const createUser = async (event: HTTPEvent) => {
    try {
        const userData: UserType = JSON.parse(event.body as string);


        const storedUser = await User.findOne({ firebaseId: userData.firebaseId });

        if (storedUser) {
            return {
                statusCode: 400,
                body: { message: "User already exists" },
            };
        }

        const user = await User.create({
            firebaseId: userData.firebaseId,
            email: userData.email,
            type: userData.type,
            name: {
                first: userData.name.first,
                last: userData.name.last
            },
        });

        return {
            statusCode: 400,
            body: { message: "User Created", user },
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: { message: "Failed to create user", error },
        };
    }
};

export default createUser;
