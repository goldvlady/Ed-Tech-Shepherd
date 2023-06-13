import { Booking as BookingType } from '../netlify/database/models/Booking';
import { BookmarkedTutor as BookmarkedTutorType } from '../netlify/database/models/BookmarkedTutor';
import { Course as CourseType } from '../netlify/database/models/Course';
import { Offer as OfferType } from '../netlify/database/models/Offer';
import { StudentLead } from '../netlify/database/models/StudentLead';
import { TutorLead } from '../netlify/database/models/TutorLead';
import { Level } from '../netlify/database/models//Level';
import { User as UserType } from '../netlify/database/models/User';

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

export interface TutorQualification {
  institution: string;
  degree: string;
  startDate: Date;
  endDate: Date;
}

export interface TutorBankInfo {
  accountName: string;
  accountNumber: string;
  bankName: string;
}

export interface TutorCourseAndLevel {
  course: CourseType;
  level: Level;
}


export interface TutorBankInfo {
  accountName: string;
  accountNumber: string;
  bankName: string;
}

export interface Country {
  name: string
}
export type LevelType = Level
export type Student = StudentLead;
export type Tutor = TutorLead;
export type Booking = BookingType;
export type User = UserType;
export type Offer = OfferType;
export type BookmarkedTutor = BookmarkedTutorType;
export type Course = CourseType