import { Schema, model } from "mongoose";
import { TimestampedEntity } from "../../types";

export enum Types {
    WELCOME_STUDENT = "welcome_student",
    WELCOME_TUTOR = "welcome_tutor",

    BOOKING_CONFIRMED = "booking_confirmed"
}

interface Email extends TimestampedEntity {
    to: string;
    subject: string;
    content: string;
    type: Types;
    sent?: Date;
    delay?: number;
}

const schema = new Schema<Email>({
    to: { type: String, required: true },
    subject: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: String, enum: Types, required: true },
    sent: { type: Date, required: false },
    delay: { type: Number, required: false, default: 0 },
}, { timestamps: true });

export default model<Email>('Email', schema);