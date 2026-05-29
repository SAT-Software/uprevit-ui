import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://09132c7199c00eb0563d8201a1d3f83e@o4511468020498432.ingest.us.sentry.io/4511468028035072",
  integrations: [
    Sentry.feedbackIntegration({
      colorScheme: "system",
      isNameRequired: true,
      isEmailRequired: true,
      enableScreenshot: true,
      autoInject: false,
      submitButtonLabel: "Submit Feedback",
      messagePlaceholder: "Enter your feedback here...",
      successMessageText: "Thank you for your feedback!",
      useSentryUser: {
        email: "email",
        name: "name",
      },
      themeLight: {
        accentBackground: "rgb(127, 34, 254)",
        accentForeground: "rgb(255, 255, 255)",
      },
      themeDark: {
        accentBackground: "rgb(126, 66, 210)",
        accentForeground: "rgb(255, 255, 255)",
      },
    }),
  ],
  tracesSampleRate: 0.1,
  enableLogs: true,
  sendDefaultPii: true,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
