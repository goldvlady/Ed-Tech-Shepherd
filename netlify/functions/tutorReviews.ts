import Tutor from '../database/models/Tutor';
import TutorReview from '../database/models/TutorReview';
import authMiddleware from '../middlewares/authMiddleware';
import { HTTPEvent } from '../types';
import middy from '../utils/middy';

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
