import { createElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import {
  appStorage,
  createReduxFramework,
  createPersistPlugin,
  persistIgnoredActions,
  createLoopPlugin,
  createInjectStoreWrapper,
  defineModule as frameworkDefineModule,
  destroyModule as frameworkDestroyModule,
  createSagaTaskRegistry,
} from './framework';
import type { ReduxModule } from './framework';
import { LayoutSkeleton } from '@/components/Skeleton';
import globalReducer from './modules/global';
import userReducer from './modules/user';
import permissionReducer from './modules/permission';

// 创建 Redux Framework
const loopPlugin = createLoopPlugin();

const { store, reducerManager, pluginManager } = createReduxFramework({
  initialReducers: {
    global: globalReducer,
    user: userReducer,
    permission: permissionReducer,
  },
  devTools: import.meta.env.DEV,
  middlewareCallback: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [...persistIgnoredActions],
      },
    }),
  plugins: [
    createPersistPlugin({
      key: 'root',
      storage: appStorage,
      whitelist: ['global', 'user'],
      loading: createElement(LayoutSkeleton),
    }),
    loopPlugin,
  ],
});

// 获取 sagaMiddleware 供动态模块注入 saga
const { sagaMiddleware } = loopPlugin;
// 每个 store 实例独立的 saga 任务注册表
const sagaTasks = createSagaTaskRegistry();

export { store };
export const reduxContext = { store, reducerManager, pluginManager };

/** 动态模块注册 */
export function defineModule(module: ReduxModule) {
  frameworkDefineModule(store, reducerManager, module, sagaMiddleware, sagaTasks);
}

/** 动态模块销毁 */
export function destroyModule(moduleName: string) {
  frameworkDestroyModule(store, reducerManager, moduleName, sagaTasks);
}

// InjectStoreWrapper HOC（工厂模式，避免循环依赖）
export const InjectStoreWrapper = createInjectStoreWrapper(defineModule, destroyModule);

// Typed hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ThunkDispatch<RootState, unknown, UnknownAction>;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
