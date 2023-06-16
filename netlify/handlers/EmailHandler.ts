import { capitalize } from 'lodash';
import moment from 'moment-timezone';

import { Booking } from '../database/models/Booking';
import Email, { Types } from '../database/models/Email';
import { Offer } from '../database/models/Offer';
import { Student } from '../database/models/Student';
import { Tutor } from '../database/models/Tutor';
import { SITE_URL } from '../utils/config';

class EmailHandler {
  getButton(text: string, href: string) {
    return `<center>
        <table align="center" cellspacing="0" cellpadding="0" width="100%">
          <tr>
            <td align="center" style="padding: 10px;">
              <table border="0" class="mobile-button" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" bgcolor="#207df7" style="background-color: #207df7; margin: auto; max-width: 600px; -webkit-border-radius: 11px; -moz-border-radius: 11px; border-radius: 11px; padding: 15px 20px; " width="100%">
                  <!--[if mso]>&nbsp;<![endif]-->
                      <a href="${href}" target="_blank" style="16px; font-family: Arial, sans-serif; color: #ffffff; font-weight:normal; text-align:center; background-color: #207df7; text-decoration: none; border: none; -webkit-border-radius: 11px; -moz-border-radius: 11px; border-radius: 11px; display: inline-block;">
                          <span style="font-size: 16px; font-family: Arial, sans-serif; color: #ffffff; font-weight:normal; line-height:1.5em; text-align:center;">${text}</span>
                    </a>
                  <!--[if mso]>&nbsp;<![endif]-->
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
       </center>`;
  }

  async createTutorWelcomeEmail(tutor: Tutor) {
    await Email.create({
      to: tutor.email,
      subject: 'Hello from Shepherd Tutors',
      type: Types.WELCOME_TUTOR,
      content: `
Hi ${capitalize(tutor.user.name.first)},
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
            `,
    });
  }

