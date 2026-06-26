import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  notification,
  Popconfirm,
  Select,
  Table,
  Tooltip,
} from 'antd';
import type { Dayjs } from 'dayjs';
import React, { Component, useCallback, useEffect, useMemo, useState } from 'react';

/**
 * i18n 提取测试 —— React 组件形态全覆盖
 *
 * 覆盖函数组件 / 箭头组件 / 带 Props 组件 / 类组件（标准/带 Props/复杂）/ Hooks，
 * 用于验证 @kit/i18n-tools 在不同组件作用域下的提取与 t 注入。
 * 标注「✅ 应提取」与「❌ 不应提取」对照工具行为。
 */

// === 基础函数组件测试 ===

// 1. 标准函数组件
const FunctionComponent: React.FC = () => {
  const [value, setValue] = useState('');

  const handleClick = () => {
    message.success('操作成功');
    console.log('Debug info'); // ❌ 不应提取
    console.warn('This is a warning message'); // ❌ 不应提取
    console.error('Network Error'); // ❌ 不应提取
  };

  return (
    <div>
      <h2>函数组件标题</h2>
      <p>这是一个函数组件示例</p>
      <Button onClick={handleClick}>点击按钮</Button>
      <Input placeholder="请输入内容" value={value} onChange={e => setValue(e.target.value)} />
      {/* ❌ 技术属性不应提取 */}
      <div className="test-container" id="test-id" data-testid="function-component">
        <span style={{ color: 'red' }}>样式测试</span>
      </div>
    </div>
  );
};

// 2. 箭头函数组件
const ArrowFunctionComponent = () => {
  const handleSubmit = () => {
    fetch('/api/data', {
      method: 'POST', // ❌ 不应提取
      headers: {
        'Content-Type': 'application/json', // ❌ 不应提取
      },
    });
    window.alert('提交完成');
  };

  return (
    <Card title="箭头函数组件">
      <p>欢迎使用系统</p>
      <Button type="primary" onClick={handleSubmit}>
        提交数据
      </Button>
    </Card>
  );
};

// 3. 带 Props 的函数组件
interface UserCardProps {
  username: string;
  isActive: boolean;
}

const UserCard: React.FC<UserCardProps> = ({ username, isActive }) => {
  return (
    <div>
      <h3>用户信息</h3>
      <p>用户名: {username}</p>
      <p>{isActive ? '用户状态：活跃' : '用户状态：非活跃'}</p>
      <Button disabled={!isActive}>{isActive ? '编辑用户' : '激活用户'}</Button>
    </div>
  );
};

// 4. 模板字符串测试组件
const TemplateStringComponent: React.FC = () => {
  const [userName] = useState('张三');
  const [count] = useState(5);
  const [start] = useState('开始');
  const [end] = useState('结束');

  const handleAction = () => {
    const message1 = `欢迎 ${userName} 使用系统`;
    const message3 = `处理时间从 ${start} 到 ${end}`;
    const debugInfo = `Debug: user=${userName}, active=true`; // ❌ 技术信息
    console.log(debugInfo); // ❌ 不应提取
    console.log(message3);
    window.alert(message1);
  };

  return (
    <Card title="模板字符串测试">
      {/* ✅ JSX 混合内容：词间空格应保留 */}
      <p>欢迎 {userName} 使用系统</p>
      <p>您有 {count} 条未读消息</p>
      <p>
        处理时间从 {start} 到 {end}
      </p>
      <Button onClick={handleAction}>测试模板字符串</Button>
    </Card>
  );
};

