import { Schema, model } from "mongoose";
import { TimestampedEntity } from "../../types";
import { StudentLead as StudentLeadInterface } from "./StudentLead";
import { TutorLead as TutorLeadInterface } from "./TutorLead";

export enum STATUS {
    DRAFT = 'draft',
    ACCEPTED = 'accepted',
    DECLINED = 'declined'
}

export interface Offer extends TimestampedEntity {
    subjectAndLevel: string;
    days: number[];
    schedule: string;
    startTime: string;
    endTime: string;
    rate: number;
    note: string;
    paymentOption: string;
    status: STATUS;
    declinedNote: string;
    tutorLead: TutorLeadInterface;
    studentLead: StudentLeadInterface;
    expirationDate: Date;
    contractStartDate: Date;
    contractEndDate: Date;
}

const schema = new Schema<Offer>({
    subjectAndLevel: { type: String, required: true },
    days: { type: [Number], required: true },
    schedule: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    rate: { type: Number, required: true },
    note: { type: String, required: false, default: '' },
    paymentOption: { type: String, required: true },
    status: { type: String, enum: STATUS, default: STATUS.DRAFT },
    declinedNote: { type: String, required: false, default: '' },
    tutorLead: { type: Schema.Types.ObjectId, ref: "TutorLead", autopopulate: true, required: true },
    studentLead: { type: Schema.Types.ObjectId, ref: "StudentLead", autopopulate: true, required: true },
    expirationDate: { type: Date, required: true },
    contractStartDate: { type: Date, required: true },
    contractEndDate: { type: Date, required: true },
}, { timestamps: true });

schema.plugin(require('mongoose-autopopulate'));

export default model<Offer>('Offer', schema);