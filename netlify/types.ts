import { APIGatewayProxyEvent } from 'aws-lambda';

export interface TimestampedEntity {
    createdAt: Date;
    updateAt: Date;
}

export interface FirebaseUser {
    name: string;
    user_id: string;
    email: string;
    email_verified: boolean;
}

export interface HTTPEvent extends APIGatewayProxyEvent {
    firebaseUser: FirebaseUser
}