// 5. 复杂函数组件（switch 返回 + async + 比较运算）
const ComplexFunctionComponent: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleProcess = async () => {
    setStatus('loading');
    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.5) resolve('ok');
          else reject(new Error('API Error'));
        }, 2000);
      });
      setStatus('success');
      message.success('处理完成');
    } catch (error) {
      setStatus('error');
      message.error('处理失败');
      console.error('Process error:', error); // ❌ 不应提取
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'idle':
        return '准备就绪';
      case 'loading':
        return '正在处理...';
      case 'success':
        return '处理成功';
      case 'error':
        return '处理失败';
      default:
        return '未知状态';
    }
  };

  return (
    <Card title="复杂函数组件">
      <div>
        <p>当前状态: {getStatusText()}</p>
        <Button type="primary" loading={status === 'loading'} onClick={handleProcess} disabled={status === 'loading'}>
          {status === 'loading' ? '处理中...' : '开始处理'}
        </Button>
        {status === 'success' && <div style={{ marginTop: 16, color: 'green' }}>✅ 恭喜！任务已成功完成</div>}
        {status === 'error' && <div style={{ marginTop: 16, color: 'red' }}>❌ 很抱歉，任务执行失败，请稍后重试</div>}
      </div>
    </Card>
  );
};

// 6. Hooks 测试组件（useCallback / useMemo / useEffect 内的中文）
const HooksTestComponent: React.FC = () => {
  const [data, setData] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleRefresh = useCallback(() => {
    setLoading(true);
    console.log('开始刷新数据'); // ❌ 不应提取
    setTimeout(() => {
      setData(['数据项1', '数据项2', '数据项3']);
      setLoading(false);
      message.success('数据刷新成功');
    }, 1000);
  }, []);

  const processedData = useMemo(() => {
    return data.map((item, index) => ({
      key: index,
      name: item,
      description: `这是${item}的描述`, // ✅ 模板字符串应提取
    }));
  }, [data]);

  useEffect(() => {
    console.log('组件已挂载'); // ❌ 不应提取
    handleRefresh();
  }, [handleRefresh]);

  return (
    <Card title="Hooks测试组件">
      <div>
        <Button onClick={handleRefresh} loading={loading}>
          刷新数据
        </Button>
        <Table
          dataSource={processedData}
          columns={[
            { title: '名称', dataIndex: 'name', key: 'name' },
            { title: '描述', dataIndex: 'description', key: 'description' },
          ]}
        />
      </div>
    </Card>
  );
};

// === 类组件测试 ===

// 7. 标准类组件
class StandardClassComponent extends Component {
  state: { loading: boolean; data: string | null } = {
    loading: false,
    data: null,
  };

  handleLoadData = () => {
    this.setState({ loading: true });
    console.log('开始加载数据'); // ❌ 不应提取
    setTimeout(() => {
      this.setState({ loading: false, data: '数据加载完成' });
      message.info('数据刷新成功');
    }, 1000);
  };

  render() {
    const { loading, data } = this.state;
    return (
      <div>
        <h2>标准类组件</h2>
        <p>这是一个类组件的示例</p>
        <Button loading={loading} onClick={this.handleLoadData}>
          {loading ? '加载中...' : '加载数据'}
        </Button>
        {data && <p>{data}</p>}
      </div>
    );
  }
}

// 8. 带 Props 的类组件（Form 校验文案）
interface FormComponentProps {
  onSubmit: (data: { name: string; email: string }) => void;
  title: string;
}

interface FormComponentState {
  formData: { name: string; email: string };
  errors: Record<string, string>;
}

class FormClassComponent extends Component<FormComponentProps, FormComponentState> {
  constructor(props: FormComponentProps) {
    super(props);
    this.state = {
      formData: { name: '', email: '' },
      errors: {},
    };
  }

  validateForm = () => {
    const errors: Record<string, string> = {};
    const { name, email } = this.state.formData;
    if (!name.trim()) {
      errors.name = '姓名不能为空';
    }
    if (!email.trim()) {
      errors.email = '邮箱不能为空';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = '邮箱格式不正确';
    }
    return errors;
  };

  handleSubmit = () => {
    const errors = this.validateForm();
    if (Object.keys(errors).length > 0) {
      this.setState({ errors });
      message.error('请修正表单错误');
      return;
    }
    console.log('表单提交:', this.state.formData); // ❌ 不应提取
    this.props.onSubmit(this.state.formData);
    message.success('表单提交成功');
  };

