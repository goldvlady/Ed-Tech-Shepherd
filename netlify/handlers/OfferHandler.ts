import Offer, { Offer as OfferType, STATUS as OFFERSTATUS } from "../database/models/Offer";
import TutorLead from "../database/models/TutorLead";
import { PaymentMethod as PaymentMethodType } from "../database/models/PaymentMethod";
import { User as UserType } from "../database/models/User";
import EmailHandler from "./EmailHandler";
import moment from "moment";
import Booking, { Booking as BookingType } from "../database/models/Booking";

class OfferHandler {
    emailHandler = new EmailHandler();

    async createOffer(data: any, studentUser: UserType) {
        const tutorLead = await TutorLead.findById(data.tutor);
        const offer = await Offer.create({ ...data, studentLead: studentUser.studentLead, tutorLead });

        this.emailHandler.createNewOfferTutorEmail(offer);

        return offer;
    }

    async acceptOffer(offer: OfferType) {
        const updatedOffer = await Offer.findByIdAndUpdate(offer._id, {
            status: OFFERSTATUS.ACCEPTED
        }, { new: true })

        this.emailHandler.createOfferAcceptedStudentEmail(offer);

        return updatedOffer;
    }

    async declineOffer(offer: OfferType, note?: string) {
        const updatedOffer = await Offer.findByIdAndUpdate(offer._id, {
            status: OFFERSTATUS.DECLINED,
            declinedNote: note
        }, { new: true })

        this.emailHandler.createOfferDeclinedStudentEmail(offer);

        return updatedOffer;
    }

    async withdrawOffer(offer: OfferType) {
        const updatedOffer = await Offer.findByIdAndUpdate(offer._id, {
            status: OFFERSTATUS.WITHDRAWN
        }, { new: true })

        this.emailHandler.createOfferWithdrawnTutorEmail(offer);

        return updatedOffer;
    }

    async bookOffer(offer: OfferType, paymentMethod: PaymentMethodType) {
        // TODO: Send offer/booking confirmed email

        const momentOfferStartDate = moment(offer.contractStartDate);
        const momentOfferEndDate = moment(offer.contractEndDate);

        let bookingsToCreate: Array<Partial<BookingType>> = [];

        while (momentOfferStartDate.isBefore(momentOfferEndDate, 'day')) {
            const dayOfWeekIndex = momentOfferStartDate.day()
            if (offer.schedule[dayOfWeekIndex]) {
                let d = momentOfferStartDate.format('YYYY-MM-DD')
                let begin = moment(d + ` ${offer.schedule[dayOfWeekIndex].begin}`);
                let end = moment(d + ` ${offer.schedule[dayOfWeekIndex].end}`);

                bookingsToCreate.push({
                    startDate: begin.toDate(),
                    endDate: end.toDate(),
                    offer: offer._id as unknown as OfferType
                })
            }
            momentOfferStartDate.add(1, 'days');
        }

        await Booking.insertMany(bookingsToCreate);

        const updatedOffer = await Offer.findByIdAndUpdate(offer._id, {
            completed: true,
            paymentMethod: paymentMethod._id
        }, { new: true });

        return updatedOffer;
    }
}

export default OfferHandler;