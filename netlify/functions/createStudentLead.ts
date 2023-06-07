import { HandlerEvent } from "@netlify/functions";
import StudentLead from "../database/models/StudentLead";
import EmailHandler from "../handlers/EmailHandler";
import middy from "../utils/middy";

export const createStudentLead = async (event: HandlerEvent) => {
  const emailHandler = new EmailHandler();
  const data = JSON.parse(event.body as string);

  const student = await StudentLead.create(data);

  try {
    await emailHandler.createStudentWelcomeEmail(student);
  } catch (e) {}

  return {
    statusCode: 200,
  };
};

export const handler = middy(createStudentLead);
