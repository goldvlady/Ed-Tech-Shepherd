import { Schema } from "mongoose";

export interface Schedule {
    begin: Date,
    end: Date
}

const schema = new Schema<Schedule>({
    begin: { type: Date, required: true },
    end: { type: Date, required: true },
});

export default schema;