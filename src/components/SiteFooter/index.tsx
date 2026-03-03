import { Link } from 'react-router-dom';

import logoSvg from '@/assets/images/home/logo.svg';
import { FOOTER, NAV } from '@/constants/site';

import styles from './index.module.scss';

interface SiteFooterProps {
  className?: string;
}

export default function SiteFooter({ className }: SiteFooterProps) {
  return (
    <footer className={`${styles.footer}${className ? ` ${className}` : ''}`}>
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
          {FOOTER.socialLinks.map(social => (
            <a key={social.label} href={social.url}>
              {social.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
