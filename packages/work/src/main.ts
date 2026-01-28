import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './style.css';

import { createHead } from '@unhead/vue/client';
import * as Sentry from '@sentry/vue';

const app = createApp(App);
const head = createHead();

// Sentry Initialization - only in production with valid DSN
const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
if (sentryDsn && import.meta.env.PROD) {
  Sentry.init({
    app,
    dsn: sentryDsn,
    environment: import.meta.env.MODE,
    release: `bude-work@${import.meta.env.VITE_APP_VERSION || '1.0.0'}`,
    integrations: [
      Sentry.browserTracingIntegration({ router }),
      Sentry.replayIntegration(),
    ],
    // Performance Monitoring - sample 10% of transactions in production
    tracesSampleRate: 0.1,
    // Session Replay - capture 10% of sessions, 100% on error
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    // Filter out noisy errors
    ignoreErrors: [
      'Network request failed',
      'Failed to fetch',
      'Load failed',
      'ChunkLoadError',
    ],
  });
}

app.use(createPinia());
app.use(router);
app.use(head);

app.mount('#app');
