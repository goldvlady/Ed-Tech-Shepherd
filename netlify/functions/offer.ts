import middy from "../utils/middy";
import { HTTPEvent } from "../types";
import authMiddleware from "../middlewares/authMiddleware";
import Offer from "../database/models/Offer";

const offer = async (event: HTTPEvent) => {
  const { path } = event;
  let id = path.replace("/.netlify/functions/offer/", "").replace(/\//gim, "");

  let offer = await Offer.findById(id);

  if (!offer) {
    return { statusCode: 404 };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(offer),
  };
};

export const handler = middy(offer).use(authMiddleware());
