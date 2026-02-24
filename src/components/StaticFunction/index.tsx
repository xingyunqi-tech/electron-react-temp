import { App } from 'antd';
import type { MessageInstance } from 'antd/es/message/interface';
import type { ModalStaticFunctions } from 'antd/es/modal/confirm';
import type { NotificationInstance } from 'antd/es/notification/interface';

let message: MessageInstance;
let notification: NotificationInstance;
let modal: Omit<ModalStaticFunctions, 'warn'>;

// 渲染前的安全代理：调用时打印警告而非直接崩溃
const createSafeProxy = <T extends object>(name: string): T =>
  new Proxy({} as T, {
    get(_, prop) {
      if (typeof prop === 'string') {
        return (...args: unknown[]) => {
          console.warn(`[StaticFunction] ${name}.${prop}() called before render, args:`, args);
        };
      }
    },
  });

message = createSafeProxy<MessageInstance>('message');
notification = createSafeProxy<NotificationInstance>('notification');
modal = createSafeProxy<Omit<ModalStaticFunctions, 'warn'>>('modal');

/**
 * antd的静态方法包装(可消费上下文)
 */
const StaticFunction = () => {
  const staticFunction = App.useApp();
  message = staticFunction.message;
  modal = staticFunction.modal;
  notification = staticFunction.notification;
  return null;
};

export default StaticFunction;

/**
 * 显示加载消息，操作完成后显示成功消息
 * @param loadingText 加载时显示的文本
 * @param successText 成功时显示的文本
 * @param duration 成功消息显示时长，默认为 3 秒
 */
export const loadingThenSuccess = (loadingText: string, successText: string, duration?: number) => {
  message.destroy();
  message.loading(loadingText, 0);
  return {
    success: () => {
      message.destroy();
      message.success(successText, duration);
    },
    error: (errorText: string) => {
      message.destroy();
      message.error(errorText, duration);
    },
  };
};

export { message, notification, modal };
