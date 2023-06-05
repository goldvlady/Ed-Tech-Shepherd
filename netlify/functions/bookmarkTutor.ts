import BookmarkedTutor from "../database/models/BookmarkedTutor";
import TutorLead from "../database/models/TutorLead";
import authMiddleware from "../middlewares/authMiddleware";
import { HTTPEvent } from "../types";
import middy from "../utils/middy";

export const bookmarkTutor = async (event: HTTPEvent) => {
    const { user } = event;
    const { tutorId } = JSON.parse(event.body as string);

    const tutor = await TutorLead.findById(tutorId);

    if (!tutor) {
        return {
            statusCode: 404,
        }
    }

    const bookmarkedTutor = await BookmarkedTutor.create({
        user: user._id,
        tutor: tutor._id
    })

    return {
        statusCode: 200,
        body: JSON.stringify(bookmarkedTutor)
    }
}

export const handler = middy(bookmarkTutor).use(authMiddleware());