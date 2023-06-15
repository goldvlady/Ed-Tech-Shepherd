import { HandlerEvent } from '@netlify/functions';

import Tutor from '../database/models/Tutor';
import EmailHandler from '../handlers/EmailHandler';
import middy from '../utils/middy';

export const createTutor = async (event: HandlerEvent) => {
  const emailHandler = new EmailHandler();
  const data = JSON.parse(event.body as string);

  try{
    const tutor = await Tutor.create(data);
    await emailHandler.createTutorWelcomeEmail(tutor);
    return {
      statusCode: 200,
    };
  }
  catch (e) {
    console.log(e)
    return {
      statusCode: 500,
      error: e
    };
  }

 
};

export const handler = middy(createTutor);
