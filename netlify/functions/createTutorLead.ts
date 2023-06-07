import { HandlerEvent } from "@netlify/functions";
import TutorLead from "../database/models/TutorLead";
import EmailHandler from "../handlers/EmailHandler";
import middy from "../utils/middy";

export const createTutorLead = async (event: HandlerEvent) => {
  const emailHandler = new EmailHandler();
  const data = JSON.parse(event.body as string);

  const tutor = await TutorLead.create(data);

  try {
    await emailHandler.createTutorWelcomeEmail(tutor);
  } catch (e) {}

  return {
    statusCode: 200,
  };
};

export const handler = middy(createTutorLead);
