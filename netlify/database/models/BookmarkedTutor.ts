import { Schema, model } from "mongoose";
import { TimestampedEntity } from "../../types";
import { TutorLead as TutorLeadInterface } from "./TutorLead";
import { User } from "./User";

export interface BookmarkedTutor extends TimestampedEntity {
    user: User;
    tutor: TutorLeadInterface
}

const schema = new Schema<BookmarkedTutor>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tutor: { type: Schema.Types.ObjectId, ref: "TutorLead", required: true, autopopulate: true },
}, { timestamps: true });

schema.plugin(require('mongoose-autopopulate'));

export default model<BookmarkedTutor>('BookmarkedTutor', schema);