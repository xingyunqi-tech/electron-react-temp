# E2E 视觉测试 - Playwright + Applitools Eyes

> Chrome PC 端 (1920x1080) 页面 UI 还原测试

---

## 🚀 快速开始

### 1. 验证环境

```bash
npx playwright install chrome
```

### 2. 配置 API Key (已完成 ✅)

`.env.development` 中已配置:
```bash
VITE_APPLITOOLS_API_KEY = 't9ph101...'  # ✅ 已配置
```

如需修改，访问: https://eyes.applitools.com/app/admin/account

### 3. 启动开发服务器 (必需)

```bash
# 在一个终端窗口中启动开发服务器
pnpm start --port 5173
```

⚠️ **重要**: Playwright 配置了自动启动开发服务器，但如果端口冲突或启动失败，请手动启动。

### 4. 运行测试

```bash
# UI 模式 (推荐 - 可视化调试)
pnpm test:e2e:ui

# 直接运行所有视觉测试 (带界面)
npx playwright test --headed

# 无头模式运行
pnpm test:e2e

# 查看测试报告
pnpm test:e2e:report
```

### 5. 首次运行说明 ⚠️ 重要

**首次运行测试时，所有测试会失败并抛出 `DiffsFoundError` - 这是正常的！**

典型错误输出：
```
✘ 6 failed
  [chrome] › e2e/visual/auth/login.spec.ts:19:3 › 登录页视觉测试 › 登录页 - 默认状态

DiffsFoundError: Test '登录页 - 默认状态' of 'Vue Admin Template' detected differences!
See details at: https://eyes.applitools.com/app/batches/...

  at utils/eyes-helper.ts:95
  at Eyes.close()
```

**为什么会失败？**
- ✅ 测试成功执行并上传截图到 Applitools
- ❌ 但因为**没有基准图像(Baseline)**，所以抛出 `DiffsFoundError`
- 这**不是真正的错误**，而是提示你需要建立基准

**解决步骤**:
1. 访问 Applitools Dashboard: https://eyes.applitools.com
2. 登录后，在 "Unresolved tests" 中找到这个测试
3. 逐个审查截图质量（UI 是否正确还原）
4. 点击 **Accept** (✓) 接受这些图像作为基准
5. 再次运行测试 `pnpm test:e2e` - 现在应该全部通过 ✅

**后续运行**:
- 如果 UI 无变化 → 测试通过 ✅
- 如果 UI 有变化 → 抛出 `DiffsFoundError` → 去 Dashboard 审查差异 → Accept/Reject

### 6. 查看结果

- **本地报告**: `playwright-report/index.html` (自动打开)
- **Applitools Dashboard**: https://eyes.applitools.com
- **测试超时**: 90 秒 (Applitools 调用需要较长时间)

### 7. Figma 设计稿集成 (可选)

使用 Figma 插件上传设计稿作为基准：

1. 在 Figma 中安装 "Applitools Eyes" 插件
2. 选择设计稿 Frame（1920x1080）
3. 运行插件并上传到 Applitools
4. 配置：App Name = `Vue Admin Template`

---

## 📁 目录结构

```
e2e/
├── visual/              # 视觉测试用例
│   └── auth/
│       └── login.spec.ts    # 登录页测试
├── case/                # 功能测试用例
│   └── auth/
│       └── login.spec.ts    # 登录功能测试
├── utils/
│   └── eyes-helper.ts   # Applitools 工具函数
└── README.md            # 本文档
```

---

## 📝 编写测试

### 基本结构

```typescript
import { test } from '@playwright/test';
import { EyesManager, waitForPageLoad } from '../utils/eyes-helper';

test.describe('页面名称', () => {
  let eyes: EyesManager;

  test.beforeEach(async () => {
    eyes = new EyesManager();
  });

  test.afterEach(async () => {
    await eyes.close();
  });

  test('测试用例', async ({ page }) => {
    await eyes.open(page, 'App Name', 'Test Name');

    await page.goto('/your-page');
    await waitForPageLoad(page);

    await eyes.checkWindow('状态描述');
  });
});
```

### 可用工具函数

```typescript
// 1. Eyes 管理器
const eyes = new EyesManager();
await eyes.open(page, 'App', 'Test');        // 打开 Eyes
await eyes.checkWindow('描述');               // 检查整个窗口
await eyes.checkRegion('.selector', '描述'); // 检查特定区域
await eyes.checkWindowWithIgnore('描述', ['.dynamic']); // 忽略区域
await eyes.close();                          // 关闭 Eyes

// 2. 等待页面加载 (自动处理骨架屏、登录页输入框等)
await waitForPageLoad(page);
// - 等待网络空闲
// - 等待骨架屏消失 ([data-testid="skeleton"])
// - 登录页: 等待输入框可编辑
// - 等待动画完成

// 3. 隐藏动态内容
await hideDynamicContent(page, ['.timestamp', '.random-id']);
```

