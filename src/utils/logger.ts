type LogLevel = 'debug' | 'info' | 'warn' | 'error';

function log(level: LogLevel, message: string, meta?: unknown) {
  if (level === 'debug' && !__DEV__) return;

  const payload = meta !== undefined ? [message, meta] : [message];

  switch (level) {
    case 'debug':
    case 'info':
      console.log(`[${level.toUpperCase()}]`, ...payload);
      break;
    case 'warn':
      console.warn(`[WARN]`, ...payload);
      break;
    case 'error':
      console.error(`[ERROR]`, ...payload);
      break;
  }

  // Production hook point: send `warn`/`error` to Sentry/Crashlytics here.
  // Kept as a single call site so swapping crash reporting later touches only this file.
}

export const logger = {
  debug: (message: string, meta?: unknown) => log('debug', message, meta),
  info: (message: string, meta?: unknown) => log('info', message, meta),
  warn: (message: string, meta?: unknown) => log('warn', message, meta),
  error: (message: string, meta?: unknown) => log('error', message, meta),
};