  render() {
    const { title } = this.props;
    const { formData, errors } = this.state;
    return (
      <Card title={title}>
        <Form layout="vertical">
          <Form.Item label="姓名" validateStatus={errors.name ? 'error' : ''} help={errors.name}>
            <Input
              value={formData.name}
              onChange={e => this.setState({ formData: { ...formData, name: e.target.value } })}
              placeholder="请输入姓名"
            />
          </Form.Item>
          <Form.Item label="邮箱" validateStatus={errors.email ? 'error' : ''} help={errors.email}>
            <Input
              value={formData.email}
              onChange={e => this.setState({ formData: { ...formData, email: e.target.value } })}
              placeholder="请输入邮箱地址"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={this.handleSubmit}>
              提交表单
            </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }
}

// 9. 复杂类组件（Modal.confirm 模板内容 + 比较运算操作数 + Table）
interface ProjectItem {
  id: string;
  name: string;
  status: string;
}

interface ComplexClassState {
  data: ProjectItem[];
  loading: boolean;
  error: string | null;
  selectedItems: string[];
}

class ComplexClassComponent extends Component<Record<string, never>, ComplexClassState> {
  constructor(props: Record<string, never>) {
    super(props);
    this.state = { data: [], loading: false, error: null, selectedItems: [] };
  }

