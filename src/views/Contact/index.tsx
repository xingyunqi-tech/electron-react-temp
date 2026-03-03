import { useState } from 'react';

import AnnouncementBar from '@/components/AnnouncementBar';
import SiteFooter from '@/components/SiteFooter';

import styles from './index.module.scss';

// Contact form
const CONTACT_FORM = {
  heading: '联系我们',
  subtitle: '准备好解码癌症的未来了吗？与我们取得联系。',
  fields: {
    firstName: '名',
    lastName: '姓',
    email: '邮箱地址',
    message: '留言',
  } as const,
  submitText: '提交',
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });

  const handleChange =
    (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submit - no actual logic needed
    console.log('Form submitted:', formData);
  };

  return (
    <div className={styles.page}>
      <AnnouncementBar />

      {/* Contact Form Section */}
      <section className={styles.contactSection}>
        <div className={styles.contactContent}>
          <h1 className={styles.contactTitle}>{CONTACT_FORM.heading}</h1>
          <p className={styles.contactSubtitle}>{CONTACT_FORM.subtitle}</p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formRow}>
              <div className={styles.formField}>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder={CONTACT_FORM.fields.firstName}
                  value={formData.firstName}
                  onChange={handleChange('firstName')}
                />
              </div>
              <div className={styles.formField}>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder={CONTACT_FORM.fields.lastName}
                  value={formData.lastName}
                  onChange={handleChange('lastName')}
                />
              </div>
            </div>

            <div className={styles.formFieldFull}>
              <input
                type="email"
                className={styles.formInput}
                placeholder={CONTACT_FORM.fields.email}
                value={formData.email}
                onChange={handleChange('email')}
              />
            </div>

            <div className={styles.formFieldFull}>
              <textarea
                className={`${styles.formInput} ${styles.formTextarea}`}
                placeholder={CONTACT_FORM.fields.message}
                value={formData.message}
                onChange={handleChange('message')}
                rows={4}
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              {CONTACT_FORM.submitText}
            </button>
          </form>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
