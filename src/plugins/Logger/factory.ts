export enum Level {
  silent = 0,
  error = 1,
  warn = 2,
  info = 3,
  debug = 4,
  all = 5,
}

export interface IConfig {
  level: Level;
  logConsumers: Array<(message: IMessage) => void>;
}

export interface IMessage {
  level: Level;
  message: any;
  stack: any[];
}

export interface ILogger {
  debug(msg: unknown, stackTrace?: unknown): void;

  info(msg: unknown, stackTrace?: unknown): void;

  warn(msg: unknown, stackTrace?: unknown): void;

  error(msg: unknown, stackTrace?: unknown): void;
}

export interface ILoggerFactory {
  getLogger(config: IConfig): ILogger;
}

export const LoggerFactory: ILoggerFactory = {
  getLogger: (config: IConfig): ILogger => {
    const { level, logConsumers } = config;
    const noop = () => undefined;

    const createLogMethod = (logLevel: Level) => {
      if (level < logLevel) return noop;

      return (msg: unknown, stackTrace?: unknown): void => {
        const message = msg;
        const stack = Array.isArray(stackTrace) ? stackTrace : stackTrace ? [String(stackTrace)] : [];

        logConsumers.forEach(consumer =>
          consumer({
            level: logLevel,
            message,
            stack,
          }),
        );
      };
    };

    return {
      debug: createLogMethod(Level.debug),
      info: createLogMethod(Level.info),
      warn: createLogMethod(Level.warn),
      error: createLogMethod(Level.error),
    };
  },
};
