import { useState } from 'react';
import { Link } from 'react-router-dom';

import logoSvg from '@/assets/images/home/logo.svg';

import styles from './index.module.scss';

const NAV_LINKS = [
  { label: 'Organoid Intelligence', path: '/organoid-intelligence' },
  { label: 'Platform', path: '/platform' },
  { label: 'Capabilities', path: '/capabilities' },
  { label: 'Products', path: '/products' },
  { label: 'About us', path: '/about-us' },
];

const SECONDARY_NAV_LINKS = [
  { label: 'News & Perspectives', path: '/news' },
  { label: 'Contact', path: '/contact' },
];

const CONTACT_HEADING = 'Contact';

const CONTACT_SUBTITLE = 'Ready to decode the future of cancer? Get in touch.';

const FORM_FIELDS = {
  firstName: 'First Name',
  lastName: 'Last Name',
  email: 'Email Address',
  message: 'Message',
} as const;

const FOOTER_ADDRESS = {
  company: 'OrgaNova',
  street: '1610 Cinnamon Lane',
  city: 'Texas, TX 78212',
  country: 'United States',
};

const SOCIAL_LINKS = ['LinkedIn', 'X', 'YouTube'];

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
        <span>Announcement: Double Award Winner! OrgaNova Receives Industry Recognition</span>
      </div>

      {/* Contact Form Section */}
      <section className={styles.contactSection}>
        <div className={styles.contactContent}>
          <h1 className={styles.contactTitle}>{CONTACT_HEADING}</h1>
          <p className={styles.contactSubtitle}>{CONTACT_SUBTITLE}</p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formRow}>
              <div className={styles.formField}>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder={FORM_FIELDS.firstName}
                  value={formData.firstName}
                  onChange={handleChange('firstName')}
                />
              </div>
              <div className={styles.formField}>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder={FORM_FIELDS.lastName}
                  value={formData.lastName}
                  onChange={handleChange('lastName')}
                />
              </div>
            </div>

            <div className={styles.formFieldFull}>
              <input
                type="email"
                className={styles.formInput}
                placeholder={FORM_FIELDS.email}
                value={formData.email}
                onChange={handleChange('email')}
              />
            </div>

            <div className={styles.formFieldFull}>
              <textarea
                className={`${styles.formInput} ${styles.formTextarea}`}
                placeholder={FORM_FIELDS.message}
                value={formData.message}
                onChange={handleChange('message')}
                rows={4}
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              Submit
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerNav}>
          <img src={logoSvg} alt="OrgaNova" className={styles.logo} />
          <div className={styles.navLinks}>
            {NAV_LINKS.map(link => (
              <Link key={link.label} to={link.path} className={styles.navLink}>
                {link.label}
              </Link>
            ))}
            <span className={styles.navDivider} />
            {SECONDARY_NAV_LINKS.map(link => (
              <Link key={link.label} to={link.path} className={styles.navLink}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className={styles.footerBottom}>
          <div>
            <h2 className={styles.footerTitle}>Decoding Cancer</h2>
          </div>
          <div>
            <address className={styles.footerAddress}>
              {FOOTER_ADDRESS.company}
              <br />
              {FOOTER_ADDRESS.street}
              <br />
              {FOOTER_ADDRESS.city}
              <br />
              {FOOTER_ADDRESS.country}
            </address>
            <p className={styles.footerCopyright}>OrgaNova &copy; 2026. All&nbsp;Rights&nbsp;Reserved.</p>
          </div>
          <div className={styles.footerSocial}>
            {SOCIAL_LINKS.map(link => (
              <a key={link} href="#">
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
