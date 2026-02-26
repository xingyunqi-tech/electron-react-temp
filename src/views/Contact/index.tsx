import { useState } from 'react';
import { Link } from 'react-router-dom';

import logoSvg from '@/assets/images/home/logo.svg';

import styles from './index.module.scss';

const NAV = {
  primary: [
    { label: '类器官智能', path: '/organoid-intelligence' },
    { label: '平台', path: '/platform' },
    { label: '能力', path: '/capabilities' },
    { label: '产品', path: '/products' },
    { label: '关于我们', path: '/about-us' },
  ],
  secondary: [
    { label: '新闻与观点', path: '/news' },
    { label: '联系我们', path: '/contact' },
  ],
};

// Announcement
const ANNOUNCEMENT_TEXT = '公告：双料获奖！OrgaNova 荣获行业认可';

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

// Footer
const FOOTER = {
  title: '解码癌症',
  address: {
    company: 'OrgaNova',
    street: '1610 Cinnamon Lane',
    city: 'Texas, TX 78212',
    country: 'United States',
  },
  copyright: 'OrgaNova \u00a9 2026. 版权所有。',
  socialLinks: [
    { label: 'LinkedIn', url: '#' },
    { label: 'X', url: '#' },
    { label: 'YouTube', url: '#' },
  ],
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
      {/* Announcement Bar */}
      <div className={styles.announcement}>
        <span>{ANNOUNCEMENT_TEXT}</span>
      </div>

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

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerNav}>
          <img src={logoSvg} alt="OrgaNova" className={styles.logo} />
          <div className={styles.navLinks}>
            {NAV.primary.map(link => (
              <Link key={link.label} to={link.path} className={styles.navLink}>
                {link.label}
              </Link>
            ))}
            <span className={styles.navDivider} />
            {NAV.secondary.map(link => (
              <Link key={link.label} to={link.path} className={styles.navLink}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className={styles.footerBottom}>
          <div>
            <h2 className={styles.footerTitle}>{FOOTER.title}</h2>
          </div>
          <div>
            <address className={styles.footerAddress}>
              {FOOTER.address.company}
              <br />
              {FOOTER.address.street}
              <br />
              {FOOTER.address.city}
              <br />
              {FOOTER.address.country}
            </address>
            <p className={styles.footerCopyright}>{FOOTER.copyright}</p>
          </div>
          <div className={styles.footerSocial}>
            {FOOTER.socialLinks.map(link => (
              <a key={link.label} href={link.url}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
