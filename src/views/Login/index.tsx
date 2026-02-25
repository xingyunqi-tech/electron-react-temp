import { useCallback, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import { message } from '@/components/StaticFunction';
import { MobileOutlined, LockOutlined } from '@ant-design/icons';
import logoImg from '@/assets/images/common/logo.png';
import { useAppDispatch } from '@/store';
import { loginAction } from '@/store/modules/user';
import { useFrontendConfig } from '@/hooks/useFrontendConfig';
import styles from './index.module.scss';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const config = useFrontendConfig();
  const [loading, setLoading] = useState(false);

  const handleLogin = useCallback(async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      await dispatch(
        loginAction({
          phone: values.phone.trim(),
          password: values.password,
        }),
      ).unwrap();

      message.success('登录成功');
      const redirect = searchParams.get('redirect');
      // 校验 redirect 参数：必须是同源相对路径，防止 open redirect
      const redirectUrl = (() => {
        if (!redirect) return config.basic.defaultPage;
        try {
          const url = new URL(redirect, window.location.origin);
          return url.origin === window.location.origin ? redirect : config.basic.defaultPage;
        } catch {
          return config.basic.defaultPage;
        }
      })();
      navigate(redirectUrl);
    } catch (error) {
      // 响应拦截器已统一处理服务端错误提示，此处只记录日志
      console.error('登录失败:', error);
    } finally {
      setLoading(false);
    }
  }, [form, dispatch, navigate, searchParams, config.basic.defaultPage]);

  return (
    <div className={styles.loginContainer}>
      <div className={styles.logoHeader}>
        <img src={logoImg} alt="Logo" className={styles.logoImage} />
        <h1 className={styles.logoTextTitle}>管理系统</h1>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.formSection}>
          <h2 className={styles.formTitle}>登录账号</h2>

          <Form form={form} onFinish={handleLogin} size="large">
            <Form.Item
              name="phone"
              rules={[
                { required: true, message: '请输入手机号' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
              ]}
            >
              <Input prefix={<MobileOutlined />} placeholder="请输入手机号" maxLength={11} />
            </Form.Item>

            <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block className={styles.loginBtn}>
                立即登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
