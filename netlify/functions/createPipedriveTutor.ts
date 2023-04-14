import { Handler, schedule } from "@netlify/functions";
import { connectToDb } from "./database/connection";
import TutorLead from "./database/models/TutorLead";
import { PipedriveService } from "./services/PipedriveService";

const myHandler: Handler = async () => {
  const pipedriveService = new PipedriveService();

  await connectToDb();

  const tutorsWithoutPipedriveDealId = await TutorLead.find({
    pipedriveDealId: null,
  })

  await Promise.all(tutorsWithoutPipedriveDealId.map(async (tutor) => {
    try {
      // create deal
      const dealId = await pipedriveService.createTutorDeal(tutor);
      await TutorLead.updateOne({
        _id: tutor._id,
      }, { pipedriveDealId: dealId, });

      // create note
      const updatedTutor = await TutorLead.findById(tutor.id);
      if (updatedTutor) {
        await pipedriveService.createTutorNote(updatedTutor)
      }
    } catch (e) {
      // TODO: Sentry
    }
  }))

  return {
    statusCode: 200,
  };
};

const handler = schedule("* * * * *", myHandler)

export { handler };