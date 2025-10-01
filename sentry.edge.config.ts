import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  // Edge runtime has limited features; keep minimal
  tracesSampleRate: 0.05,
  environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV,
})