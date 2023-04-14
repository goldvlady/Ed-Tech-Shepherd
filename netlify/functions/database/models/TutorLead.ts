import { Schema, model } from "mongoose";
import { TimestampedEntity } from "../../types";
import { PipedriveService } from "../../services/PipedriveService";
import scheduleSchema, { Schedule } from "./Schedule";

export interface TutorLead extends TimestampedEntity {
    _id: string;
    name: {
        first: string,
        last: string
    };
    email: string;
    dob: string;
    courses: string[];
    schedule: Schedule[];
    rate: number;
    active?: boolean;
    description?: string;
    avatar?: string;
    occupation?: string;
    highestLevelOfEducation: string;
    cv: string;
    teachLevel: string[];
    tz: string;

    pipedriveDealId?: string;
}

const schema = new Schema<TutorLead>({
    name: {
        type: new Schema({
            first: String,
            last: String
        }), required: true
    },
    email: { type: String, required: true },
    dob: { type: String, required: true },
    courses: { type: [String], required: true },
    schedule: { type: [scheduleSchema], required: true },
    rate: { type: Number, required: true },
    active: { type: Boolean, required: false },
    description: { type: String, required: false },
    avatar: { type: String, required: false },
    occupation: { type: String, required: false },
    highestLevelOfEducation: { type: String, required: true },
    cv: { type: String, required: true },
    teachLevel: { type: [String], required: true },
    tz: { type: String, required: true },


    pipedriveDealId: { type: String, required: false },
}, { timestamps: true });

schema.plugin(require('mongoose-autopopulate'));

schema.post(["update", "findOneAndUpdate", "updateOne"], async function () {
    const docToUpdate = await this.model.findOne(this.getQuery());

    if (!docToUpdate) {
        return
    }

    const pd = new PipedriveService();
    await pd.updateTutorDeal(docToUpdate);
});

export default model<TutorLead>('TutorLead', schema);