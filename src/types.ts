import { TutorLead } from "../netlify/database/models/TutorLead";
import { StudentLead } from "../netlify/database/models/StudentLead";
import { Booking as BookingType } from "../netlify/database/models/Booking";
import { User as UserType } from "../netlify/database/models/User";
import { Offer as OfferType } from "../netlify/database/models/Offer";
import { Course as CourseType } from "../netlify/database/models/Course";

export type Entity = {
  _id: string;
};

export type TimeSchedule = {
  begin: string;
  end: string;
};

export type SingleSchedule = {
  [key: number]: TimeSchedule;
};

export type Schedule = {
  [key: number]: TimeSchedule[];
};

export type Slot = {
  begin: string;
  end: string;
};

export type Course = CourseType;
export type Student = StudentLead;
export type Tutor = TutorLead;
export type Booking = BookingType;
export type User = UserType;
export type Offer = OfferType;
