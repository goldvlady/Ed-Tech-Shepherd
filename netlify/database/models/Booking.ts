import { Schema, model } from "mongoose";
import { TimestampedEntity } from "../../types";
import { Offer } from "./Offer";

export enum Status {
    CONFIRMED = "confirmed",
    UNCONFIRMED = "unconfirmed"
}

export interface Booking extends TimestampedEntity {
    stripeReference: string;
    amountPaid?: number;
    course: string;
    status: Status;
    conferenceHostRoomUrl?: string;
    conferenceRoomUrl?: string;
    startDate: Date;
    endDate: Date;
    offer: Offer;
}

const schema = new Schema<Booking>({
    stripeReference: { type: String, required: false },
    amountPaid: { type: Number, required: false },
    course: { type: String, required: true },
    status: { type: String, enum: Status, default: Status.UNCONFIRMED },
    conferenceHostRoomUrl: { type: String, required: false },
    conferenceRoomUrl: { type: String, required: false },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    offer: { type: Schema.Types.ObjectId, ref: "Offer", autopopulate: true },
}, { timestamps: true });

schema.plugin(require('mongoose-autopopulate'));

export default model<Booking>('Booking', schema);