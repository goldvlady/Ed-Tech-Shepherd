import { Handler, schedule } from "@netlify/functions";
import { connectToDb } from "./database/connection";
import Email from "./database/models/Email";
import MailgunService from "./services/MailgunService";

const myHandler: Handler = async () => {
    const mailgunService = new MailgunService();

    await connectToDb();

    let unsentEmails = await Email.find({
        sent: null
    })

    unsentEmails = unsentEmails.filter(e => {
        const createdDateMs = e.createdAt.getTime();
        const createdDatePlusDelayMs = createdDateMs + (e.delay || 0);
        const currentTimeMs = Date.now();

        return currentTimeMs >= createdDatePlusDelayMs;
    });

    await Promise.all(unsentEmails.map(async (email) => {
        try {
            await mailgunService.sendEmail(email.to, email.subject, email.content, [email.type]);
            await Email.updateOne({ _id: email._id }, {
                sent: new Date()
            })
        } catch (e) {
            console.log(e);
        }
    }))
    return {
        statusCode: 200,
        body: JSON.stringify('Emails sent'),
    };
};

const handler = schedule("* * * * *", myHandler)

export { handler };