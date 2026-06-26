/**
 * i18n 提取测试 —— 纯 TS / JS 上下文
 *
 * 本文件故意保留原始中文，用于验证 @kit/i18n-tools 的 generate（提取 + 改写）能力。
 * 覆盖「应被提取」与「不应被提取」两类场景，方便对照工具行为：
 *   - 应提取：用户可见的界面文案、提示、错误信息、模板字符串中的中文
 *   - 不应提取：console 调用、技术常量（URL/HTTP/枚举值/存储 key）、比较运算操作数
 */

// ============================================================================
// 1. 验证函数 —— 返回值中文应被提取
// ============================================================================
export const validateUserInput = (input: string): string | null => {
  if (!input || input.trim().length === 0) {
    return '输入内容不能为空';
  }
  if (input.length < 2) {
    return '输入内容至少需要 2 个字符';
  }
  if (input.length > 100) {
    return '输入内容不能超过 100 个字符';
  }
  return null;
};

// ============================================================================
// 2. switch 返回中文 —— 每个 case 的中文都应被提取
// ============================================================================
export const getErrorMessage = (errorCode: number): string => {
  switch (errorCode) {
    case 400:
      return '请求参数错误';
    case 401:
      return '未授权访问';
    case 403:
      return '权限不足';
    case 404:
      return '资源未找到';
    case 500:
      return '服务器内部错误';
    default:
      return '未知错误';
  }
};

// ============================================================================
// 3. 模板字符串带变量 —— 应提取为 t('key', { var }) 形态
// ============================================================================
export const generateWelcomeMessage = (userName: string, loginCount: number): string => {
  return `欢迎回来，${userName}！这是您第 ${loginCount} 次登录`;
};

export const generateProgressMessage = (current: number, total: number): string => {
  const percentage = Math.round((current / total) * 100);
  return `进度：${current}/${total}（${percentage}%）`;
};

// ============================================================================
// 4. 常量对象 —— value 中文应被提取，key 名保持不变
// ============================================================================
export const USER_MESSAGES = {
  WELCOME: '欢迎使用我们的系统',
  LOGIN_SUCCESS: '登录成功',
  LOGIN_FAILED: '登录失败，请检查用户名和密码',
  LOGOUT_CONFIRM: '确定要退出登录吗？',
  NETWORK_ERROR: '网络连接失败，请稍后重试',
  CONFIRM_DELETE: '确定要删除这个项目吗？',
  UNSAVED_CHANGES: '您有未保存的更改，确定要离开吗？',
};

export const BUTTON_TEXTS = {
  SUBMIT: '提交',
  CANCEL: '取消',
  CONFIRM: '确认',
  DELETE: '删除',
  SAVE: '保存',
  SEARCH: '搜索',
};

// ============================================================================
// 5. 不应被提取：技术常量（URL / HTTP / 存储 key / 枚举值）
// ============================================================================
export const API_CONFIG = {
  BASE_URL: 'https://api.example.com', // 不应提取
  TIMEOUT: 30000, // 不应提取
  ENDPOINTS: {
    LOGIN: '/auth/login', // 不应提取
    LOGOUT: '/auth/logout', // 不应提取
  },
};

export const HTTP_METHODS = {
  GET: 'GET', // 不应提取
  POST: 'POST', // 不应提取
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken', // 不应提取
  THEME: 'theme', // 不应提取
};

// ============================================================================
// 6. 不应被提取：console 调用（即使含中文）
// ============================================================================
export const debugLog = (message: string, data?: unknown): void => {
  console.log(`调试信息: ${message}`, data); // console 中文不应提取
  console.warn('警告: 这是调试函数'); // console 中文不应提取
  console.error('错误: 调试模式下的错误信息'); // console 中文不应提取
};

