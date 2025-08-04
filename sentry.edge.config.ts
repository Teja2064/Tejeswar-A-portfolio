// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

// Only initialize Sentry in production
if (process.env.NODE_ENV === 'production') {
  try {
    Sentry.init({
      dsn: "https://5a167cc587141a1d43a7aa97700d176b@o4508067646930944.ingest.us.sentry.io/4508067656630272",

      // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
      tracesSampleRate: 1,

      // Setting this option to true will print useful information to the console while you're setting up Sentry.
      debug: false,

      // Add error handling for initialization
      beforeSend(event, hint) {
        // Don't send events if there's an error with Sentry itself
        if (hint.originalException && hint.originalException.message?.includes('sentry')) {
          return null;
        }
        return event;
      },
    });
  } catch (error) {
    console.warn('Failed to initialize Sentry edge config:', error);
  }
}
