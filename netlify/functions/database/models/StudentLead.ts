import { Schema, model } from "mongoose";
import { TimestampedEntity } from "../../types";
import scheduleSchema from "./Schedule";

export interface StudentLead extends TimestampedEntity {
    _id: string;
    name: {
        first: string,
        last: string
    };
    email: string;
    parentOrStudent: string;
    dob: string;
    courses: string[];
    schedule: typeof scheduleSchema[];
    tz: string;

    pipedriveDealId?: string;
}

const schema = new Schema<StudentLead>({
    name: { type: new Schema({
        first: String,
        last: String
    }), required: true },
    email: { type: String, required: true },
    parentOrStudent: { type: String, required: true },
    dob: { type: String, required: true },
    courses: { type: [String], required: true },
    schedule: { type: [scheduleSchema], required: true },
    tz: { type: String, required: true },


    pipedriveDealId: { type: String, required: false },
}, { timestamps: true });

export default model<StudentLead>('StudentLead', schema);