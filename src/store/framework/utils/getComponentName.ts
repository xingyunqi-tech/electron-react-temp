import React from 'react';

/**
 * 获取React组件的名称
 *
 * 按照以下优先级获取：
 * 1. 组件的displayName属性
 * 2. 函数组件的名称或类组件的名称
 * 3. 如果无法获取，返回默认名称
 */
export const getComponentName = (
  Component: React.ComponentType<any> | React.ReactNode,
  defaultName: string = 'UnknownComponent',
): string => {
  if (!Component) {
    return defaultName;
  }

  const WrappedComponent = (Component as any).type || Component;

  if (typeof WrappedComponent === 'object' && WrappedComponent.displayName) {
    return WrappedComponent.displayName;
  }

  if (typeof WrappedComponent === 'function') {
    if (WrappedComponent.displayName) {
      return WrappedComponent.displayName;
    }
    if (WrappedComponent.name) {
      return WrappedComponent.name;
    }
  }

  if (typeof WrappedComponent === 'object' && typeof WrappedComponent.type === 'function') {
    if (WrappedComponent.type.displayName) {
      return WrappedComponent.type.displayName;
    }
    if (WrappedComponent.type.name) {
      return WrappedComponent.type.name;
    }
  }

  if (typeof WrappedComponent === 'string') {
    return WrappedComponent;
  }

  return defaultName;
};
