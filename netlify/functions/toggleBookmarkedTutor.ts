import BookmarkedTutor from '../database/models/BookmarkedTutor';
import Tutor from '../database/models/Tutor';
import authMiddleware from '../middlewares/authMiddleware';
import { HTTPEvent } from '../types';
import middy from '../utils/middy';
import { bookmarkedTutors } from './bookmarkedTutors';

const toggleBookmarkedTutor = async (event: HTTPEvent) => {
  const { user } = event;
  const { tutorId } = JSON.parse(event.body as string);

  const tutor = await Tutor.findById(tutorId);

  if (!tutor) {
    return {
      statusCode: 404,
    };
  }

  const existingBookmarkedTutor = await BookmarkedTutor.findOne({
    user: user._id,
    tutor: tutor._id,
  });

  if (existingBookmarkedTutor) {
    await existingBookmarkedTutor.deleteOne();
  } else {
    await BookmarkedTutor.create({
      user: user._id,
      tutor: tutor._id,
    });
  }

  return {
    statusCode: 200,
    body: JSON.stringify(await bookmarkedTutors(event)),
  };
};

export const handler = middy(toggleBookmarkedTutor).use(authMiddleware());
