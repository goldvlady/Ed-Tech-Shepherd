import { HandlerEvent } from '@netlify/functions';

import Student from '../database/models/Student';
import EmailHandler from '../handlers/EmailHandler';
import middy from '../utils/middy';

export const createStudent = async (event: HandlerEvent) => {
  const emailHandler = new EmailHandler();
  const data = JSON.parse(event.body as string);

  const student = await Student.create(data);

  try {
    await emailHandler.createStudentWelcomeEmail(student);
  } catch (e) {}

  return {
    statusCode: 200,
  };
};

export const handler = middy(createStudent);