// ============================================================================
// 7. 比较运算操作数 —— 工具会主动跳过（替换后切语言分支会永久失配）
// ============================================================================
export const isInProgress = (status: string): boolean => {
  // status === '进行中' 这种比较若被 t() 替换，运行时切语言后判断会失效，故跳过
  return status === '进行中';
};

// ============================================================================
// 8. 条件 / 三元 —— 两个分支中文都应被提取
// ============================================================================
export const getUserStatusMessage = (isOnline: boolean): string => {
  return isOnline ? '当前在线' : '离线状态';
};

export const getNotificationText = (count: number): string => {
  return count === 1 ? '您有 1 条新消息' : `您有 ${count} 条新消息`;
};

// ============================================================================
// 9. async / try-catch —— 业务文案应提取，技术错误信息按需
// ============================================================================
export const fetchUserData = async (userId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'GET', // 不应提取
      headers: { 'Content-Type': 'application/json' }, // 不应提取
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`); // 技术错误，不应提取
    }
    return { success: true, message: '用户数据获取成功' };
  } catch (error) {
    console.error('API Error:', error); // 不应提取
    return { success: false, message: '获取用户数据失败，请检查网络连接' };
  }
};

// ============================================================================
// 10. 类方法 —— 返回值中文应被提取，console 不提取
// ============================================================================
export class MessageManager {
  private messages: string[] = [];

  addMessage(message: string): string {
    this.messages.push(message);
    console.log(`Message added: ${message}`); // 不应提取
    return '消息添加成功';
  }

  getMessageCount(): string {
    const count = this.messages.length;
    if (count === 0) {
      return '暂无消息';
    }
    return `您有 ${count} 条消息`;
  }
}

// ============================================================================
// 11. TS 枚举 + 映射 —— 枚举值不提取，映射 value 中文应提取
// ============================================================================
export enum OrderStatus {
  PENDING = 'pending', // 不应提取
  PROCESSING = 'processing', // 不应提取
  COMPLETED = 'completed', // 不应提取
  CANCELLED = 'cancelled', // 不应提取
}

export const getOrderStatusText = (status: OrderStatus): string => {
  const statusMap = {
    [OrderStatus.PENDING]: '待处理',
    [OrderStatus.PROCESSING]: '处理中',
    [OrderStatus.COMPLETED]: '已完成',
    [OrderStatus.CANCELLED]: '已取消',
  };
  return statusMap[status] || '未知状态';
};

// ============================================================================
// 12. 带前导注释的字面量 —— 注释不提取，中文字面量应被提取并替换
// ============================================================================
export const commentedGreeting = /* 问候语 */ '你好，欢迎光临本系统';

export const COMMENTED_CONFIG = {
  title: /* 配置标题 */ '系统设置中心面板',
  subtitle: '管理您的个性化偏好',
};

// ============================================================================
// 13. 中文对象 key（G2）—— 只提 value，key 不应被提取
// ============================================================================
export const MIXED_KEY_MAP: Record<string, string> = {
  名称: '名称字段的值', // key「名称」不提取；value「名称字段的值」应提取
  状态: '当前状态正常', // 同上
};

// ============================================================================
// 14. 无替换模板字符串（G4）—— 纯中文反引号串应被提取
// ============================================================================
export const plainTemplate = `这是一段无变量的纯中文模板字符串`;

// ============================================================================
// 15. 模板字符串字面量插值（G5）—— ${'内联'} 应内联进文案，不当变量占位符
// ============================================================================
export const inlinedTemplate = (count: number): string => {
  // 期望文案：「当前状态：已完成，共 {count} 项」——'已完成' 内联，count 才是占位符
  return `当前状态：${'已完成'}，共 ${count} 项`;
};

// ============================================================================
// 16. 含 HTML 标签的模板字符串（G3）—— 应被跳过并 warn（避免 HTML 灌入 locale）
// ============================================================================
export const richTextTip = `<div class="tip">这是一段<strong>富文本</strong>提示，请谨慎操作</div>`;
