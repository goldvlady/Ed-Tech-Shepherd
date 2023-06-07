import middy from "../utils/middy";
import { HTTPEvent } from "../types";
import authMiddleware from "../middlewares/authMiddleware";
import Booking from "../database/models/Booking";

const bookings = async (event: HTTPEvent) => {
  const { user } = event;

  let offerCriteria: Partial<Record<any, {}>> = {
    "tutorLead._id": user.tutorLead?._id,
  };
  if (user.type === "student") {
    offerCriteria = { "studentLead._id": user.studentLead?._id };
  }

  let allBookings = await Booking.find({ offer: { $ne: null } }).populate({
    path: "offer",
    match: {
      ...offerCriteria,
    },
  });

  return {
    statusCode: 200,
    body: JSON.stringify(allBookings),
  };
};

export const handler = middy(bookings).use(authMiddleware());
