import { Handler, schedule } from "@netlify/functions";
import Email from "../database/models/Email";
import SESService from "../services/SESService";
import middy from "../utils/middy";

const processEmails = async () => {
  const sesService = new SESService();

  let unsentEmails = await Email.find({
    sent: null,
  });

  unsentEmails = unsentEmails.filter((e) => {
    const createdDateMs = e.createdAt.getTime();
    const createdDatePlusDelayMs = createdDateMs + (e.delay || 0);
    const currentTimeMs = Date.now();

    return currentTimeMs >= createdDatePlusDelayMs;
  });

  await Promise.all(
    unsentEmails.map(async (email) => {
      try {
        await sesService.sendEmail(email.to, email.subject, email.content, [
          email.type,
        ]);
        await Email.updateOne(
          { _id: email._id },
          {
            sent: new Date(),
          }
        );
      } catch (e) {
        console.log(e);
      }
    })
  );

  return {
    statusCode: 200,
  };
};

export const handler = schedule(
  "* * * * *",
  middy(processEmails) as unknown as Handler
);
