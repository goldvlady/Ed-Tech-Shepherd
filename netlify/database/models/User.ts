import { Schema, model } from "mongoose";
import { TimestampedEntity } from "../../types";
import StudentLead, { StudentLead as StudentLeadType } from "./StudentLead";
import TutorLead, { TutorLead as TutorLeadType } from "./TutorLead";
import { PaymentMethod } from "./PaymentMethod";

export interface User extends TimestampedEntity {
    name: {
        first: string,
        last: string
    };
    email: string;
    firebaseId: string;
    avatar?: string;
    tutorLead?: TutorLeadType;
    studentLead?: StudentLeadType;
    attachLeads: () => Promise<User>;
    type: 'student' | 'tutor';
    stripeCustomerId?: string;
    paymentMethods: PaymentMethod[]
}

const schema = new Schema<User>({
    name: {
        type: new Schema({
            first: String,
            last: String
        }), required: true
    },
    email: { type: String, required: true, unique: true },
    firebaseId: { type: String, required: true },
    avatar: { type: String, required: false },
    stripeCustomerId: { type: String, required: false }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

schema.virtual('tutorLead');
schema.virtual('studentLead');
schema.virtual('type');

schema.virtual('paymentMethods', {
    ref: 'PaymentMethod',
    localField: '_id',
    foreignField: 'user'
});

schema.methods.attachLeads = async function (cb: any) {
    const tutorLead = await TutorLead.findOne({ email: this.email });
    this.tutorLead = tutorLead;

    const studentLead = await StudentLead.findOne({ email: this.email });
    this.studentLead = studentLead;

    this.type = 'student';
    if (this.tutorLead) {
        this.type = 'tutor';
    }

    return this;
}

schema.plugin(require('mongoose-autopopulate'));

export default model<User>('User', schema);