import React, { ComponentType, memo, useEffect, useState } from 'react';
import type { ReduxModule } from '../types';
import { logger } from '../utils/logger';
import { getComponentName } from '../utils/getComponentName';

/**
 * 记录已加载的模块集合
 */
const loadedModules = new Set<string>();

/**
 * 模块注入包装器选项
 */
interface InjectStoreWrapperOptions {
  /** 是否在组件卸载时销毁模块 */
  destroyOnUnmount?: boolean;
  /** 加载组件 */
  LoadingComponent?: React.ComponentType;
}

/**
 * 创建 InjectStoreWrapper HOC 工厂
 *
 * 使用工厂模式避免直接 import defineModule/destroyModule 导致的循环依赖。
 *
 * @param defineModuleFn 注册模块函数
 * @param destroyModuleFn 销毁模块函数
 */
export const createInjectStoreWrapper = (
  defineModuleFn: (module: ReduxModule) => void,
  destroyModuleFn: (moduleName: string) => void,
) => {
  /**
   * 高阶组件(动态挂载redux)
   * @param module 模块定义
   * @param options 配置选项
   */
  return (module: ReduxModule, options: InjectStoreWrapperOptions = {}) => {
    const moduleId = module.name;

    const { destroyOnUnmount = true, LoadingComponent = () => <div>Loading...</div> } = options;

    // 立即尝试加载模块，如果它尚未加载
    if (!loadedModules.has(moduleId)) {
      try {
        defineModuleFn(module);
        loadedModules.add(moduleId);
      } catch (error) {
        logger.error('预加载模块失败:', error);
      }
    }

    return <P extends object>(WrappedComponent: ComponentType<P>): ComponentType<P> => {
      const InjectedComponent = memo<P>(props => {
        const [ready, setReady] = useState(loadedModules.has(moduleId));

        useEffect(() => {
          if (!loadedModules.has(moduleId)) {
            try {
              defineModuleFn(module);
              loadedModules.add(moduleId);
              setReady(true);
            } catch (error) {
              logger.error('模块注入失败:', error);
            }
          } else if (!ready) {
            setReady(true);
          }

          return () => {
            if (destroyOnUnmount && loadedModules.has(moduleId)) {
              destroyModuleFn(module.name);
              loadedModules.delete(moduleId);
            }
          };
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        return ready ? <WrappedComponent {...props} /> : <LoadingComponent />;
      });

      InjectedComponent.displayName = `InjectStore(${getComponentName(WrappedComponent)})`;

      return InjectedComponent;
    };
  };
};
