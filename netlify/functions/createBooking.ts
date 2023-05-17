import middy from '../utils/middy';
import Booking from "../database/models/Booking";
import { Schedule } from "../database/models/Schedule";
import TutorLead, { TutorLead as TutorLeadInterface } from "../database/models/TutorLead";
import PaystackService from "../services/PaystackService";
import { HTTPEvent } from "../types";

export const createBooking = async (event: HTTPEvent) => {
  const paystack = new PaystackService();
  const data = JSON.parse(event.body as string);
  const { tutor, student, course, slots, paystackReference } = data;

  const tutorObject = await TutorLead.findById(tutor) as TutorLeadInterface;
  const amount = tutorObject.rate * (slots as Array<Schedule>).length;

  const resp = await paystack.verifyTransaction(paystackReference);
  const { status, data: { amount: amountPaid } } = resp;

  if (!status) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Payment unsuccessful"
      })
    }
  }

  const booking = await Booking.create({
    tutorLead: tutor,
    studentLead: student,
    course,
    slots,
    paystackReference,
    amountPaid
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      bookingId: booking.id
    })
  }
}

export const handler = middy(createBooking);