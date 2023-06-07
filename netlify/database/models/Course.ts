import { Schema, model } from "mongoose";
import { Entity } from "../../types";

export interface Course extends Entity {
  label: string;
  imageSrc?: string;
  iconSrc?: string;
}

const schema = new Schema<Course>({
  label: { type: String, required: true },
  imageSrc: { type: String, required: false },
  iconSrc: { type: String, required: false },
});

export default model<Course>("Course", schema);
