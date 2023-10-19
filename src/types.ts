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

export interface StreamToken {
  token: string;
  type: 'student' | 'tutor';
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
  isTutor?: boolean;
  type: any;
  stripeCustomerId?: string;
  signedUpAsTutor?: string;
  paymentMethods: PaymentMethod[];
  streamTokens?: StreamToken[];
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
  isActive: boolean;
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
  scheduleTz: string;
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

export type SearchQueryParams = {
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
  tags?: string;
  type?: string;
};

export type Pagination = {
  page: number;
  limit: number;
  count: number;
};

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
  numberOfAttempts: number;
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
    endDate?: string;
  };
}

export interface StudentDocumentPayload {
  title?: string;
  course?: string;
  documentUrl?: string;
  tags?: string[];
  ingestId?: string;
}

export type LevelType = Level;
export type BookingType = Booking;
export type OfferType = Offer;
export type BookmarkedTutorType = BookmarkedTutor;
export type CourseType = Course;
export type UserType = User;

export interface NoteServerResponse<T = any> {
  message: string;
  error?: any;
  stack?: any;
  data?: T;
}

export type NoteUser = User;

export interface NoteDetails {
  user: NoteUser;
  topic: string;
  note: string;
  tags: Array<string>;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  documentId?: string;
  documentDetails: NoteDocumentDetails;
  [propName: string]: any;
}

export interface NoteDocumentDetails {
  title: string;
  id: number;
  documentId: string;
  reference: string;
  summary: any;
  documentURL?: string;
  updatedAt: Date;
  createdAt: Date;
}
export interface AllNoteDetails {
  user: NoteUser;
  topic: string;
  title?: string;
  note: string;
  tags: Array<string>;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  [propName: string]: any;
  documentURL?: any;
}

export interface PinnedNoteDetails {
  user: NoteUser;
  topic: string;
  note: string;
  tags: Array<string>;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  [propName: string]: any;
}

export interface NoteFilter {
  user: NoteUser;
  topic: string;
  note: string;
  tags: Array<string>;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  [propName: string]: any;
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

export enum NoteEnums {
  PINNED_NOTE_STORE_ID = 'pinned_notes'
}

export type WorkerCallback = (...args: any) => any;

export type WorkerProcess = (...args: any) => any;

export interface AIServiceResponse {
  message: string;
  data: any;
}

export enum NoteStatus {
  DRAFT = 'draft',
  SAVED = 'saved'
}

export interface NoteData {
  note: any;
  topic: string;
  documentId?: string;
  tags?: Array<string>;
  status?: NoteStatus;
}

export interface StudentDocument {
  title: string;
  course?: string;
  _id: string;
  documentUrl: string;
  updatedAt: string;
  createdAt: string;
  tags: string[];
  ingestId?: string;
  student: any; // Assuming this is the ObjectId of the student
}

export interface QuizQuestion {
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

export interface QuizData {
  _id: string;
  student: Student;
  quizname: string;
  studyType: 'timedSession' | 'untimedSession';
  subject?: string;
  topic?: string;
  scores: Score[];
  studyPeriod: 'daily' | 'weekly' | 'biweekly' | 'spacedRepetition';
  questions: QuizQuestion[];
  createdAt: string;
  updatedAt: string;
  currentStudy?: MinimizedStudy;
}
