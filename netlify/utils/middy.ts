import middy from "@middy/core";
import { connectToDb } from "../database/connection";
import * as firebaseAdmin from "firebase-admin";
import { initializeApp, getApps } from "firebase-admin/app";
import serviceAccount from "../serviceAccountKey.json";
import sentryMiddleware from "../middlewares/sentryMiddleware";
import corsMiddleware from "../middlewares/corsMiddleware";

const bootstrapPlugin = () => {
  const requestStart = async () => {
    // initialize Firebase
    if (!getApps().length) {
      initializeApp({
        // @ts-ignore
        credential: firebaseAdmin.credential.cert(serviceAccount),
      });
    }

    // connect to MongoDB
    await connectToDb();
  };

  return {
    requestStart,
  };
};

export default (handler: any) =>
  middy(handler, bootstrapPlugin())
    .use(
      sentryMiddleware({
        dsn: "https://ac7054d1ea7d4a81adc52cf58774dcab@o4505062795182080.ingest.sentry.io/4505251993354240",
      })
    )
    .use(
      corsMiddleware({
        disableBeforePreflightResponse: false,
        origin: "*",
        requestHeaders: "*",
        requestMethods: "*",
        headers: "*",
        methods: "*",
      })
    );
