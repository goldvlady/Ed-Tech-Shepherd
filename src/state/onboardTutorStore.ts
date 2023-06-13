import { createStore } from "@udecode/zustood";
import moment from "moment-timezone";
import {
  Entity,
  Schedule,
  Tutor,
  TutorQualification,
  TutorCourseAndLevel,
  TutorBankInfo,
} from "../types";
import { TimestampedEntity } from "../../netlify/types";

type Type = Omit<Tutor, keyof Entity | keyof TimestampedEntity | "courses"> & {
  courses: Array<string>;
};

export default createStore("onboardTutorStore")<
  Omit<Tutor, keyof Entity | keyof TimestampedEntity>
>({
  name: {
    first: "",
    last: "",
  },
  dob: "",
  email: "",
  coursesAndLevels: [] as TutorCourseAndLevel[],
  schedule: {} as Schedule,
  tz: moment.tz.guess(),
  qualifications: [] as TutorQualification[],
  rate: 0,
  cv: "",
  bankInfo: {} as TutorBankInfo,
  avatar: "",
  reviewCount: 0,
  rating: 0,
  description: "",
  country: "",
  identityDocument: "",
  introVideo: "",
});
