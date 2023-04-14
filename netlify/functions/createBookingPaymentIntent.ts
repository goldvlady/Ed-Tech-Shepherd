import { HandlerEvent } from "@netlify/functions";
import { connectToDb } from "./database/connection";
import Booking from "./database/models/Booking";
import { Schedule } from "./database/models/Schedule";
import TutorLead, { TutorLead as TutorLeadInterface } from "./database/models/TutorLead";
import Stripe from "./stripe";

export const handler = async (event: HandlerEvent) => {
  const data = JSON.parse(event.body as string);
  const { tutor, student, course, slots } = data;

  await connectToDb();

  const tutorObject = await TutorLead.findById(tutor) as TutorLeadInterface;
  const amount = tutorObject.rate * (slots as Array<Schedule>).length;

  const paymentIntent = await Stripe.paymentIntents.create({
    amount: amount * 100,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  const booking = await Booking.create({
    tutorLead: tutor,
    studentLead: student,
    course,
    slots,
    stripePaymentIntentClientSecret: paymentIntent.client_secret,
    stripePaymentIntentId: paymentIntent.id,
    amountPaid: amount
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      clientSecret: paymentIntent.client_secret,
      bookingId: booking.id
    })
  }
}