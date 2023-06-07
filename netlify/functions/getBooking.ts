import { HandlerEvent } from "@netlify/functions";
import Booking from "../database/models/Booking";
import authMiddleware from "../middlewares/authMiddleware";
import middy from "../utils/middy";

type Params = {
  id: string;
};

export const getBooking = async (event: HandlerEvent) => {
  const { id } = event.queryStringParameters as Params;

  let booking = await Booking.findById(id);

  if (!booking) {
    return {
      statusCode: 404,
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(booking),
  };
};

export const handler = middy(getBooking).use(authMiddleware());
