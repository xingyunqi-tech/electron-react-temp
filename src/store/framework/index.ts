// Core
export {
  createReduxFramework,
  createReducerManager,
  defineModule,
  destroyModule,
  createSagaTaskRegistry,
} from './core';
export type { SagaTaskRegistry } from './core';
export type { ReduxFrameworkResult } from './core';

// Plugins
export {
  createPersistPlugin,
  persistIgnoredActions,
  createLoopPlugin,
  appStorage,
  startLoopAction,
  stopLoopAction,
  stopAllLoopsAction,
} from './plugins';
export type { PersistPluginOptions } from './plugins';

// Hooks
export { useReduxDispatch, useReduxSelector, useReduxCall, useReduxStore } from './hooks';

// Components
export { ReduxProvider, createInjectStoreWrapper } from './components';
export type { ReduxProviderProps } from './components';

// Utils
export {
  logger,
  loopWorker,
  createLoopTask,
  defineSelector,
  DefaultRootSelectorFactory,
  doEffect,
  filter,
  map,
  reduce,
  skip,
  take,
} from './utils';
export type { LoopWorkerOptions, LoopTask, Selector, IDefinedSelector, SR, SagaEffectSubject } from './utils';

// Modules (predefined module patterns)
export { createKeyValueModule } from './modules';
export type { IKeyValueModule, IKeyValueModuleContext } from './modules';
export { createResourceModule } from './modules';
export type { IResourceModule, IResourceModuleContext } from './modules';
export { createPersistedKeyValueModule } from './modules';
export type { IPersistedKeyValueModule, IPersistedKeyValueModuleContext, IPersistedStorageItem } from './modules';
export { createCrossTabModule, CrossTabEventType } from './modules';
export type { ICrossTabModule, ICrossTabModuleContext } from './modules';
export { createMultiSourceModule, MultiSourceFetcherStatus, DEFAULT_FETCHER_STATUS } from './modules';
export type { IMultiSourceModule, IMultiSourceModuleContext, IMultiSourceFetcherStatusValuesType } from './modules';

// Types
export type {
  ReducerManager,
  ReduxModule,
  ReduxSagaModule,
  ReduxPlugin,
  PluginContext,
  PluginManager,
  ReduxFrameworkOptions,
} from './types';