  fetchData = async () => {
    this.setState({ loading: true, error: null });
    try {
      console.log('API调用开始'); // ❌ 不应提取
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // ⚠️ status: '进行中' 作为数据值会被提取；若用于 === 比较则跳过
          if (Math.random() > 0.2) resolve('ok');
          else reject(new Error('网络连接失败'));
        }, 1500);
      });
      this.setState({
        data: [
          { id: '1', name: '项目A', status: '进行中' },
          { id: '2', name: '项目B', status: '已完成' },
          { id: '3', name: '项目C', status: '暂停' },
        ],
        loading: false,
      });
      message.success('数据加载成功');
    } catch (error) {
      this.setState({ error: (error as Error).message, loading: false });
      message.error('数据加载失败');
      console.error('获取数据失败:', error); // ❌ 不应提取
    }
  };

  handleBatchDelete = () => {
    const { selectedItems } = this.state;
    if (selectedItems.length === 0) {
      message.warning('请先选择要删除的项目');
      return;
    }
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除选中的 ${selectedItems.length} 个项目吗？`, // ✅ 模板内容应提取
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        console.log('执行批量删除:', selectedItems); // ❌ 不应提取
        message.success('删除成功');
        this.setState({ selectedItems: [] });
      },
    });
  };

  render() {
    const { data, loading, error, selectedItems } = this.state;
    return (
      <Card title="复杂类组件示例">
        <div>
          <div style={{ marginBottom: 16 }}>
            <Button onClick={this.fetchData} loading={loading} style={{ marginRight: 8 }}>
              加载数据
            </Button>
            <Button onClick={this.handleBatchDelete} disabled={selectedItems.length === 0} danger>
              批量删除 ({selectedItems.length})
            </Button>
          </div>
          {error && <div style={{ color: 'red', marginBottom: 16 }}>错误: {error}</div>}
          {data.length > 0 && (
            <Table
              dataSource={data}
              rowKey="id"
              rowSelection={{
                selectedRowKeys: selectedItems,
                onChange: keys => this.setState({ selectedItems: keys as string[] }),
              }}
              columns={[
                { title: '项目名称', dataIndex: 'name', key: 'name' },
                { title: '状态', dataIndex: 'status', key: 'status' },
                {
                  title: '操作',
                  key: 'action',
                  render: (_, record: ProjectItem) => (
                    <Button size="small" onClick={() => console.log('编辑项目:', record.id)}>
                      编辑
                    </Button>
                  ),
                },
              ]}
            />
          )}
        </div>
      </Card>
    );
  }
}

// === 其他测试场景 ===

// 10. 条件渲染（Select.Option 子节点）
const ConditionalRenderComponent: React.FC = () => {
  const [showContent, setShowContent] = useState(false);
  const [userType, setUserType] = useState<'admin' | 'user' | 'guest'>('guest');

  return (
    <Card title="条件渲染测试">
      <div>
        <Button onClick={() => setShowContent(!showContent)}>{showContent ? '隐藏内容' : '显示内容'}</Button>
        <Select value={userType} onChange={setUserType} style={{ marginLeft: 16, width: 120 }}>
          <Select.Option value="admin">管理员</Select.Option>
          <Select.Option value="user">普通用户</Select.Option>
          <Select.Option value="guest">访客</Select.Option>
        </Select>
        {showContent && (
          <div style={{ marginTop: 16 }}>
            <p>这是条件渲染的内容</p>
            {userType === 'admin' && <p>管理员专属内容</p>}
            {userType === 'user' && <p>用户专属内容</p>}
            {userType === 'guest' && <p>访客只能查看基础内容</p>}
          </div>
        )}
      </div>
    </Card>
  );
};

// 11. 列表渲染（map + 货币符号）
const ListRenderComponent: React.FC = () => {
  const items = [
    { id: 1, name: '苹果', price: 5 },
    { id: 2, name: '香蕉', price: 3 },
    { id: 3, name: '橙子', price: 4 },
  ];

  return (
    <Card title="列表渲染测试">
      <div>
        <h4>商品列表</h4>
        {items.map(item => (
          <div key={item.id} style={{ padding: 8, border: '1px solid #ddd', margin: '4px 0' }}>
            <span>商品名称: {item.name}</span>
            <span style={{ marginLeft: 16 }}>价格: ¥{item.price}</span>
            <Button size="small" style={{ marginLeft: 16 }}>
              添加到购物车
            </Button>
          </div>
        ))}
        <div style={{ marginTop: 16 }}>
          <p>总共 {items.length} 件商品</p>
        </div>
      </div>
    </Card>
  );
};

// 12. 表单控件（Input/Select/DatePicker/TextArea placeholder）
const FormControlsComponent: React.FC = () => {
  const [formData, setFormData] = useState<{
    name: string;
    category: string;
    date: Dayjs | null;
    description: string;
  }>({ name: '', category: '', date: null, description: '' });

  return (
    <Card title="表单控件测试">
      <Form layout="vertical">
        <Form.Item label="产品名称">
          <Input
            placeholder="请输入产品名称"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        </Form.Item>
        <Form.Item label="产品类别">
          <Select
            placeholder="请选择产品类别"
            value={formData.category}
            onChange={value => setFormData({ ...formData, category: value })}
          >
            <Select.Option value="electronics">电子产品</Select.Option>
            <Select.Option value="clothing">服装</Select.Option>
            <Select.Option value="books">图书</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="发布日期">
          <DatePicker placeholder="请选择发布日期" onChange={date => setFormData({ ...formData, date })} />
        </Form.Item>
        <Form.Item label="产品描述">
          <Input.TextArea
            rows={4}
            placeholder="请输入产品描述"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" style={{ marginRight: 8 }}>
            提交
          </Button>
          <Button>重置</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

// 13. 边界情况（特殊字符 + 条件文本 + Tooltip + Popconfirm）
const EdgeCaseComponent: React.FC = () => {
  const [step] = useState(1);

  // ✅ 含特殊字符的文本：引号 / 大括号 / 换行 / emoji
  const specialTexts = [
    '包含"引号"的文本',
    "包含'单引号'的文本",
    '包含{大括号}的文本',
    '包含\n换行符的文本',
    '包含🎉emoji的文本',
  ];

  return (
    <Card title="边界情况测试">
      <div>
        {step === 1 && <span>第一步：请输入基本信息</span>}
        {step === 2 && <span>第二步：确认您的选择</span>}
        {step === 3 ? <span>第三步：完成设置</span> : <span>请继续操作</span>}
        <ul>
          {specialTexts.map((text, index) => (
            <li key={index}>{text}</li>
          ))}
        </ul>
        <Tooltip title="这是一个提示信息">
          <Button>{step > 2 ? '重新开始' : '继续下一步'}</Button>
        </Tooltip>
        <Popconfirm
          title="您确定要删除这条记录吗？"
          onConfirm={() => message.success('删除成功')}
          okText="确定"
          cancelText="取消"
        >
          <Button danger>删除记录</Button>
        </Popconfirm>
      </div>
    </Card>
  );
};

// 14. 错误处理（notification message + description）
const ErrorHandlingComponent: React.FC = () => {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    try {
      throw new Error('Simulated error'); // ❌ 技术错误不应提取
    } catch (error) {
      setHasError(true);
      console.error('捕获到错误:', error); // ❌ 不应提取
      notification.error({
        message: '系统错误',
        description: '抱歉，系统遇到了一个错误，请稍后重试。',
      });
    }
  };

  if (hasError) {
    return (
      <Card title="错误状态">
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <h3>哎呀！出现了错误</h3>
          <p>我们正在努力修复这个问题，请稍后再试。</p>
          <Button type="primary" onClick={() => setHasError(false)}>
            重新加载
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card title="错误处理测试">
      <p>点击按钮测试错误处理机制</p>
      <Button onClick={handleError}>触发错误</Button>
    </Card>
  );
};

// ============================================================
// === 边界补充夹具（验证 @kit/i18n-tools 已知 Bug 与覆盖盲区）===
// 每个夹具标注触发的 Bug 编号 + 「期望 vs 当前实际」，对本文件跑 generate 即可复现
// ============================================================

// 15. [Bug #3] PureComponent 类组件
//   工具会注入 `const { t } = this.props` + HOC 包裹，但类型增广只认 Component/React.Component，
//   漏判 PureComponent → 不追加 `& WithTranslation` → tsc 报「Property 't' does not exist」
//   期望：类型签名补 WithTranslation，运行 + 类型检查双通过
class PureClassComponent extends React.PureComponent {
  render() {
    return (
      <Card title="纯组件边界测试">
        <p>这是一个 PureComponent 纯组件</p>
        <Button>纯组件按钮</Button>
      </Card>
    );
  }
}

// 16. [Bug #4] 单参 useEffect（无依赖数组 = 故意每次渲染执行）+ 体内中文将被替换为 t()
//   工具检测到 effect 体内用了 t，会无条件补成 useEffect(fn, [t]) →
//   语义从「每次渲染」变成「仅 t 变化时（≈首次）」，且 restore 还原成 [] 而非删数组 → 不可逆
//   期望：单参 effect 保持单参，不补依赖数组
const SingleArgEffectComponent: React.FC = () => {
  const [count, setCount] = useState(0);

  // ⚠️ 故意不写依赖数组：原意是每次渲染都执行
  useEffect(() => {
    message.success('每次渲染都会执行的提示');
  });

  return (
    <Card title="单参 useEffect 边界测试">
      <Button onClick={() => setCount(count + 1)}>触发重渲染</Button>
      <p>当前计数：{count}</p>
    </Card>
  );
};

// 17. [对照组] 双参 useEffect 空依赖 + 体内中文 —— 这是「应当」补 t 的正确路径
//   期望：[] → [t]（正确行为，作为 Bug #4 的对照，证明工具只该改这种带依赖数组的）
const EmptyDepsEffectComponent: React.FC = () => {
  useEffect(() => {
    message.info('仅挂载时执行一次的提示');
  }, []);

  return (
    <Card title="空依赖 useEffect 对照组">
      <p>挂载提示对照内容</p>
    </Card>
  );
};

// 18. [边界盲区] React.memo 包裹组件（工具已支持拆包，作为回归守卫）
//   期望：识别内层箭头组件、注入 hook、提取文案
const MemoWrappedComponent = React.memo(() => {
  return (
    <Card title="memo 包裹边界测试">
      <p>被 memo 包裹的组件文案</p>
      <Button>记忆化按钮</Button>
    </Card>
  );
});

// 19. [边界盲区] React.forwardRef 包裹组件（工具已支持拆包，作为回归守卫）
//   期望：识别内层箭头组件、注入 hook、提取文案
const ForwardRefComponent = React.forwardRef<HTMLDivElement>((_props, ref) => {
  return (
    <div ref={ref}>
      <p>转发 ref 的组件文案</p>
      <Button>转发 ref 按钮</Button>
    </div>
  );
});

// 20. [边界盲区] 表达式体箭头组件（无 Block，工具需先包成块体再注入 hook）
//   期望：`() => <jsx/>` 被包成 `() => { const {t}=...; return <jsx/>; }`，文案正确替换
const ExprBodyArrowComponent: React.FC = () => <span>表达式体箭头组件的文案</span>;

// 21. [边界·已知取舍] 中文字符串拼接 'A' + 变量 + 'B'
//   每个中文片段是独立字面量 → 被「分别提取」为独立 key（产出 t('第') + page + t('页')）。
//   这是 i18n 工具的普遍已知限制（无法把片段识别为一句话），非 Bug。
//   验证点：确认分别提取符合预期，且 `+` 表达式语法不被破坏。
const StringConcatComponent: React.FC = () => {
  const [page] = useState(1);
  const label = '第' + page + '页';
  const tip = '共' + page + '条记录';

  return (
    <Card title="字符串拼接边界测试">
      <p>{label}</p>
      <span>{tip}</span>
    </Card>
  );
};

// 22. [边界盲区] Fragment <>...</> 作为组件根节点（工具已支持，回归守卫）
//   验证点：Fragment 内 JSX 文案正常提取替换
const FragmentRootComponent: React.FC = () => {
  return (
    <>
      <h4>片段根节点标题</h4>
      <p>片段根节点内容文案</p>
      <Button>片段根节点按钮</Button>
    </>
  );
};

// === 主组件：聚合所有场景 ===
const TestI18nMain: React.FC = () => {
  const handleFormSubmit = (data: { name: string; email: string }) => {
    console.log('收到表单数据:', data); // ❌ 不应提取
    message.success('表单处理完成');
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>React国际化测试页面</h1>
      <p>此页面包含各种 React 组件和场景，用于测试国际化工具的提取能力</p>

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
        <FunctionComponent />
        <ArrowFunctionComponent />
        <UserCard username="测试用户" isActive={true} />
        <TemplateStringComponent />
        <ComplexFunctionComponent />
        <HooksTestComponent />
        <StandardClassComponent />
        <FormClassComponent title="用户信息表单" onSubmit={handleFormSubmit} />
        <ComplexClassComponent />
        <ConditionalRenderComponent />
        <ListRenderComponent />
        <FormControlsComponent />
        <EdgeCaseComponent />
        <ErrorHandlingComponent />
        {/* 边界补充夹具 */}
        <PureClassComponent />
        <SingleArgEffectComponent />
        <EmptyDepsEffectComponent />
        <MemoWrappedComponent />
        <ForwardRefComponent />
        <ExprBodyArrowComponent />
        <StringConcatComponent />
        <FragmentRootComponent />
      </div>

      <div style={{ marginTop: 24, padding: 16, background: '#f5f5f5' }}>
        <h3>测试说明</h3>
        <ul>
          <li>✅ 应该被提取：包含中文的用户界面文本</li>
          <li>❌ 不应该被提取：console 调用、技术属性、英文技术术语</li>
          <li>🔄 模板字符串：包含变量的中文文本</li>
          <li>🎯 组件类型：函数组件、类组件、Hooks</li>
        </ul>
      </div>
    </div>
  );
};

export default TestI18nMain;
