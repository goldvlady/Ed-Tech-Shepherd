import BookmarkedTutor from "../database/models/BookmarkedTutor";
import authMiddleware from "../middlewares/authMiddleware";
import { HTTPEvent } from "../types";
import middy from "../utils/middy";

export const bookmarkedTutors = async (event: HTTPEvent) => {
  const { user } = event;

  const tutors = await BookmarkedTutor.find({
    user: user._id,
  });

  return {
    statusCode: 200,
    body: JSON.stringify(tutors),
  };
};

export const handler = middy(bookmarkedTutors).use(authMiddleware());
