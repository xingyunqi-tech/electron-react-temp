import { Link } from 'react-router-dom';
import styles from './index.module.scss';
import logoSvg from '@/assets/images/home/logo.svg';

const HERO_TITLE = 'The Toolkit for Biological Truth';

const HERO_DESCRIPTION =
  'We don\u2019t just sell reagents; we share our engine. From proprietary OrgaGro\u2122 media systems to high-throughput TRiC\u2122 interrogation kits, OrgaNova provides the standardized infrastructure needed to build, screen, and decode cancer biology in your own lab.';

const PRODUCTS = [
  {
    title: 'OrgaGro\u2122 Media Series',
    description:
      'The nutrient-rich foundation used in our own 1,500+ PDO bank. Optimized for reconstructing high-fidelity Breast, Lung, and Colorectal cancer models in your own lab.',
    link: 'View OrgaGro\u2122 Media Series \u2192',
  },
  {
    title: 'TRiC\u2122 In Situ Kits',
    description:
      'Industry-first functional capture technology. Identify valid targets directly within the native tissue architecture, filtering out artifacts caused by cell isolation.',
    link: 'View TRiC\u2122 In Situ Kits \u2192',
  },
  {
    title: 'OrgaExtract\u2122 Omics Prep',
    description:
      'Specialized extraction solutions for dense 3D organoid matrices. Ensure clinical-grade RNA/DNA recovery quality for downstream AI decoding and sequencing.',
    link: 'View OrgaExtract\u2122 Omics Prep \u2192',
  },
];

const CAPABILITIES_LABEL = 'Capabilites';

const CAPABILITIES_HEADLINE = 'Translating biological complexity into life-saving certainty';

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

export default function ProductsPage() {
  return (
    <div className={styles.page}>
      {/* Announcement Bar */}
      <div className={styles.announcement}>
        <span>Announcement: Double Award Winner! OrgaNova Receives Industry Recognition</span>
      </div>

      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>{HERO_TITLE}</h1>
        <p className={styles.heroDescription}>{HERO_DESCRIPTION}</p>
      </section>

      {/* Product Showcase (White Section) */}
      <section className={styles.showcase}>
        <div className={styles.showcaseImageWrapper}>
          <div className={styles.showcasePlaceholder} />
        </div>
      </section>

      {/* Product Cards Section */}
      <section className={styles.products}>
        <div className={styles.productsInner}>
          <h3 className={styles.productsTitle}>Products</h3>
          <div className={styles.productCards}>
            {PRODUCTS.map(product => (
              <div key={product.title} className={styles.productCard}>
                <h4 className={styles.productName}>{product.title}</h4>
                <p className={styles.productDescription}>{product.description}</p>
                <Link to="/products" className={styles.productLink}>
                  {product.link}
                </Link>
              </div>
            ))}
          </div>
          <Link to="/products" className={styles.darkOutlineBtn}>
            Explore all Products
          </Link>
        </div>
      </section>

      {/* Capabilities CTA Section */}
      <section className={styles.capabilitiesCta}>
        <div className={styles.capabilitiesCtaInner}>
          <span className={styles.capabilitiesLabel}>{CAPABILITIES_LABEL}</span>
          <h2 className={styles.capabilitiesHeadline}>{CAPABILITIES_HEADLINE}</h2>
          <div className={styles.decorativeArrow}>
            <svg width="56" height="4" viewBox="0 0 56 4" fill="none">
              <line x1="0" y1="2" x2="56" y2="2" stroke="rgba(0, 0, 0, 0.3)" strokeWidth="4" />
            </svg>
          </div>
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
        <div className={styles.footerDivider} />
        <div className={styles.footerBottom}>
          <div>
            <h2 className={styles.footerTitle}>OrgaNova</h2>
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
