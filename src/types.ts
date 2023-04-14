import { Moment } from "moment";
import { TutorLead } from "../netlify/functions/database/models/TutorLead"
import { StudentLead } from "../netlify/functions/database/models/StudentLead"
import { Booking as BookingType } from "../netlify/functions/database/models/Booking"

export type Entity = {
    _id: string;
}

export type Schedule = {
    begin: Date;
    end: Date;
}

export type Slot = {
    begin: string;
    end: string;
}

export type Course = {
    title: string;
    id: string;
    image: string;
};

export type Student = StudentLead;

export type Tutor = TutorLead;

export type Booking = BookingType;