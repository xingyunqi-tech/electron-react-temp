/**
 * 默认根 Selector 工厂函数
 * @param name 模块名称（对应 store 中的 key）
 * @returns 根 Selector 函数
 */
export const DefaultRootSelectorFactory = (name: string) => (state: any) => state[name];
