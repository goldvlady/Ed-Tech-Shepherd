import Offer from "../database/models/Offer";
import OfferHandler from "../handlers/OfferHandler";
import authMiddleware from "../middlewares/authMiddleware";
import { HTTPEvent } from "../types";
import middy from "../utils/middy";

export const withdrawOffer = async (event: HTTPEvent) => {
  const offerHandler = new OfferHandler();
  const { user } = event;
  const data = JSON.parse(event.body as string);

  let offer = await Offer.findById(data.id);

  if (!offer) {
    return {
      statusCode: 404,
    };
  }

  offer = await offerHandler.withdrawOffer(offer);
  return {
    statusCode: 200,
    body: JSON.stringify(offer),
  };
};

export const handler = middy(withdrawOffer).use(authMiddleware());
