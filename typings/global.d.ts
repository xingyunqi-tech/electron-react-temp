/**
 * 为 TypeScript 编译器提供全局相关的类型定义
 */
declare global {
  interface Window {
    /** Electron preload 暴露的命名 API，Web 环境下为 undefined */
    electronAPI?: ElectronAPI;
  }

  /**
   * Performance
   */
  interface Performance {
    memory: {
      usedJSHeapSize: number;
      totalJSHeapSize: number;
      jsHeapSizeLimit: number;
    };
  }

  /**
   * AudioWorklet
   */
  namespace AudioWorklet {
    interface AudioParamDescriptor {
      name: string;
      defaultValue?: number;
      minValue?: number;
      maxValue?: number;
      automationRate?: 'a-rate' | 'k-rate';
    }
  }
}

export {};
