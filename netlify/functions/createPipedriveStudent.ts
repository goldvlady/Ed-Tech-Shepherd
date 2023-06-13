import { Handler, schedule } from '@netlify/functions';

import Student from '../database/models/Student';
import { PipedriveService } from '../services/PipedriveService';
import middy from '../utils/middy';

const createPipedriveStudent = async () => {
  const pipedriveService = new PipedriveService();

  const studentsWithoutPipedriveDealId = await Student.find({
    pipedriveDealId: null,
  });

  await Promise.all(
    studentsWithoutPipedriveDealId.map(async (student) => {
      // create deal
      const dealId = await pipedriveService.createStudentDeal(student);
      await Student.updateOne(
        {
          _id: student._id,
        },
        { pipedriveDealId: dealId }
      );

      // create note
      const updatedStudent = await Student.findById(student.id);
      if (updatedStudent) {
        await pipedriveService.createStudentNote(updatedStudent);
      }
    })
  );

  return {
    statusCode: 200,
  };
};

export const handler = schedule('* * * * *', middy(createPipedriveStudent) as unknown as Handler);
