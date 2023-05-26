import { Schema, model } from "mongoose";
import { TimestampedEntity } from "../../types";
import { TutorLead as TutorLeadInterface } from "./TutorLead";
import { User } from "./User";

export interface SavedTutor extends TimestampedEntity {
    user: User;
    tutor: TutorLeadInterface
}

const schema = new Schema<SavedTutor>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tutor: { type: Schema.Types.ObjectId, ref: "TutorLead", required: true },
}, { timestamps: true });

export default model<SavedTutor>('SavedTutor', schema);