---

## 🎯 测试什么?

### ✅ 应该测试

- **关键页面**: 登录、首页、核心业务页
- **多种状态**: 默认、禁用、加载、错误
- **表单交互**: 输入、校验、提交
- **弹窗/模态框**: 打开、关闭、内容

### ❌ 不应该测试

- **纯逻辑代码** - 用单元测试
- **第三方组件** - 已有测试
- **后端 API** - 用 API 测试

---

## 📊 工作流程

### 首次运行 (建立基线)

```
编写测试 → 运行测试 → Applitools 创建基线 → 审查基线 → 接受
```

### 后续运行 (检测变更)

```
修改代码 → 运行测试 → 对比基线 → 发现差异 → 审查 → 接受/拒绝
```

---

## 💡 最佳实践

### ✅ DO (推荐)

1. **清晰命名** - "登录页 - 错误提示" 而不是 "test1"
2. **等待加载** - 使用 `waitForPageLoad()` 确保页面完全加载
3. **隐藏动态内容** - 时间戳、随机ID等
4. **合理等待** - 200-500ms 等待动画，不要用长时间固定等待

### ❌ DON'T (避免)

1. ❌ 不要用长时间固定等待 (`waitForTimeout(5000)`)
2. ❌ 不要测试第三方组件
3. ❌ 不要忽略所有差异

---

## 🔧 故障排除

| 问题 | 解决方案 |
|------|---------|
| **DiffsFoundError** | ✅ **正常！** 首次运行或 UI 变更时会抛出。去 Applitools Dashboard Accept 基准 |
| API Key 错误 | 检查 `.env.development` 中的 `VITE_APPLITOOLS_API_KEY` |
| 浏览器未安装 | 运行 `npx playwright install chrome` |
| 测试超时 | 增加 `playwright.config.ts` 中的 `timeout` |
| 端口占用 | `lsof -ti:5173 \| xargs kill -9` |
| Internal error: step id not found | ⚠️ Playwright 内部警告，可忽略，不影响测试结果 |
| **TimeoutError: locator.fill: Timeout** | ✅ **已修复！** `waitForPageLoad()` 已更新，会等待登录页输入框可编辑 |
| 输入框不可编辑 | 确保使用 `await waitForPageLoad(page)` 在操作前等待页面完全加载 |

---

## 📚 相关资源

- **Playwright 文档**: https://playwright.dev
- **Applitools 文档**: https://applitools.com/docs
- **Applitools Dashboard**: https://eyes.applitools.com

---

## 📝 常用命令

```bash
# 运行测试
pnpm test:e2e             # 所有 E2E 测试
pnpm test:e2e:ui          # UI 模式 (推荐)
pnpm test:e2e:debug       # Debug 模式

# 查看报告
pnpm test:e2e:report      # Playwright 报告
```

---

## 🎓 下一步

1. ✅ 安装依赖
2. ✅ 配置 API Key
3. ✅ 运行示例测试 `pnpm test:e2e`
4. ✅ 查看 Applitools Dashboard
5. ✅ 编写更多测试用例

---

## 📖 waitForPageLoad 函数详解

### 功能说明

`waitForPageLoad(page)` 是一个智能等待函数，确保页面完全加载后再执行测试操作。

### 等待流程

```typescript
await waitForPageLoad(page);
```

执行顺序：
1. **网络空闲** - 等待所有网络请求完成
2. **骨架屏消失** - 检测并等待 `[data-testid="skeleton"]` 隐藏
3. **登录页特殊处理** - 如果是 `/login` 页面：
   - 等待手机号输入框可见
   - 等待输入框可编辑（非 disabled/readOnly 状态）
4. **动画完成** - 额外等待 1 秒确保动画和异步操作完成

### 为什么需要等待输入框可编辑？

Playwright 的 `fill()` 操作要求元素同时满足：
- ✅ 可见 (visible)
- ✅ 启用 (enabled - 非 disabled)
- ✅ 可编辑 (editable - 非 readOnly)

即使输入框已经可见，如果还处于初始化状态（disabled 或 readOnly），`fill()` 会超时失败。

### 技术实现

```typescript
// 使用 waitForFunction 检查元素状态
await page.waitForFunction(
  () => {
    const input = document.querySelector<HTMLInputElement>(
      'input.el-input__inner[placeholder="请输入手机号"]',
    );
    return input && !input.disabled && !input.readOnly;
  },
  { timeout: 5000 },
);
```

### 最佳实践

```typescript
// ✅ 推荐：操作前等待页面加载
await page.goto('/login');
await waitForPageLoad(page);
await page.locator('input').fill('value'); // 安全

// ❌ 错误：直接操作可能失败
await page.goto('/login');
await page.locator('input').fill('value'); // 可能超时
```

---

**Happy Testing! 🚀**
