import { HandlerEvent } from '@netlify/functions';

import Tutor from '../database/models/Tutor';
import EmailHandler from '../handlers/EmailHandler';
import middy from '../utils/middy';

export const createTutor = async (event: HandlerEvent) => {
  const emailHandler = new EmailHandler();
  const data = JSON.parse(event.body as string);

  const tutor = await Tutor.create(data);

  try {
    await emailHandler.createTutorWelcomeEmail(tutor);
  } catch (e) {}

  return {
    statusCode: 200,
  };
};

export const handler = middy(createTutor);
