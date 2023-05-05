import middy from '@middy/core';
import { connectToDb } from '../database/connection';
import { initializeApp, getApps } from 'firebase-admin/app';
import { firebaseConfig } from '../../src/firebase';

const bootstrapPlugin = () => {
    const requestStart = async () => {
        if (!getApps().length) {
            initializeApp(firebaseConfig);
        }
        await connectToDb();
    }

    return {
        requestStart
    }
}

export default (handler: any) => middy(handler, bootstrapPlugin());