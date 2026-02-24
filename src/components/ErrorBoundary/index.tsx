import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Button, Collapse } from 'antd';
import { message } from '@/components/StaticFunction';
import { WarningFilled } from '@ant-design/icons';
import styles from './index.module.scss';

/**
 * Sentry 上报（动态加载，未启用时零开销）
 */
async function reportToSentry(error: Error, info: { componentStack?: string | null }) {
  try {
    const Sentry = await import('@sentry/react');
    if (Sentry.getClient()) {
      Sentry.withScope(scope => {
        scope.setExtras({ componentStack: info.componentStack });
        Sentry.captureException(error);
      });
    }
  } catch {
    // Sentry 未安装或未初始化，静默忽略
  }
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    reportToSentry(error, { componentStack: info.componentStack });
  }

  handleReset = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return <ErrorFallback error={this.state.error} resetErrorBoundary={this.handleReset} />;
    }
    return this.props.children;
  }
}

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  const isDev = import.meta.env.DEV;
  const errorDetails = error.stack || error.message;

  const copyErrorDetails = async () => {
    try {
      await navigator.clipboard.writeText(errorDetails);
      message.success('错误详情已复制到剪贴板');
    } catch {
      message.error('复制失败');
    }
  };

  return (
    <div className={styles.fallback}>
      <div className={styles.content}>
        <div className={styles.icon}>
          <WarningFilled style={{ fontSize: 64 }} />
        </div>
        <h3 className={styles.title}>页面出现错误</h3>
        <p className={styles.message}>抱歉，页面遇到了一些问题。请尝试刷新页面或返回首页。</p>
        <div className={styles.actions}>
          <Button type="primary" onClick={resetErrorBoundary}>
            重试
          </Button>
          <Button onClick={() => (window.location.href = '/')}>返回首页</Button>
        </div>

        {isDev && errorDetails && (
          <div className={styles.details}>
            <Collapse
              items={[
                {
                  key: 'details',
                  label: '错误详情',
                  children: (
                    <div>
                      <div className={styles.stackHeader}>
                        <span>错误堆栈</span>
                        <Button size="small" type="link" onClick={copyErrorDetails}>
                          复制
                        </Button>
                      </div>
                      <pre className={styles.stack}>{errorDetails}</pre>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        )}
      </div>
    </div>
  );
}
