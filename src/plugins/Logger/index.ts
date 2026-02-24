import { IMessage, Level, LoggerFactory } from './factory';

/**
 * 通用异步操作处理函数，封装 try-catch 逻辑
 * @param asyncFn 需要执行的异步函数
 * @param errorHandler 自定义错误处理函数，默认使用 Logger.error
 * @returns 异步函数的执行结果，如果出错则返回 undefined
 */
export const handleAsyncAction = async <T>(
  asyncFn: () => Promise<T>,
  errorHandler: (error: any) => void = Logger.error,
): Promise<T | undefined> => {
  try {
    return await asyncFn();
  } catch (error) {
    errorHandler(error);
    return undefined;
  }
};

/**
 * 控制台日志消费者
 */
const consoleLogConsumer = (msg: IMessage) => {
  const { level, message, stack } = msg;

  switch (level) {
    case Level.debug:
      console.debug(message, stack);
      break;
    case Level.info:
      console.info(message, stack);
      break;
    case Level.warn:
      console.warn(message, stack);
      break;
    case Level.error:
      console.error(message, stack);
      break;
    default:
      console.info(message, stack);
  }
};

/**
 * 日志实例
 */
const Logger = LoggerFactory.getLogger({
  level: import.meta.env.PROD ? Level.warn : Level.all,
  logConsumers: [consoleLogConsumer],
});

export default Logger;
