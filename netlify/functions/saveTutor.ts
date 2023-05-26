import SavedTutor from "../database/models/SavedTutor";
import TutorLead from "../database/models/TutorLead";
import authMiddleware from "../middlewares/authMiddleware";
import { HTTPEvent } from "../types";
import middy from "../utils/middy";

export const saveTutor = async (event: HTTPEvent) => {
    const { user } = event;
    const { data: { tutorId } } = JSON.parse(event.body as string);

    const tutor = await TutorLead.findById(tutorId);

    if (!tutor) {
        return {
            statusCode: 404,
        }
    }

    const savedTutor = await SavedTutor.create({
        user: user._id,
        tutor: tutor._id
    })

    return {
        statusCode: 200,
        body: JSON.stringify(savedTutor)
    }
}

export const handler = middy(saveTutor).use(authMiddleware());