import { useCallback, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import { message } from '@/components/StaticFunction';
import { MobileOutlined, LockOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import logoImg from '@/assets/images/common/logo.png';
import { useAppDispatch } from '@/store';
import { loginAction } from '@/store/modules/user';
import styles from './index.module.scss';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
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

      message.success(t('login.loginSuccess'));
      const redirect = searchParams.get('redirect');
      // 校验 redirect 参数：必须是相对路径，防止 open redirect
      const redirectUrl = redirect && redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/home';
      navigate(redirectUrl);
    } catch (error) {
      console.error('登录失败:', error);
      message.error(t('login.loginFailed'));
    } finally {
      setLoading(false);
    }
  }, [form, dispatch, navigate, searchParams, t]);

  return (
    <div className={styles.loginContainer}>
      <div className={styles.logoHeader}>
        <img src={logoImg} alt="Logo" className={styles.logoImage} />
        <h1 className={styles.logoTextTitle}>{t('layout.systemTitle')}</h1>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.formSection}>
          <h2 className={styles.formTitle}>{t('login.title')}</h2>

          <Form form={form} onFinish={handleLogin} size="large">
            <Form.Item
              name="phone"
              rules={[
                { required: true, message: t('login.phonePlaceholder') },
                { pattern: /^1[3-9]\d{9}$/, message: t('login.phoneInvalid') },
              ]}
            >
              <Input prefix={<MobileOutlined />} placeholder={t('login.phonePlaceholder')} maxLength={11} />
            </Form.Item>

            <Form.Item name="password" rules={[{ required: true, message: t('login.passwordPlaceholder') }]}>
              <Input.Password prefix={<LockOutlined />} placeholder={t('login.passwordPlaceholder')} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block className={styles.loginBtn}>
                {t('login.loginBtn')}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
