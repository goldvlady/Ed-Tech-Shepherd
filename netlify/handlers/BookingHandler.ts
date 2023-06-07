import Booking, {
  Booking as BookingInterface,
  STATUS,
} from "../database/models/Booking";
import WherebyService from "../services/WherebyService";
import EmailHandler from "./EmailHandler";

class BookingHandler {
  private emailHandler = new EmailHandler();
  private wherebyService = new WherebyService();

  async confirmBooking(booking: BookingInterface) {
    const { roomUrl, hostRoomUrl } = await this.wherebyService.createMeeting();

    await Booking.updateOne(
      {
        _id: booking._id,
      },
      {
        status: STATUS.CONFIRMED,
        conferenceHostRoomUrl: hostRoomUrl,
        conferenceRoomUrl: roomUrl,
      }
    );

    const updatedBooking = await Booking.findById(booking._id);

    try {
      this.emailHandler.createStudentBookingConfirmedEmail(
        updatedBooking as BookingInterface
      );
      this.emailHandler.createTutorBookingConfirmedEmail(
        updatedBooking as BookingInterface
      );
    } catch (e) {}

    return updatedBooking;
  }
}

export default BookingHandler;
