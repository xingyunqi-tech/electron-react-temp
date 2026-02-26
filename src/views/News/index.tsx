import { Link } from 'react-router-dom';

import styles from './index.module.scss';
import logoSvg from '@/assets/images/home/logo.svg';

const NEWS_ARTICLES = [
  {
    category: 'Company News',
    date: 'March 13, 2025',
    headline:
      'Double Honors: OrgaNova Recognized with "Technological Breakthrough" and "Industry Choice" Awards at the 5th Annual Organoid & Drug Development Summit in Shanghai.',
  },
  {
    category: 'Company News',
    date: 'March 13, 2025',
    headline:
      'Double Honors: OrgaNova Recognized with "Technological Breakthrough" and "Industry Choice" Awards at the 5th Annual Organoid & Drug Development Summit in Shanghai.',
  },
  {
    category: 'Research',
    date: 'February 28, 2025',
    headline:
      'OrgaNova Publishes Landmark Study on High-Fidelity Colorectal Cancer Organoids in Nature Biotechnology, Demonstrating 95% Genomic Concordance with Patient Tumors.',
  },
  {
    category: 'Platform Update',
    date: 'February 10, 2025',
    headline:
      'AI-Powered Phenotyping Engine v3.0 Released: New Deep Learning Models Enable Real-Time Morphological Analysis Across 12 Tumor Types in the OrgaNova Platform.',
  },
  {
    category: 'Partnership',
    date: 'January 22, 2025',
    headline:
      'OrgaNova Enters Strategic Collaboration with Leading Pharma Partner to Advance Functional Genomics-Driven Drug Discovery for Rare Oncology Indications.',
  },
  {
    category: 'Company News',
    date: 'January 8, 2025',
    headline:
      'OrgaNova Expands PDO Biobank to Over 1,500 Models, Covering 15 Major Cancer Types, Strengthening the Foundation for Precision Oncology Research.',
  },
];

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

export default function NewsPage() {
  return (
    <div className={styles.page}>
      {/* Announcement Bar */}
      <div className={styles.announcement}>
        <span>Announcement: Double Award Winner! OrgaNova Receives Industry Recognition </span>
      </div>

      {/* Hero Header */}
      <section className={styles.heroHeader}>
        <h1 className={styles.pageTitle}>News & Perspectives</h1>
        <p className={styles.pageSubtitle}>
          Get the latest updates from our team on new research, thought leadership, and company news and events.
        </p>
      </section>

      {/* Divider */}
      <div className={styles.sectionDivider} />

      {/* News List */}
      <section className={styles.newsList}>
        {NEWS_ARTICLES.map((article, index) => (
          <article key={index} className={styles.newsCard}>
            <div className={styles.cardLeft}>
              <span className={styles.categoryTag}>{article.category}</span>
            </div>
            <div className={styles.cardRight}>
              <div className={styles.cardMeta}>
                <span className={styles.categoryLabel}>{article.category}</span>
                <span className={styles.articleDate}>{article.date}</span>
              </div>
              <h2 className={styles.articleHeadline}>{article.headline}</h2>
              <div className={styles.readMoreRow}>
                <a href="#" className={styles.readMore}>
                  Read more
                </a>
                <span className={styles.readMoreArrow}>&rarr;</span>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Contact Section */}
      <section className={styles.contactSection}>
        <span className={styles.contactLabel}>Contact</span>
        <div className={styles.contactDivider} />
        <h2 className={styles.contactTitle}>Get in touch</h2>
        <Link to="/contact" className={styles.contactLink}>
          Contact
        </Link>
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
              OrgaNova
              <br />
              1610 Cinnamon Lane
              <br />
              Texas, TX 78212
              <br />
              United States
            </address>
            <p className={styles.footerCopyright}>OrgaNova &copy; 2026. All&nbsp;Rights&nbsp;Reserved.</p>
          </div>
          <div className={styles.footerSocial}>
            <a href="#">LinkedIn</a>
            <a href="#">X</a>
            <a href="#">YouTube</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
