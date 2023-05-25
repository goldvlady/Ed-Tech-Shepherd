import Offer, { Offer as OfferType, STATUS as OFFERSTATUS } from "../database/models/Offer";
import TutorLead from "../database/models/TutorLead";
import { User } from "../database/models/User";
import Stripe from '../utils/stripe';

class OfferHandler {

    async confirmOffer(offer: OfferType) {
        //const { roomUrl, hostRoomUrl } = await this.wherebyService.createMeeting();

        const offerObject = await Offer.findById(offer._id);

        if (!offerObject?.stripePaymentIntent?.id) {
            return offerObject;
        }

        const resp = await Stripe.paymentIntents.retrieve(offerObject.stripePaymentIntent.id);
        if (resp.status !== "succeeded") {
            throw `payment status unsuccessful (${resp.status})`
        }

        return await Offer.findByIdAndUpdate(offer._id, { stripePaymentIntent: resp, completed: true }, { new: true });
    }

    async createOffer(data: any, studentUser: User) {
        const tutorLead = await TutorLead.findById(data.tutor);
        const offer = await Offer.create({ ...data, studentLead: studentUser.studentLead, tutorLead });

        // TODO: Send offer email to tutor

        return offer;
    }

    async acceptOffer(offer: OfferType) {
        const updatedOffer = await Offer.findByIdAndUpdate(offer._id, {
            status: OFFERSTATUS.ACCEPTED
        }, { new: true })

        // TODO: Send offer accepted email to student

        return updatedOffer;
    }

    async declineOffer(offer: OfferType, note?: string) {
        const updatedOffer = await Offer.findByIdAndUpdate(offer._id, {
            status: OFFERSTATUS.DECLINED,
            declinedNote: note
        }, { new: true })

        // TODO: Send offer declined email to student

        return updatedOffer;
    }

    async withdrawOffer(offer: OfferType) {
        const updatedOffer = await Offer.findByIdAndUpdate(offer._id, {
            status: OFFERSTATUS.WITHDRAWN
        }, { new: true })

        // TODO: Send offer withdrawn email to tutor

        return updatedOffer;
    }
}

export default OfferHandler;