import Offer from "../database/models/Offer";
import PaymentMethod from "../database/models/PaymentMethod";
import OfferHandler from "../handlers/OfferHandler";
import authMiddleware from "../middlewares/authMiddleware";
import { HTTPEvent } from "../types";
import middy from "../utils/middy";

export const bookOffer = async (event: HTTPEvent) => {
  const offerHandler = new OfferHandler();
  const { user } = event;
  const { id, paymentMethodId } = JSON.parse(event.body as string);

  let offer = await Offer.findById(id);
  let paymentMethod = await PaymentMethod.findById(paymentMethodId);

  if (!offer || !paymentMethod) {
    return {
      statusCode: 404,
    };
  }

  offer = await offerHandler.bookOffer(offer, paymentMethod);

  return {
    statusCode: 200,
    body: JSON.stringify(offer),
  };
};

export const handler = middy(bookOffer).use(authMiddleware());
