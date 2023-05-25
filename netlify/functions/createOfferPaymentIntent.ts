import { HandlerEvent } from "@netlify/functions";
import Offer from "../database/models/Offer";
import Stripe from "../utils/stripe"
import middy from "../utils/middy";

const createOfferPaymentIntent = async (event: HandlerEvent) => {
    const data = JSON.parse(event.body as string);
    const { offerId } = data;

    const offer = await Offer.findById(offerId);

    if (!offer) {
        return {
            statusCode: 404
        }
    }

    const paymentIntent = await Stripe.paymentIntents.create({
        amount: offer.amount * 100,
        currency: "usd",
        automatic_payment_methods: {
            enabled: true,
        },
    });

    await Offer.findByIdAndUpdate(offer._id, { stripePaymentIntent: paymentIntent })

    return {
        statusCode: 200,
        body: JSON.stringify({
            clientSecret: paymentIntent.client_secret
        })
    }
}

export const handler = middy(createOfferPaymentIntent);