/**
 * This function periodically updates bookings with conference urls and changes their status to "CONFIRMED"
 */

import { Handler, schedule } from "@netlify/functions";
import middy from "../utils/middy";
import WherebyService from "../services/WherebyService";
import Booking, { STATUS } from "../database/models/Booking";

const createBookingConferenceLink = async () => {
  const wherebyService = new WherebyService();

  const bookingsWithoutLink = await Booking.find({
    conferenceHostRoomUrl: null,
    conferenceRoomUrl: null,
  });

  await Promise.all(
    bookingsWithoutLink.map(async (booking) => {
      const { roomUrl, hostRoomUrl } = await wherebyService.createMeeting();
      await Booking.updateOne(
        {
          _id: booking._id,
        },
        {
          conferenceHostRoomUrl: hostRoomUrl,
          conferenceRoomUrl: roomUrl,
          status: STATUS.CONFIRMED,
        }
      );
    })
  );

  return {
    statusCode: 200,
  };
};

export const handler = schedule(
  "* * * * *",
  middy(createBookingConferenceLink) as unknown as Handler
);
