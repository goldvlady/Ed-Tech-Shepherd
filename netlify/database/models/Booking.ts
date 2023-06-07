import { Schema, model } from "mongoose";
import { TimestampedEntity } from "../../types";
import { Offer } from "./Offer";

export enum STATUS {
  UNCONFIRMED = "unconfirmed",
  CONFIRMED = "confirmed",
  CANCELED = "cenceled",
}

export interface Booking extends TimestampedEntity {
  stripeReference?: string;
  amountPaid?: number;
  status: STATUS;
  conferenceHostRoomUrl?: string;
  conferenceRoomUrl?: string;
  startDate: Date;
  endDate: Date;
  offer: Offer;
}

const schema = new Schema<Booking>(
  {
    stripeReference: { type: String, required: false },
    amountPaid: { type: Number, required: false },
    status: { type: String, enum: STATUS, default: STATUS.UNCONFIRMED },
    conferenceHostRoomUrl: { type: String, required: false },
    conferenceRoomUrl: { type: String, required: false },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    offer: { type: Schema.Types.ObjectId, ref: "Offer", autopopulate: true },
  },
  { timestamps: true }
);

schema.plugin(require("mongoose-autopopulate"));

export default model<Booking>("Booking", schema);
