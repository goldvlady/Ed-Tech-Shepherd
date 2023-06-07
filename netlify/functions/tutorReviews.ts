import TutorLead from "../database/models/TutorLead";
import middy from "../utils/middy";
import authMiddleware from "../middlewares/authMiddleware";
import TutorReview from "../database/models/TutorReview";
import { HTTPEvent } from "../types";

export const tutorReviews = async (event: HTTPEvent) => {
  const { tutor } = event.queryStringParameters as { tutor: string };

  const reviews = await TutorReview.find({ tutor });

  if (!tutor) {
    return {
      statusCode: 404,
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(reviews),
  };
};

export const handler = middy(tutorReviews);
