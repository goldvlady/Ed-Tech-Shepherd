import { Schema, model } from "mongoose";
import { TimestampedEntity } from "../../types";

export interface User extends TimestampedEntity {
    name: {
        first: string,
        last: string
    };
    email: string;
    firebaseId: string;
    avatar?: string;
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
    avatar: { type: String, required: false }
}, { timestamps: true });

export default model<User>('User', schema);