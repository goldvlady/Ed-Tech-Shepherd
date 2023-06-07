import { Schema, model } from "mongoose";
import { TimestampedEntity } from "../../types";
import { StudentLead as StudentLeadInterface } from "./StudentLead";
import { TutorLead as TutorLeadInterface } from "./TutorLead";
import { PaymentMethod } from "./PaymentMethod";
import { Course } from "./Course";
import moment from "moment";

interface Schedule {
  [key: number]: {
    begin: String;
    end: String;
  };
}

export enum STATUS {
  DRAFT = "draft",
  ACCEPTED = "accepted",
  DECLINED = "declined",
  WITHDRAWN = "withdrawn",
}

export interface Offer extends TimestampedEntity {
  course: Course;
  level: string;
  schedule: Schedule;
  rate: number;
  note: string;
  status: STATUS;
  declinedNote: string;
  tutorLead: TutorLeadInterface;
  studentLead: StudentLeadInterface;
  expirationDate: Date;
  contractStartDate: Date;
  contractEndDate: Date;
  completed?: boolean; //has been paid for
  paymentMethod?: PaymentMethod;
  expired: boolean;
}

const schema = new Schema<Offer>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      autopopulate: true,
      required: true,
    },
    level: { type: String, required: true },
    schedule: { type: Schema.Types.Mixed, required: true },
    rate: { type: Number, required: true },
    note: { type: String, required: false, default: "" },
    status: { type: String, enum: STATUS, default: STATUS.DRAFT },
    declinedNote: { type: String, required: false, default: "" },
    tutorLead: {
      type: Schema.Types.ObjectId,
      ref: "TutorLead",
      autopopulate: true,
      required: true,
    },
    studentLead: {
      type: Schema.Types.ObjectId,
      ref: "StudentLead",
      autopopulate: true,
      required: true,
    },
    expirationDate: { type: Date, required: true },
    contractStartDate: { type: Date, required: true },
    contractEndDate: { type: Date, required: true },
    completed: { type: Boolean, required: false },
    paymentMethod: {
      type: Schema.Types.ObjectId,
      ref: "PaymentMethod",
      autopopulate: true,
      required: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

schema.plugin(require("mongoose-autopopulate"));

schema.virtual("amount").get(function () {
  return this.rate * 1;
});

schema.virtual("expired").get(function () {
  return moment().diff(this.expirationDate) >= 0;
});

export default model<Offer>("Offer", schema);
