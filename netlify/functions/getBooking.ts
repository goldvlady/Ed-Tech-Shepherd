import { HandlerEvent } from "@netlify/functions";
import Booking, { Status } from "../database/models/Booking";
import BookingHandler from "../handlers/BookingHandler";
import authMiddleware from "../middlewares/authMiddleware";
import middy from "../utils/middy";

type Params = {
    id: string;
}

export const getBooking = async (event: HandlerEvent) => {
    const bookingHandler = new BookingHandler();
    const { id } = event.queryStringParameters as Params;

    let booking = await Booking.findById(id);

    if (!booking) {
        return {
            statusCode: 404
        }
    }

    if (booking.status === Status.UNCONFIRMED) {
        try {
            const confirmedBooking = await bookingHandler.confirmBooking(booking);
            booking = confirmedBooking;
        } catch (e) {
            console.log(e);
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify(booking)
    }
}

export const handler = middy(getBooking).use(authMiddleware());