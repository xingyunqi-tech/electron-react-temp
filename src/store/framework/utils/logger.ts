const PREFIX = '[redux-framework]';

export const logger = {
  info(...args: any[]) {
    if (import.meta.env.DEV) {
      console.log(PREFIX, ...args);
    }
  },
  warn(...args: any[]) {
    console.warn(PREFIX, ...args);
  },
  error(...args: any[]) {
    console.error(PREFIX, ...args);
  },
};
