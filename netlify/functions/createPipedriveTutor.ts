import { Handler, schedule } from '@netlify/functions';

import Tutor from '../database/models/Tutor';
import { PipedriveService } from '../services/PipedriveService';
import middy from '../utils/middy';

const createPipedriveTutor = async () => {
  const pipedriveService = new PipedriveService();

  const tutorsWithoutPipedriveDealId = await Tutor.find({
    pipedriveDealId: null,
  });

  await Promise.all(
    tutorsWithoutPipedriveDealId.map(async (tutor) => {
      try {
        // create deal
        const dealId = await pipedriveService.createTutorDeal(tutor);
        await Tutor.updateOne(
          {
            _id: tutor._id,
          },
          { pipedriveDealId: dealId }
        );

        // create note
        const updatedTutor = await Tutor.findById(tutor.id);
        if (updatedTutor) {
          await pipedriveService.createTutorNote(updatedTutor);
        }
      } catch (e) {
        // TODO: Sentry
      }
    })
  );

  return {
    statusCode: 200,
  };
};

export const handler = schedule('* * * * *', middy(createPipedriveTutor) as unknown as Handler);
