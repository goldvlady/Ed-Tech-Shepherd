import { Schema, model } from "mongoose";
import { TimestampedEntity } from "../../types";
import { Student, Tutor } from "../../../src/types";

type Rating = 1|2|3|4|5;

interface TutorReview extends TimestampedEntity {
    tutor: Tutor
    student: Student
    rating: Rating
    review: string;
}

const schema = new Schema<TutorReview>({
    tutor: { type: Schema.Types.ObjectId, ref: "TutorLead", required: true, autopopulate: true },
    student: { type: Schema.Types.ObjectId, ref: "StudentLead", required: true, autopopulate: true },
    rating: { type: Number, min: 1, max: 5, get: (v:Rating) => Math.round(v) as Rating, set: (v: Rating) => Math.round(v), required: true },
    review: { type: String, required: false, }
}, { timestamps: true });

schema.plugin(require('mongoose-autopopulate'));

export default model('TutorReview', schema);