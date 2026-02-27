import { BroadcastChannel } from 'broadcast-channel';
import { debounce, put } from 'redux-saga/effects';
import { createAction } from '@reduxjs/toolkit';
import type { ReduxSagaModule } from '../../types';

// 定义Middleware类型
type Middleware = (store: any) => (next: any) => (action: any) => any;

// 生成UUID
const generateUuid = (): string => {
  // cspell:disable-next-line
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * 跨标签页通信事件类型枚举
 */
export enum CrossTabEventType {
  /** 发送消息到目标标签页 */
  POST = 'post',
  /** 确认接收消息 */
  ACK = 'ack',
  /** 新标签页加入通知 */
  HELLO = 'hello',
  /** 心跳检测 */
  HEARTBEAT = 'heartbeat',
  /** 标签页关闭通知 */
  CLOSE = 'close',
}

/**
 * 跨标签页通信模块接口
 */
export interface ICrossTabModule extends ReduxSagaModule {
  /** 中间件数组 */
  middleware: Middleware[];

  actions: {
    /** 发送消息到目标标签页 */
    postAction: any;
  };

  selectors: {
    /** 获取当前标签页的ID */
    getCurrentTabId: () => string;
    /** 获取所有活跃标签页的ID列表 */
    getAllTabIds: () => string[];
  };
}

/**
 * 跨标签页通信模块上下文配置
 */
export interface ICrossTabModuleContext {
  /** 模块名称 */
  name: string;
  /** 当前标签页的唯一标识符 */
  tabId?: string;
  /** 心跳检测间隔(毫秒) @default 30000 */
  heartbeatInterval?: number;
  /** 心跳超时时间(毫秒) @default 5000 */
  heartbeatTimeout?: number;
  /** BroadcastChannel的选项配置 */
  broadcastChannelOptions?: ConstructorParameters<typeof BroadcastChannel>[1];
  /** 向后兼容，支持selfId参数 */
  selfId?: string;
}

/**
 * 跨标签页通信消息格式
 */
interface CrossTabMessage {
  type: CrossTabEventType;
  from: string;
  to: string;
  payload?: unknown;
}

/**
 * 创建跨标签页通信模块
 *
 * @param context 模块上下文配置
 * @returns 跨标签页通信模块实例
 */
export const createCrossTabModule = (context: ICrossTabModuleContext): ICrossTabModule => {
  const {
    name,
    tabId = generateUuid(),
    heartbeatInterval = 30000,
    heartbeatTimeout = 5000,
    broadcastChannelOptions = { webWorkerSupport: false },
    selfId,
  } = context;

  const actualTabId = selfId || tabId;

  // 内部状态
  const tabIds = new Set<string>([actualTabId]);
  const heartbeatTimeouts: Record<string, ReturnType<typeof setTimeout>> = {};

  let channel: BroadcastChannel | null = null;
  let storeRef: any = null;
  let beforeUnloadHandler: (() => void) | null = null;

  // 创建动作（RTK 原生 createAction）
  const postAction = createAction<
    | { targetId: string; message: unknown }
    | { targets: string[]; action: { type: string; [key: string]: unknown }; sourceId: string }
  >(`${name}/post`);

  const internalPostAction = createAction<CrossTabMessage>(`${name}/internal/post`);
  const receiveAction = createAction<CrossTabMessage>(`${name}/receive`);
  const heartbeatAction = createAction(`${name}/heartbeat`);

  /**
   * 发送消息到通道
   */
  const sendToChannel = (message: CrossTabMessage): boolean => {
    if (!channel || !channel.postMessage) return false;

    try {
      channel.postMessage(message);
      return true;
    } catch (err) {
      console.error(`Error sending ${message.type} message:`, err);
      return false;
    }
  };

  /**
   * 清理不活跃的标签页
   */
  const cleanupTab = (inactiveTabId: string) => {
    if (heartbeatTimeouts[inactiveTabId]) {
      clearTimeout(heartbeatTimeouts[inactiveTabId]);
      delete heartbeatTimeouts[inactiveTabId];
    }
    tabIds.delete(inactiveTabId);
  };

  /**
   * 发送心跳消息到所有标签页
   */
  function* sendHeartbeat() {
    for (const id of tabIds) {
      if (id !== actualTabId) {
        yield put(
          internalPostAction({
            type: CrossTabEventType.HEARTBEAT,
            from: actualTabId,
            to: id,
          }),
        );

        heartbeatTimeouts[id] = setTimeout(() => cleanupTab(id), heartbeatTimeout);
      }
    }
  }

  /**
   * 处理接收到的消息
   */
  const handleIncomingMessage = (message: CrossTabMessage): { type: string; [key: string]: unknown } | null => {
    if (!message || !message.type) return null;

    if (message.type !== CrossTabEventType.CLOSE) {
      tabIds.add(message.from);
    }

    switch (message.type) {
      case CrossTabEventType.POST:
        sendToChannel({
          type: CrossTabEventType.ACK,
          from: actualTabId,
          to: message.from,
          payload: message.payload,
        });

        if (message.payload && typeof message.payload === 'object' && 'type' in message.payload) {
          return message.payload as { type: string; [key: string]: unknown };
        }

        return receiveAction(message);

      case CrossTabEventType.HELLO:
        if (message.to === '*') {
          sendToChannel({
            type: CrossTabEventType.HELLO,
            from: actualTabId,
            to: message.from,
          });
        }
        break;

      case CrossTabEventType.HEARTBEAT:
        if (heartbeatTimeouts[message.from]) {
          clearTimeout(heartbeatTimeouts[message.from]);
          delete heartbeatTimeouts[message.from];
        }

        sendToChannel({
          type: CrossTabEventType.HEARTBEAT,
          from: actualTabId,
          to: message.from,
        });
        break;

      case CrossTabEventType.CLOSE:
        cleanupTab(message.from);
        break;
    }

    return null;
  };

  /**
   * 初始化广播通道
   */
  const initializeChannel = (): boolean => {
    if (channel || typeof window === 'undefined') return !!channel;

    try {
      channel = new BroadcastChannel(name, broadcastChannelOptions);

      channel.onmessage = event => {
        const message = typeof event === 'object' && event !== null ? ('data' in event ? event.data : event) : event;

        if (
          message &&
          typeof message === 'object' &&
          'type' in message &&
          'from' in message &&
          'to' in message &&
          (message.to === actualTabId || message.to === '*') &&
          message.from !== actualTabId
        ) {
          const action = handleIncomingMessage(message as CrossTabMessage);
          if (action && storeRef) {
            storeRef.dispatch(action);
          }
        }
      };

      if (typeof window !== 'undefined') {
        // 移除之前可能注册的监听器（防止重复注册）
        if (beforeUnloadHandler) {
          window.removeEventListener('beforeunload', beforeUnloadHandler);
        }

        beforeUnloadHandler = () => {
          if (channel) {
            sendToChannel({
              type: CrossTabEventType.CLOSE,
              from: actualTabId,
              to: '*',
            });
            channel.close();
            channel = null;
          }
          if (beforeUnloadHandler) {
            window.removeEventListener('beforeunload', beforeUnloadHandler);
            beforeUnloadHandler = null;
          }
        };

        window.addEventListener('beforeunload', beforeUnloadHandler);
      }

      return true;
    } catch (err) {
      console.error('Failed to initialize BroadcastChannel:', err);
      return false;
    }
  };

  /**
   * 模块的主saga
   */
  function* saga() {
    const isChannelReady = initializeChannel();

    if (isChannelReady) {
      yield put(
        internalPostAction({
          type: CrossTabEventType.HELLO,
          from: actualTabId,
          to: '*',
        }),
      );

      yield put(heartbeatAction());
      yield debounce(heartbeatInterval, heartbeatAction.match, sendHeartbeat);
    }
  }

  /**
   * 创建处理发送消息的中间件
   */
  const createMiddlewareFn = (): Middleware => store => {
    storeRef = store;
    initializeChannel();

    return next => action => {
      const result = next(action);

      if (internalPostAction.match(action)) {
        const message = action.payload;
        if (!channel) initializeChannel();
        sendToChannel(message);
      } else if (postAction.match(action)) {
        const payload = action.payload;

        if ('targetId' in payload && 'message' in payload) {
          const { targetId, message } = payload;
          store.dispatch(
            internalPostAction({
              type: CrossTabEventType.POST,
              from: actualTabId,
              to: targetId,
              payload: message,
            }),
          );
        } else if ('targets' in payload && 'action' in payload && 'sourceId' in payload) {
          const { targets, action: innerAction, sourceId } = payload;

          if (sourceId === actualTabId) {
            for (const target of targets) {
              store.dispatch(
                internalPostAction({
                  type: CrossTabEventType.POST,
                  from: actualTabId,
                  to: target,
                  payload: innerAction,
                }),
              );
            }

            if (innerAction && typeof innerAction === 'object' && 'type' in innerAction) {
              store.dispatch(innerAction);
            }
          }
        }
      }

      return result;
    };
  };

  return {
    name,
    saga,
    middleware: [createMiddlewareFn()],
    reducer: (state = {}) => state,
    actions: {
      postAction,
    },
    selectors: {
      getCurrentTabId: () => actualTabId,
      getAllTabIds: () => Array.from(tabIds),
    },
  };
};
