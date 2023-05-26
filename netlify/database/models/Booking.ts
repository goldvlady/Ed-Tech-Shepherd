import { Schema, model } from "mongoose";
import { TimestampedEntity } from "../../types";
import { StudentLead as StudentLeadInterface } from "./StudentLead";
import { TutorLead as TutorLeadInterface } from "./TutorLead";

export enum Status {
    CONFIRMED = "confirmed",
    UNCONFIRMED = "unconfirmed"
}

export interface Booking extends TimestampedEntity {
    tutorLead: TutorLeadInterface;
    studentLead: StudentLeadInterface;
    paystackReference: string;
    amountPaid: number;
    course: string;
    status: Status;
    conferenceHostRoomUrl?: string;
    conferenceRoomUrl?: string;
    startDate: Date;
    endDate: Date;
}

const schema = new Schema<Booking>({
    tutorLead: { type: Schema.Types.ObjectId, ref: "TutorLead", autopopulate: true },
    studentLead: { type: Schema.Types.ObjectId, ref: "StudentLead", autopopulate: true },
    paystackReference: { type: String, required: false },
    amountPaid: { type: Number, required: true },
    course: { type: String, required: true },
    status: { type: String, enum: Status, default: Status.UNCONFIRMED },
    conferenceHostRoomUrl: { type: String, required: false },
    conferenceRoomUrl: { type: String, required: false },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
}, { timestamps: true });

schema.plugin(require('mongoose-autopopulate'));

export default model<Booking>('Booking', schema);