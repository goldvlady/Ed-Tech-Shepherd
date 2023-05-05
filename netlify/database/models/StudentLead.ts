import { Schema, model } from "mongoose";
import { TimestampedEntity } from "../../types";
import scheduleSchema from "./Schedule";

export interface SkillLevel {
    course: String,
    skillLevel: String
}

const skillLevelSchema = new Schema<SkillLevel>({
    course: { type: String, required: false },
    skillLevel: { type: String, required: false },
});

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
    gradeLevel?: string;
    somethingElse?: string;
    topic?: string;
    skillLevels?: typeof skillLevelSchema[];
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
    somethingElse: { type: String, required: false },
    gradeLevel: { type: String, required: false },
    topic: { type: String, required: false },
    skillLevels: { type: [skillLevelSchema], required: false },
    schedule: { type: [scheduleSchema], required: true },
    tz: { type: String, required: true },


    pipedriveDealId: { type: String, required: false },
}, { timestamps: true });

export default model<StudentLead>('StudentLead', schema);