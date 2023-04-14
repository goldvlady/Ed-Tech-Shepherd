import { Booking } from "../database/models/Booking";
import Email, { Types } from "../database/models/Email";
import { StudentLead } from "../database/models/StudentLead";
import { TutorLead } from "../database/models/TutorLead";
import moment from "moment-timezone";
import {Schedule} from "../database/models/Schedule";
import { SITE_URL } from "../config";
import { capitalize } from "lodash";

class EmailHandler {

    async createTutorWelcomeEmail(tutor: TutorLead) {
        await Email.create({
            to: tutor.email,
            subject: "Hello from Shepherd Tutors",
            type: Types.WELCOME_TUTOR,
            content: `
Hi ${capitalize(tutor.name.first)},
<br />
<br />
We're thrilled to welcome you to Shepherd Tutors! We appreciate the time and effort you have invested in completing the onboarding process.
<br />
<br />
As a tutor, you play a critical role in helping students achieve their academic goals and reach their full potential. We value your expertise and commitment to education, and we are excited to have you join our community of dedicated and passionate educators.
<br />
<br />
At this stage, we are currently reviewing all applications and will be in touch with you as soon as possible to let you know if you have been selected as a tutor. We know that you are eager to start tutoring, and we assure you that we are working hard to review applications and match tutors with students.
<br />
<br />
Our team is always available to answer any questions you may have, so please do not hesitate to reach out if you need any assistance.
<br />
<br />
Cheers,
<br />
Shepherd Tutors
            `
        })
    }

    async createStudentWelcomeEmail(student: StudentLead) {
        await Email.create({
            to: student.email,
            subject: "Hello from Shepherd Tutors",
            type: Types.WELCOME_TUTOR,
            content: `
Hi ${capitalize(student.name.first)},
<br />
<br />
Welcome to Shepherd Tutors! We're thrilled to have you on board and excited to see you take the next step in your educational journey. You've completed the onboarding process, and we're grateful for your commitment to learning and growth.
<br />
<br />
We understand that finding the right tutor can be a crucial step in achieving your academic goals. That's why we're working hard to match you with a tutor who best fits your needs and preferences. Our team is dedicated to finding the right match for you, and we'll be reaching out to you as soon as we've identified the perfect tutor for you.
<br />
<br />
Thank you for choosing Shepherd Tutors as your learning partner. We're committed to helping you achieve your goals, and we look forward to working with you soon.
<br />
<br />
Our team is always available to answer any questions you may have, so please do not hesitate to reach out if you need any assistance.
<br />
<br />
Cheers,
<br />
Shepherd Tutors
            `
        })
    }

    async createStudentBookingConfirmedEmail(booking: Booking) {
        const schedule = booking.slots.map((s: Schedule) => {
            return `${moment(s.begin).format('MMMM Do YYYY')}: ${moment(s.begin).tz(booking.studentLead.tz).format('hh:mm A')} - ${moment(s.end).tz(booking.studentLead.tz).format('hh:mm A')}`
        })

        await Email.create({
            to: booking.studentLead.email,
            subject: `Get ready for your upcoming session with ${booking.tutorLead.name.first}`,
            type: Types.BOOKING_CONFIRMED,
            content: `
Hi ${capitalize(booking.studentLead.name.first)},
<br />
<br />
We're excited to let you know that your <a href="${SITE_URL}/booking/${booking._id}/student">session</a> with ${booking.tutorLead.name.first} has been successfully booked for the following dates:
<br />
<br />
${schedule.join('<br />')}
<br />
<br />
As a reminder, your session will be conducted through our online platform. To join the session, simply click on the following link: ${booking.conferenceRoomUrl}
<br />
<br />
Please make sure to log in a few minutes before the scheduled start time to avoid any delays. If you encounter any issues accessing the session, please reply to this email or reach out to us at <a href="mailto:hello@shepherdtutors.com">hello@shepherdtutors.com</a>
<br />
<br />
We hope you find your session with ${booking.tutorLead.name.first} informative and productive. If you have any questions or concerns, please don't hesitate to let us know.
<br />
<br />
Cheers,
<br />
Shepherd Tutors
            `
        })
    }

    async createTutorBookingConfirmedEmail(booking: Booking) {
        const schedule = booking.slots.map((s: Schedule) => {
            return `${moment(s.begin).format('MMMM Do YYYY')}: ${moment(s.begin).tz(booking.tutorLead.tz).format('hh:mm A')} - ${moment(s.end).tz(booking.tutorLead.tz).format('hh:mm A')}`
        })

        await Email.create({
            to: booking.tutorLead.email,
            subject: `Get ready for your upcoming session with ${booking.studentLead.name.first}`,
            type: Types.BOOKING_CONFIRMED,
            content: `
Hi ${capitalize(booking.tutorLead.name.first)},
<br />
<br />
We're excited to let you know that you've just been booked for a <a href="${SITE_URL}/booking/${booking._id}/student">session</a> with ${booking.studentLead.name.first} on the following dates:
<br />
<br />
${schedule.join('<br />')}
<br />
<br />
As a reminder, your session will be conducted through our online platform. To join the session, simply click on the following link: ${booking.conferenceRoomUrl}
<br />
<br />
Please make sure to log in a few minutes before the scheduled start time to avoid any delays. If you encounter any issues accessing the session, please reply to this email or reach out to us at <a href="mailto:hello@shepherdtutors.com">hello@shepherdtutors.com</a>
<br />
<br />
Cheers,
<br />
Shepherd Tutors
            `
        })
    }
}

export default EmailHandler;