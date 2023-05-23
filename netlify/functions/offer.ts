import middy from '../utils/middy';
import { HTTPEvent } from "../types";
import authMiddleware from '../middlewares/authMiddleware';
import cors from '@middy/http-cors';
import Offer from '../database/models/Offer';

const tutor = async (event: HTTPEvent) => {
    const { path } = event;
    let id = path.replace('/.netlify/functions/offer/', '').replace(/\//gim, '');

    const offer = await Offer.findById(id);

    if (!offer) {
        return { statusCode: 404 }
    }

    return {
        statusCode: 200,
        body: JSON.stringify(offer)
    }
}

export const handler = middy(tutor).use(cors());