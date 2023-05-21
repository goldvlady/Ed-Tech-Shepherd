import Offer, { Offer as OfferType, STATUS as OFFERSTATUS } from "../database/models/Offer";
import TutorLead from "../database/models/TutorLead";
import { User } from "../database/models/User";

class OfferHandler {
    async createOffer(data: any, studentUser: User) {
        const tutorLead = await TutorLead.findById(data.tutor);
        const offer = await Offer.create({ ...data, studentLead: studentUser.studentLead, tutorLead });

        // TODO: Send offer email to tutor

        return offer;
    }

    async acceptOffer(offer: OfferType) {
        const acceptedOffer = await Offer.findByIdAndUpdate(offer._id, {
            status: OFFERSTATUS.ACCEPTED
        }, { new: true })

        // TODO: Send offer accepted email to student

        return acceptedOffer;
    }

    async declineOffer(offer: OfferType, note?: string) {
        const acceptedOffer = await Offer.findByIdAndUpdate(offer._id, {
            status: OFFERSTATUS.DECLINED,
            declinedNote: note
        }, { new: true })

        // TODO: Send offer accepted email to student

        return acceptedOffer;
    }
}

export default OfferHandler;