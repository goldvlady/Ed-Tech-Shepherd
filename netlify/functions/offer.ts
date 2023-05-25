import middy from '../utils/middy';
import { HTTPEvent } from "../types";
import authMiddleware from '../middlewares/authMiddleware';
import Offer from '../database/models/Offer';
import OfferHandler from '../handlers/OfferHandler';

const offer = async (event: HTTPEvent) => {
    const { path, queryStringParameters } = event;
    let id = path.replace('/.netlify/functions/offer/', '').replace(/\//gim, '');

    const offerHandler = new OfferHandler();

    let offer = await Offer.findById(id);

    if (!offer) {
        return { statusCode: 404 }
    }

    if (queryStringParameters?.payment_intent) {
        offer = await offerHandler.confirmOffer(offer);
    }

    return {
        statusCode: 200,
        body: JSON.stringify(offer)
    }
}

export const handler = middy(offer).use(authMiddleware());