import OfferHandler from "../handlers/OfferHandler";
import authMiddleware from "../middlewares/authMiddleware";
import { HTTPEvent } from "../types";
import middy from "../utils/middy";

export const createOffer = async (event: HTTPEvent) => {
  const { user } = event;

  const offerHandler = new OfferHandler();
  const data = JSON.parse(event.body as string);

  const offer = await offerHandler.createOffer(data, user);

  return {
    statusCode: 200,
    body: JSON.stringify(offer),
  };
};

export const handler = middy(createOffer).use(authMiddleware());
