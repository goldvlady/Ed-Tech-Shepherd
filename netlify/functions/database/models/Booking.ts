import { Schema, model } from "mongoose";
import { TimestampedEntity } from "../../types";
import scheduleSchema, { Schedule } from "./Schedule";
import { StudentLead as StudentLeadInterface } from "./StudentLead";
import { TutorLead as TutorLeadInterface } from "./TutorLead";

export enum Status {
    CONFIRMED = "confirmed",
    UNCONFIRMED = "unconfirmed"
}

export interface Booking extends TimestampedEntity {
    _id: string;
    tutorLead: TutorLeadInterface;
    studentLead: StudentLeadInterface;
    stripePaymentIntentClientSecret: string;
    stripePaymentIntentId: string;
    amountPaid: number;
    slots: Schedule[];
    course: string;
    status: Status;
    conferenceHostRoomUrl?: string;
    conferenceRoomUrl?: string;
}

const schema = new Schema<Booking>({
    tutorLead: { type: Schema.Types.ObjectId, ref: "TutorLead", autopopulate: true },
    studentLead: { type: Schema.Types.ObjectId, ref: "StudentLead", autopopulate: true },
    stripePaymentIntentClientSecret: { type: String, required: false },
    stripePaymentIntentId: { type: String, required: false },
    amountPaid: { type: Number, required: true },
    course: { type: String, required: true },
    slots: { type: [scheduleSchema], required: true },
    status: { type: String, enum: Status, default: Status.UNCONFIRMED },
    conferenceHostRoomUrl: { type: String, required: false },
    conferenceRoomUrl: { type: String, required: false },
}, { timestamps: true });

schema.plugin(require('mongoose-autopopulate'));

export default model<Booking>('Booking', schema);