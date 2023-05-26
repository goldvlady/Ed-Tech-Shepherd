import SavedTutor from "../database/models/SavedTutor";
import authMiddleware from "../middlewares/authMiddleware";
import { HTTPEvent } from "../types";
import middy from "../utils/middy";

export const savedTutors = async (event: HTTPEvent) => {
    const { user } = event;

    const savedTutors = await SavedTutor.find({
        user: user._id
    })

    return {
        statusCode: 200,
        body: JSON.stringify(savedTutors)
    }
}

export const handler = middy(savedTutors).use(authMiddleware());