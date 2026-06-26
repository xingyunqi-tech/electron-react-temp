import { useState } from 'react';
import { Button, Form, Input, Modal, Radio, Select, Tooltip, message } from 'antd';
import { t } from '@/plugins/locale';
import { getOrderStatusText, OrderStatus, USER_MESSAGES } from './test-fn';

/**
 * 表达式体箭头组件（G6）—— 转换时应被包成块体并注入 useTranslation 的 t，
 * 不能产出未声明的裸 t（react-component-injector B3 边界）。
 */
const StatusBadge = () => (
  // title 中文需 t() → 表达式体会被包成块体并注入 useTranslation
  <span title="在线状态提示" className="badge">
    在线状态徽标
  </span>
);

/**
 * i18n 提取测试页面 —— JSX 上下文
 *
 * 故意保留原始中文，覆盖 React/JSX 下的各类提取场景。每个 section 标注
 * 「✅ 应提取」或「❌ 不应提取」，便于对照 @kit/i18n-tools 的 generate 行为。
 */
export default function DemoPage() {
  const [form] = Form.useForm();
  const [keyword, setKeyword] = useState('');
  const [role, setRole] = useState('admin');
  const [status, setStatus] = useState<OrderStatus>(OrderStatus.PENDING);
  const [itemCount] = useState(3);
  const [totalPrice] = useState(99);

  // ✅ JS 字符串字面量 —— 应提取
  const pageTitle = '多语言提取测试';

  const handleSubmit = () => {
    if (!keyword) {
      message.warning('请输入搜索关键词'); // ✅ message 文案应提取
      return;
    }
    // ✅ 带变量的模板字符串应提取为 t('key', { keyword, role })
    message.success(`已提交：关键词「${keyword}」，角色「${role}」`);
  };

  const handleDelete = () => {
    Modal.confirm({
      title: '确认删除', // ✅ 应提取
      content: USER_MESSAGES.CONFIRM_DELETE, // 引用常量（其定义在 test-fn.ts 中提取）
      okText: '删除', // ✅ 应提取
      cancelText: '取消', // ✅ 应提取
      onOk: () => message.success('删除成功'), // ✅ 应提取
    });
  };

  return (
    // ❌ className / data-testid 是技术标识，不应提取
    <div className="demo-page" data-testid="demo-root" style={{ padding: 24 }}>
      {/* ==================== 1. JSX 文本节点 ==================== */}
      <h1>{pageTitle}</h1>
      <p>这是一个用于测试国际化文本提取的演示页面。</p>
      {/* ✅ 已国际化的 t() 调用 —— 工具应识别并跳过，不重复处理 */}
      <p>{t('layout.systemTitle')}</p>

      {/* ==================== 2. JSX 属性（静态 / 动态）==================== */}
      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="请输入搜索关键词" // ✅ 静态属性应提取
          aria-label="搜索框" // ✅ aria-label 面向用户应提取
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          style={{ width: 260 }}
        />
        {/* ✅ 动态属性中的字符串字面量应提取 */}
        <Button title={'点击执行搜索'} type="primary" style={{ marginLeft: 8 }} onClick={handleSubmit}>
          搜索
        </Button>
      </div>

      {/* ==================== 3. 列表 / 选项中文 ==================== */}
      <div style={{ marginBottom: 16 }}>
        <Select
          value={role}
          onChange={setRole}
          style={{ width: 260 }}
          options={[
            { value: 'admin', label: '管理员' }, // ✅ 应提取
            { value: 'editor', label: '编辑者' }, // ✅ 应提取
            { value: 'guest', label: '访客' }, // ✅ 应提取
          ]}
        />
      </div>

      {/* ==================== 4. 三元 / 条件渲染 ==================== */}
      <p>{keyword ? '已输入关键词' : '尚未输入关键词'}</p>
      {role === 'admin' && <p>当前为管理员视图</p>}

      {/* ==================== 5. antd Form：label + 校验文案 ==================== */}
      <Form form={form} layout="vertical" style={{ maxWidth: 360 }}>
        <Form.Item
          label="用户名" // ✅ 应提取
          name="username"
          rules={[{ required: true, message: '用户名不能为空' }]} // ✅ 校验文案应提取
        >
          <Input placeholder="请输入用户名" />
        </Form.Item>
        <Form.Item
          label="邮箱地址"
          name="email"
          rules={[
            { required: true, message: '请输入邮箱地址' },
            { type: 'email', message: '邮箱格式不正确' },
          ]}
        >
          <Input placeholder="请输入邮箱地址" />
        </Form.Item>
        <Form.Item label="订单状态" name="status">
          <Radio.Group value={status} onChange={e => setStatus(e.target.value)}>
            <Radio value={OrderStatus.PENDING}>待处理</Radio>
            <Radio value={OrderStatus.PROCESSING}>处理中</Radio>
            <Radio value={OrderStatus.COMPLETED}>已完成</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>

      {/* 引用从 test-fn.ts 导入的函数返回值 */}
      <p>当前状态文案：{getOrderStatusText(status)}</p>

      {/* ==================== 6. Tooltip / 无障碍 ==================== */}
      <Tooltip title="这是一段帮助提示">
        {/* ✅ img alt 面向无障碍应提取；❌ src URL 不应提取 */}
        <img src="/placeholder.png" alt="产品封面图" width={80} height={80} />
      </Tooltip>

      {/* ==================== 7. 操作按钮 ==================== */}
      <div style={{ marginTop: 16 }}>
        <Button danger onClick={handleDelete}>
          删除
        </Button>
        <Button style={{ marginLeft: 12 }} onClick={() => setKeyword('')}>
          重置
        </Button>
      </div>

      {/* ==================== 8. JSX 混合内容（文本 + 表达式，G1）==================== */}
      {/* ✅ 词间空格应保留并实际替换：简单变量插值 */}
      <p>
        共 {itemCount} 项，合计 {totalPrice} 元
      </p>
      {/* ⚠️ 边界：插值表达式含字符串字面量 → 工具拒绝合并、回退原路径 */}
      <p>状态 {form.getFieldValue('status') ?? '未知'} 已记录</p>

      {/* ==================== 9. 表达式体箭头组件（G6）==================== */}
      <StatusBadge />

      {/* ==================== 10. 英文 JSX 文本（G7）==================== */}
      {/* ✅ 纯英文的 JSX 文本也会被提取（与英文属性不同）*/}
      <p>Powered by i18n-tools</p>

      {/* ==================== 11. 含 HTML 的模板串（G3，dangerouslySetInnerHTML）==================== */}
      {/* ❌ 整段含 HTML 标签 → 工具跳过并 warn，不把标签灌入 locale */}
      <div
        dangerouslySetInnerHTML={{
          __html: `<strong>重要：</strong>请阅读并同意用户协议后再继续`,
        }}
      />

      {/* ==================== 12. 负向用例 ==================== */}
      {/* ❌ JSX 注释中的中文不应被提取 */}
      {/* ❌ 对象字面量的中文 key 不应被提取（仅 value 提取）*/}
      <ul>
        <li>✅ 应提取：用户可见的界面文案</li>
        <li>❌ 不应提取：console 调用、className、URL、技术属性</li>
      </ul>
    </div>
  );
}
