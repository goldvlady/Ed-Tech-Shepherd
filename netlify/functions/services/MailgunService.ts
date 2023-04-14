const mailgun = require("mailgun-js");

class MailgunService {
    private mg;

    constructor() {
        this.mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN, host: "api.mailgun.net" });;
    }

    async sendEmail (to: string, subject: string, html: string, tags: string[] = [], from = "hello@mail.shepherdtutors.com") {
        return new Promise((resolve, reject) => {
            const data = {
                from: `Shepherd Tutors <${from}>`,
                to,
                subject,
                template: "default",
                "o:tag" : tags,
                'bcc': "shepherd@pipedrivemail.com",
                'h:X-Mailgun-Variables': JSON.stringify({content: html}),
                'h:Reply-To': 'hello@shepherdtutors.com'
            };

            this.mg.messages().send(data, function (error, body) {
               if (error) {
                   reject(error);
               }
    
               resolve(body);
            });
        })
    }
}

export default MailgunService;