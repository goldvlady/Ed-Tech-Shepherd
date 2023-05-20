import Offer from "../database/models/Offer";
import TutorLead from "../database/models/TutorLead";
import { User } from "../database/models/User";

class OfferHandler {
    async createOffer(data: any, studentUser: User) {
        const tutorLead = await TutorLead.findById(data.tutor);
        const offer = await Offer.create({ ...data, studentLead: studentUser.studentLead, tutorLead });
        
        // TODO: Send offer email to tutor

        return offer;
    }
}

export default OfferHandler;