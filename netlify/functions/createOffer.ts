import { HandlerEvent } from "@netlify/functions";
import Offer from "../database/models/Offer";
import middy from "../utils/middy";

export const createOffer = async (event: HandlerEvent) => {
  const data = JSON.parse(event.body as string);

  const offer = await Offer.create(data);

  return {
    statusCode: 200
  }
}

export const handler = middy(createOffer);