// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

// Temporarily disabled to prevent errors
// import * as Sentry from "@sentry/nextjs";

// Only initialize Sentry if we're in a browser environment and have a DSN
// if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
//   try {
//     Sentry.init({
//       dsn: "https://5a167cc587141a1d43a7aa97700d176b@o4508067646930944.ingest.us.sentry.io/4508067656630272",

//       // Add optional integrations for additional features
//       integrations: [
//         Sentry.feedbackIntegration({
//           // Additional SDK configuration goes in here, for example:
//           colorScheme: "dark",
//         }),
//       ],
      

//       // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
//       tracesSampleRate: 1,

//       // Define how likely Replay events are sampled.
//       // This sets the sample rate to be 10%. You may want this to be 100% while
//       // in development and sample at a lower rate in production
//       replaysSessionSampleRate: 0.1,

//       // Define how likely Replay events are sampled when an error occurs.
//       replaysOnErrorSampleRate: 1.0,

//       // Setting this option to true will print useful information to the console while you're setting up Sentry.
//       debug: false,

//       // Add error handling for initialization
//       beforeSend(event, hint) {
//         // Don't send events if there's an error with Sentry itself
//         if (hint.originalException && hint.originalException.message?.includes('sentry')) {
//           return null;
//         }
//         return event;
//       },
//     });
//   } catch (error) {
//     console.warn('Failed to initialize Sentry:', error);
//   }
// }

console.log('Sentry disabled to prevent errors');
