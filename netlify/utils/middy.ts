import middy from '@middy/core';
import cors from '@middy/http-cors';
import { connectToDb } from '../database/connection';
import * as firebaseAdmin from 'firebase-admin';
import { initializeApp, getApps } from 'firebase-admin/app';
import serviceAccount from '../serviceAccountKey.json';

const bootstrapPlugin = () => {
    const requestStart = async () => {
        if (!getApps().length) {
            initializeApp({
                // @ts-ignore
                credential: firebaseAdmin.credential.cert(serviceAccount)
            })
        }
        await connectToDb();
    }

    return {
        requestStart
    }
}

export default (handler: any) => middy(handler, bootstrapPlugin()).use(cors({origin: '*'}));