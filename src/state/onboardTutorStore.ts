import { createStore } from "@udecode/zustood";
import moment from "moment-timezone";
import { Entity, Schedule, Tutor } from "../types";
import { TimestampedEntity } from "../../netlify/types";

type Type = Omit<
  Tutor,
  | keyof Entity
  | keyof TimestampedEntity
  | "courses"
  | "reviewCount"
  | "rating"
  | "reviews"
> & {
  courses: Array<string>;
};

export default createStore("onboardTutorStore")<Type>({
  name: {
    first: "",
    last: "",
  },
  dob: "",
  email: "",
  courses: [],
  schedule: {} as Schedule,
  tz: moment.tz.guess(),
  rate: 0,
  occupation: "",
  highestLevelOfEducation: "",
  cv: "",
  teachLevel: [],
  avatar: "",
  description: "",
});
