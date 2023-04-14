import { Handler, schedule } from "@netlify/functions";
import { connectToDb } from "./database/connection";
import StudentLead from "./database/models/StudentLead";
import { PipedriveService } from "./services/PipedriveService";

const myHandler: Handler = async () => {
  const pipedriveService = new PipedriveService();

  await connectToDb();

  const studentsWithoutPipedriveDealId = await StudentLead.find({
    pipedriveDealId: null
  })

  await Promise.all(studentsWithoutPipedriveDealId.map(async (student) => {
    // create deal
    const dealId = await pipedriveService.createStudentDeal(student);
    await StudentLead.updateOne({
      _id: student._id,
    }, { pipedriveDealId: dealId, });

    // create note
    const updatedStudent = await StudentLead.findById(student.id);
    if (updatedStudent) {
      await pipedriveService.createStudentNote(updatedStudent)
    }
  }))

  return {
    statusCode: 200,
  };
};

const handler = schedule("* * * * *", myHandler)

export { handler };