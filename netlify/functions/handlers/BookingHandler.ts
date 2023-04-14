import Booking, { Booking as BookingInterface, Status } from "../database/models/Booking";
import WherebyService from "../services/WherebyService";
import Stripe from '../stripe';
import EmailHandler from "./EmailHandler";

class BookingHandler {
    private emailHandler = new EmailHandler();
    private wherebyService = new WherebyService();

    async confirmBooking(booking: BookingInterface, confirmStripePaymentIntent: boolean = true) {
        if (confirmStripePaymentIntent) {
            const resp = await Stripe.paymentIntents.retrieve(booking.stripePaymentIntentId);
            if (resp.status !== "succeeded") {
                throw `payment status unsuccessful (${resp.status})`
            }
        }

        const { roomUrl, hostRoomUrl } = await this.wherebyService.createMeeting();

        await Booking.updateOne({
            _id: booking._id,
        }, {
            status: Status.CONFIRMED,
            conferenceHostRoomUrl: hostRoomUrl,
            conferenceRoomUrl: roomUrl
        })

        const updatedBooking = await Booking.findById(booking._id);

        try {
            this.emailHandler.createStudentBookingConfirmedEmail(updatedBooking as BookingInterface);
            this.emailHandler.createTutorBookingConfirmedEmail(updatedBooking as BookingInterface);
        } catch (e) {
        }

        return updatedBooking;
    }
}

export default BookingHandler;