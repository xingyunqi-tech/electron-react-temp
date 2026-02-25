import { useMemo } from 'react';
import { useAppSelector } from '@/store';
import { frontendConfigSelector } from '@/store/modules/global';
import { mergeConfig, type FrontendConfig } from '@/constants/frontendConfig';

/**
 * 响应式前端配置 Hook
 * 返回合并后的完整配置，同时保持全局单例同步
 */
export function useFrontendConfig(): FrontendConfig {
  const storedConfig = useAppSelector(frontendConfigSelector);

  // 深合并并保持全局单例同步
  return useMemo(() => mergeConfig(storedConfig), [storedConfig]);
}
