import { Link } from 'react-router-dom';
import styles from './index.module.scss';
import heroBg from '@/assets/images/home/hero-bg.png';
import platformImg from '@/assets/images/home/platform-532331.png';
import logoSvg from '@/assets/images/home/logo.svg';

const CAPABILITIES = ['High-Fidelity Organoids', 'Functional Genomics', 'Deep Phenotyping', 'AI & Data Infrastructure'];

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

export default function HomePage() {
  return (
    <div className={styles.page}>
      {/* Announcement Bar */}
      <div className={styles.announcement}>
        <span>Announcement: Double Award Winner! OrgaNova Receives Industry Recognition</span>
      </div>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBgWrapper}>
          <img src={heroBg} alt="" className={styles.heroBg} />
          <div className={styles.heroGradient} />
        </div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Decoding Cancer</h1>
          <p className={styles.heroDescription}>
            OrgaNova is a new kind of precision oncology company—existing at the intersection of organoid intelligence
            and AI—pioneering functional genomics to create breakthrough therapies.
          </p>
        </div>
      </section>

      {/* Explore CTA (White Transition) */}
      <section className={styles.exploreCta}>
        <Link to="/organoid-intelligence" className={styles.darkOutlineBtn}>
          Explore Organoid Intelligence
        </Link>
      </section>

      {/* Platform Section */}
      <section className={styles.platform}>
        <div className={styles.platformInner}>
          <div className={styles.platformContent}>
            <span className={styles.sectionLabel}>The Platform</span>
            <h2 className={styles.platformTitle}>Moving beyond the genome</h2>
            <p className={styles.platformDescription}>
              The OrgaNova Platform generates functional data at scale across diverse tumor types, representing a
              fundamental shift in drug discovery.
            </p>
            <ul className={styles.capabilities}>
              {CAPABILITIES.map(cap => (
                <li key={cap}>{cap}</li>
              ))}
            </ul>
            <Link to="/platform" className={styles.lightOutlineBtn}>
              Explore Platform
            </Link>
          </div>
          <div className={styles.platformImage}>
            <img src={platformImg} alt="OrgaNova Platform" />
          </div>
        </div>
      </section>

      {/* Capabilities Section (Grey) */}
      <section className={styles.capabilitiesSection}>
        <Link to="/capabilities" className={styles.darkOutlineBtn}>
          Explore Capabilities
        </Link>
      </section>

      {/* Products Section */}
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
