import PaymentMethod from "../database/models/PaymentMethod";
import authMiddleware from "../middlewares/authMiddleware";
import { HTTPEvent } from "../types";
import middy from "../utils/middy";
import Stripe from "../utils/stripe";

export const addPaymentMethod = async (event: HTTPEvent) => {
  const { user } = event;
  const { stripeId } = JSON.parse(event.body as string);

  const stripePaymentMethod = await Stripe.paymentMethods.retrieve(stripeId);
  const existingPaymentMethod = await PaymentMethod.findOne({
    stripeId: stripePaymentMethod.id,
  });

  if (existingPaymentMethod) {
    return {
      statusCode: 200,
      body: JSON.stringify(existingPaymentMethod),
    };
  }

  const newPaymentMethod = await PaymentMethod.create({
    stripeId: stripePaymentMethod.id,
    expMonth: stripePaymentMethod.card?.exp_month,
    expYear: stripePaymentMethod.card?.exp_year,
    last4: stripePaymentMethod.card?.last4,
    country: stripePaymentMethod.card?.country,
    brand: stripePaymentMethod.card?.brand,
    user: user._id,
  });

  return {
    statusCode: 200,
    body: JSON.stringify(newPaymentMethod),
  };
};

export const handler = middy(addPaymentMethod).use(authMiddleware());
