import { Handler, schedule } from "@netlify/functions";
import * as Sentry from "@sentry/node";
import middy from "../utils/middy";
import User from "../database/models/User";
import stripe from "../utils/stripe";

const createStripeCustomer = async () => {
  const usersThatArentCustomersInStripe = await User.find({
    stripeCustomerId: null,
  }).limit(10);

  await Promise.all(
    usersThatArentCustomersInStripe.map(async (user) => {
      try {
        // create stripe customer
        const customer = await stripe.customers.create({ email: user.email });
        // update user with the new customer ID
        await User.updateOne(
          {
            _id: user._id,
          },
          { stripeCustomerId: customer.id }
        );
      } catch (e) {
        Sentry.captureException(e);
      }
    })
  );

  return {
    statusCode: 200,
  };
};

export const handler = schedule(
  "* * * * *",
  middy(createStripeCustomer) as unknown as Handler
);
