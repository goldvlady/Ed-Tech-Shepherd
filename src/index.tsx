import * as Sentry from '@sentry/react';
import mixpanel from 'mixpanel-browser';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Carousel, initTE } from 'tw-elements';

import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';
import './tailwind.css';

initTE({ Carousel });

mixpanel.init('60b6261338f9bed7ca835ca0a2134f4d');

Sentry.init({
  dsn: 'https://a8514e19899d486286187db0ccd2f21d@o4505062795182080.ingest.sentry.io/4505062798852096',
  integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
