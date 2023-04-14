import { HandlerEvent } from "@netlify/functions";
import { connectToDb } from "./database/connection";
import StudentLead from "./database/models/StudentLead";
import EmailHandler from "./handlers/EmailHandler";

export const handler = async (event: HandlerEvent) => {
  const emailHandler = new EmailHandler();
  const data = JSON.parse(event.body as string);

  await connectToDb();
  const student = await StudentLead.create(data);

  try {
    await emailHandler.createStudentWelcomeEmail(student);
  } catch (e) {

  }

  return {
    statusCode: 200
  }
}