  async createStudentWelcomeEmail(student: Student) {
    await Email.create({
      to: student.email,
      subject: 'Hello from Shepherd Tutors',
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
            `,
    });
  }

  async createStudentBookingConfirmedEmail(booking: Booking) {
    const timing = `${moment(booking.startDate).format('MMMM Do YYYY')}: ${moment(booking.startDate)
      .tz(booking.offer.student.tz)
      .format('hh:mm A')} - ${moment(booking.endDate)
      .tz(booking.offer.student.tz)
      .format('hh:mm A')}`;

    await Email.create({
      to: booking.offer.student.email,
      subject: `Get ready for your upcoming session with ${booking.offer.tutor.user.name.first}`,
      type: Types.BOOKING_CONFIRMED,
      content: `
Hi ${capitalize(booking.offer.student.name.first)},
<br />
<br />
We're excited to let you know that your <a href="${SITE_URL}/booking/${
        booking._id
      }/student">session</a> with ${
        booking.offer.tutor.user.name.first
      } has been successfully booked for the following dates:
<br />
<br />
${timing}
<br />
<br />
As a reminder, your session will be conducted through our online platform. To join the session, simply click on the following link: ${
        booking.conferenceRoomUrl
      }
<br />
<br />
Please make sure to log in a few minutes before the scheduled start time to avoid any delays. If you encounter any issues accessing the session, please reply to this email or reach out to us at <a href="mailto:hello@shepherdtutors.com">hello@shepherdtutors.com</a>
<br />
<br />
We hope you find your session with ${
        booking.offer.tutor.user.name.first
      } informative and productive. If you have any questions or concerns, please don't hesitate to let us know.
<br />
<br />
Cheers,
<br />
Shepherd Tutors
            `,
    });
  }

  async createTutorBookingConfirmedEmail(booking: Booking) {
    const timing = `${moment(booking.startDate).format('MMMM Do YYYY')}: ${moment(booking.startDate)
      .tz(booking.offer.tutor.tz)
      .format('hh:mm A')} - ${moment(booking.endDate)
      .tz(booking.offer.tutor.tz)
      .format('hh:mm A')}`;

    await Email.create({
      to: booking.offer.tutor.email,
      subject: `Get ready for your upcoming session with ${booking.offer.student.name.first}`,
      type: Types.BOOKING_CONFIRMED,
      content: `
Hi ${capitalize(booking.offer.tutor.user.name.first)},
<br />
<br />
We're excited to let you know that you've just been booked for a <a href="${SITE_URL}/booking/${
        booking._id
      }/student">session</a> with ${booking.offer.student.name.first} on the following dates:
<br />
<br />
${timing}
<br />
<br />
As a reminder, your session will be conducted through our online platform. To join the session, simply click on the following link: ${
        booking.conferenceRoomUrl
      }
<br />
<br />
Please make sure to log in a few minutes before the scheduled start time to avoid any delays. If you encounter any issues accessing the session, please reply to this email or reach out to us at <a href="mailto:hello@shepherdtutors.com">hello@shepherdtutors.com</a>
<br />
<br />
Cheers,
<br />
Shepherd Tutors
            `,
    });
  }

  async createNewOfferTutorEmail(offer: Offer) {
    const offerUrl = `${SITE_URL}/dashboard/offer/${offer._id}`;

    await Email.create({
      to: offer.tutor.email,
      subject: `You've received a new offer`,
      type: Types.NEW_OFFER_TUTOR,
      content: `
Hi ${capitalize(offer.tutor.user.name.first)},
<br />
<br />
We're excited to let you know that you've just received a new offer. Click the button below to view your offer.
<br />
<br />
${this.getButton('View your offer', offerUrl)}
<br />
<br />
Or use the following link:
<a href="${offerUrl}">${offerUrl}</a>
<br />
<br />
Cheers,
<br />
Shepherd Tutors
            `,
    });
  }

  async createOfferAcceptedStudentEmail(offer: Offer) {
    const offerUrl = `${SITE_URL}/dashboard/offer/${offer._id}`;

    await Email.create({
      to: offer.student.email,
      subject: `Your offer has been accepted`,
      type: Types.OFFER_ACCEPTED_STUDENT,
      content: `
Hi ${capitalize(offer.student.name.first)},
<br />
<br />
We're excited to let you know that your offer has been accepted. Click the button below to complete payment for your offer.
<br />
<br />
${this.getButton('View your offer', offerUrl)}
<br />
<br />
Or use the following link:
<a href="${offerUrl}">${offerUrl}</a>
<br />
<br />
Cheers,
<br />
Shepherd Tutors
            `,
    });
  }

  async createOfferDeclinedStudentEmail(offer: Offer) {
    const offerUrl = `${SITE_URL}/dashboard/offer/${offer._id}`;

    await Email.create({
      to: offer.student.email,
      subject: `There's been a new update on your offer`,
      type: Types.OFFER_DECLINED_STUDENT,
      content: `
Hi ${capitalize(offer.student.name.first)},
<br />
<br />
There's been a new update on your offer, Click the button below to view it.
<br />
<br />
${this.getButton('View your offer', offerUrl)}
<br />
<br />
Or use the following link:
<a href="${offerUrl}">${offerUrl}</a>
<br />
<br />
Cheers,
<br />
Shepherd Tutors
            `,
    });
  }

  async createOfferWithdrawnTutorEmail(offer: Offer) {
    const offerUrl = `${SITE_URL}/dashboard/offer/${offer._id}`;

    await Email.create({
      to: offer.tutor.email,
      subject: `There's been a new update on your offer`,
      type: Types.OFFER_WITHDRAWN_TUTOR,
      content: `
Hi ${capitalize(offer.tutor.user.name.first)},
<br />
<br />
There's been a new update on your offer, Click the button below to view it.
<br />
<br />
${this.getButton('View your offer', offerUrl)}
<br />
<br />
Or use the following link:
<a href="${offerUrl}">${offerUrl}</a>
<br />
<br />
Cheers,
<br />
Shepherd Tutors
            `,
    });
  }
}

export default EmailHandler;
