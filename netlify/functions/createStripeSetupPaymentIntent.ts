import Stripe from "../utils/stripe";
import middy from "../utils/middy";
import authMiddleware from "../middlewares/authMiddleware";
import { HTTPEvent } from "../types";

const createStripeSetupPaymentIntent = async (event: HTTPEvent) => {
  const data = JSON.parse(event.body as string);
  let { user } = event;

  const setupIntent = await Stripe.setupIntents.create({
    customer: user.stripeCustomerId,
    payment_method_types: ["card"],
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      clientSecret: setupIntent.client_secret,
    }),
  };
};

export const handler = middy(createStripeSetupPaymentIntent).use(
  authMiddleware()
);
