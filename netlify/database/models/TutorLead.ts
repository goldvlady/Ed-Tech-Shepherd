import { ObjectId, Schema, model } from "mongoose";
import { TimestampedEntity } from "../../types";
import { PipedriveService } from "../../services/PipedriveService";
import { Course, Schedule } from "../../../src/types";

export interface TutorLead extends TimestampedEntity {
    name: {
        first: string,
        last: string
    };
    email: string;
    dob: string;
    courses: Array<Course> | Array<String>;
    schedule: Schedule;
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
    courses: [{ type: Schema.Types.ObjectId, ref: "Course", autopopulate: true }],
    schedule: { type: Schema.Types.Mixed, required: true },
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

// @ts-expect-error
schema.post(["update", "findOneAndUpdate", "updateOne"], async function () {
    // @ts-expect-error
    const docToUpdate = await this.model.findOne(this.getQuery());

    if (!docToUpdate) {
        return
    }

    const pd = new PipedriveService();
    await pd.updateTutorDeal(docToUpdate);
});

export default model<TutorLead>('TutorLead', schema);