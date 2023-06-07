import { APIGatewayProxyEvent } from "aws-lambda";
import { User } from "./database/models/User";

export type Entity = {
  _id: string;
};

export interface TimestampedEntity extends Entity {
  createdAt: Date;
  updatedAt: Date;
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
