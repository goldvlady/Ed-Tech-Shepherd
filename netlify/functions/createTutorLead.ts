import { HandlerEvent } from "@netlify/functions";
import { connectToDb } from "./database/connection";
import TutorLead from "./database/models/TutorLead";
import EmailHandler from "./handlers/EmailHandler";

export const handler = async (event: HandlerEvent) => {
  const emailHandler = new EmailHandler();
  const data = JSON.parse(event.body as string);

  await connectToDb();
  const tutor = await TutorLead.create(data);

  try {
    await emailHandler.createTutorWelcomeEmail(tutor);
  } catch (e) {

  }

  return {
    statusCode: 200
  }
}