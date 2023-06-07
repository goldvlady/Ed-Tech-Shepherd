import { Schema, model } from "mongoose";
import { User } from "./User";
import { TimestampedEntity } from "../../types";

export interface PaymentMethod extends TimestampedEntity {
  stripeId: string;
  expMonth: number;
  expYear: number;
  last4: string;
  country: string;
  brand:
    | "amex"
    | "diners"
    | "discover"
    | "eftpos_au"
    | "jcb"
    | "mastercard"
    | "unionpay"
    | "visa"
    | "unknown";
  user: User;
}

const schema = new Schema<PaymentMethod>(
  {
    stripeId: { type: String, unique: true, required: false },
    expMonth: { type: Number, required: true },
    expYear: { type: Number, required: true },
    last4: { type: String, required: true },
    country: { type: String, required: true },
    brand: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

schema.plugin(require("mongoose-autopopulate"));

export default model<PaymentMethod>("PaymentMethod", schema);
