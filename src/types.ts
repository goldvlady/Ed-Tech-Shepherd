import { APIGatewayProxyEvent } from 'aws-lambda';

export type Entity = {
  _id: string;
};

export interface TimestampedEntity extends Entity {
  createdAt: Date;
  updatedAt: Date;
}

export type Rating = 1 | 2 | 3 | 4 | 5;

type Attributes = Record<'offerId', object>;

export enum STATUS {
  UNCONFIRMED = 'unconfirmed',
  CONFIRMED = 'confirmed',
  CANCELED = 'cenceled',
  DRAFT = 'draft',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  WITHDRAWN = 'withdrawn'
}

export interface Level extends Entity {
  label: string;
}

export interface SkillLevel {
  course: string;
  skillLevel: string;
}

export interface TutorBankInfo {
  accountName: string;
  accountNumber: string;
  bankName: string;
  swiftCode?: string;
}

export interface TutorQualification {
  institution: string;
  degree: string;
  startDate: Date;
  endDate: Date;
  transcript?: string;
}

export interface Country {
  name: string;
}

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

export interface PaymentMethod extends TimestampedEntity {
  stripeId: string;
  expMonth: number;
  expYear: number;
  last4: string;
  country: string;
  brand:
    | 'amex'
    | 'diners'
    | 'discover'
    | 'eftpos_au'
    | 'jcb'
    | 'mastercard'
    | 'unionpay'
    | 'visa'
    | 'unknown';
  user: User;
}

export type MinimizedStudy = {
  flashcardId: string;
  data: {
    currentStudyIndex: number;
    studyType: 'manual' | 'timed';
    isStarted: boolean;
    isFinished: boolean;
    progressWidth: string;
    studies: Study[];
    cardStyle: 'flippable' | 'default';
    timer: number;
    savedScore: Score;
    studyState: 'question' | 'answer';
  };
};

export enum UserNotificationTypes {
  LESSON_SESSION_STARTED = 'lesson_session_started',
  NEW_OFFER_RECEIVED = 'new_offer_received',
  OFFER_WITHDRAWN = 'offer_withdrawn'
}

export interface User extends TimestampedEntity {
  name: {
    first: string;
    last: string;
  };
  email: string;
  firebaseId: string;
  avatar?: string;
  dob: string;
  tutor?: Tutor;
  student?: Student;
  isVerified: boolean;
  type: any;
  stripeCustomerId?: string;
  paymentMethods: PaymentMethod[];
}

export interface Student extends TimestampedEntity {
  name: {
    first: string;
    last: string;
  };
  email: string;
  parentOrStudent: string;
  dob: string;
  courses: Array<Course> | Array<string>;
  gradeLevel?: string;
  somethingElse?: string;
  topic?: string;
  skillLevels?: SkillLevel[];
  schedule: Schedule;
  tz: string;
  pipedriveDealId?: string;
}

export interface Tutor extends TimestampedEntity {
  coursesAndLevels: Array<TutorCourseAndLevel>;
  schedule: Schedule;
  rate: number;
  active?: boolean;
  description?: string;
  avatar?: string;
  cv: string;
  tz: string;
  identityDocument?: string;
  introVideo?: string;
  qualifications?: Array<TutorQualification>;
  country?: string;
  bankInfo?: TutorBankInfo;

  pipedriveDealId?: string;

  // virtuals
  reviewCount: number;
  rating: number;
  user: User;
}

export interface Course extends Entity {
  label: string;
  imageSrc?: string;
  iconSrc?: string;
}

export interface TutorCourseAndLevel {
  course: Course;
  level: Level;
}

export interface Offer extends TimestampedEntity {
  course: Course;
  level: Level;
  schedule: SingleSchedule;
  _id: string;
  rate: number;
  note: string;
  status: STATUS;
  declinedNote: string;
  tutor: Tutor;
  student: Student;
  expirationDate: Date;
  contractStartDate: Date;
  contractEndDate: Date;
  completed?: boolean;
  paymentMethod?: PaymentMethod;
  expired: boolean;
}

export interface BookmarkedTutor extends TimestampedEntity {
  user: User;
  tutor: Tutor;
}

export interface Booking extends TimestampedEntity {
  stripeReference?: string;
  amountPaid?: number;
  status: STATUS;
  conferenceHostRoomUrl?: string;
  conferenceRoomUrl?: string;
  startDate: Date;
  endDate: Date;
  offer: Offer;
}

export interface UserNotifications {
  _id: string;
  text: string;
  type: UserNotificationTypes;
  createdAt?: Date;
  __v?: number;
}

export interface FirebaseUser {
  name: string;
  user_id: string;
  email: string;
  email_verified: boolean;
}

export interface HTTPEvent extends APIGatewayProxyEvent {
  firebaseUser: FirebaseUser;
  user: User;
}

export interface Score {
  score: number;
  passed: number;
  failed: number;
  notRemembered: number;
  date: string;
}

export interface FlashcardData {
  _id: string;
  student: Student;
  deckname: string;
  studyType: 'longTermRetention' | 'quickPractice';
  subject?: string;
  tags: string[];
  topic?: string;
  scores: Score[];
  studyPeriod: 'daily' | 'weekly' | 'biweekly' | 'spacedRepetition';
  questions: FlashcardQuestion[];
  createdAt: string;
  updatedAt: string;
  currentStudy?: MinimizedStudy;
}

export interface FlashcardQuestion {
  questionType: string;
  question: string;
  options?: string[];
  helperText?: string;
  explanation?: string;
  answer: string;
  numberOfAttempts: number;
  currentStep: number;
  totalSteps: number;
}

export interface Options {
  type: 'single' | 'multiple';
  content: string[];
}

export interface Study {
  id: number;
  type: 'timed' | 'manual';
  questions: string;
  helperText?: string;
  explanation?: string;
  answers: string | string[];
  currentStep: number;
  isFirstAttempt: boolean;
  options?: Options;
}

export enum SessionType {
  QUIZ = 'quiz',
  FLASHCARD = 'flashcard',
  NOTES = 'notes',
  DOCCHAT = 'docchat',
  HOMEWORK = 'homework'
}

export interface SchedulePayload {
  entityId: string;
  entityType: string;
  startDates: string[];
  startTime: string;
  recurrence?: {
    frequency: string;
  };
}

export interface StudentDocumentPayload {
  title?: string;
  course?: string;
  documentUrl?: string;
  tags?: string[];
}

export type LevelType = Level;
export type BookingType = Booking;
export type OfferType = Offer;
export type BookmarkedTutorType = BookmarkedTutor;
export type CourseType = Course;
export type UserType = User;
