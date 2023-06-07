import TutorLead from "../database/models/TutorLead";
import middy from "../utils/middy";
import authMiddleware from "../middlewares/authMiddleware";
import TutorReview from "../database/models/TutorReview";
import { HTTPEvent } from "../types";

export const tutorReview = async (event: HTTPEvent) => {
    const { user } = event;

    const data = JSON.parse(event.body as string);
    const { rating, review, tutor } = data;

    const tutorToRate = await TutorLead.findById(tutor);

    if (!tutorToRate) {
        return {
            statusCode: 404,
        };
    }

    const newReview = await TutorReview.create({
        tutor: tutorToRate._id,
        student: user.studentLead?._id,
        rating: rating,
        review: review
    });

    return {
        statusCode: 200,
        body: JSON.stringify(newReview)
    };
};

export const handler = middy(tutorReview).use(authMiddleware());
