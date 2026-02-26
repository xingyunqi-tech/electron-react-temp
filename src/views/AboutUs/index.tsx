import { Link } from 'react-router-dom';
import styles from './index.module.scss';
import logoSvg from '@/assets/images/home/logo.svg';

const INTRO_PARAGRAPHS = [
  'Cancer is far more than a collection of mutations. For too long, we relied on sequencing to find answers, but that was just the tip of the iceberg. We are pioneering Functional Precision Oncology\u2014a revolutionary approach that shifts focus from static genetic lists to dynamic functional behaviors within the native tumor microenvironment.',
  'True breakthroughs require a convergence of worlds. We are a collective of scientists and industry veterans from top institutions (Stanford, Tsinghua, Novartis, Pfizer), united by a single mission: to rebuild the paradigm of target discovery and validation, providing the data foundation for the next generation of \u201CFirst-in-Class\u201D therapies.',
];

const MISSION_PILLARS = [
  {
    title: 'Simulate the clinical reality by retaining the native tumor microenvironment.',
    description:
      'We move beyond plastic. By utilizing high-fidelity patient-derived organoids (PDOs) instead of standard cell lines, we systematically screen and validate key drivers in a \u201Cliving\u201D context, ensuring that what works in our lab actually works in the patient.',
  },
  {
    title: 'Unlock functional targets that genomics alone cannot see.',
    description:
      'We don\u2019t just read the code; we test the function. Leveraging proprietary CRISPR/shRNA tools, we identify the hidden vulnerabilities of tumor progression. We are built to solve the \u201C0 to 1\u201D problem in drug discovery, finding actionable opportunities where others see only noise.',
  },
  {
    title: 'Unite world-class minds from academia and industry.',
    description:
      'Our DNA is a blend of academic rigor and industrial agility. With roots in global research hubs and top pharma giants, our team combines the curiosity to explore unknown mechanisms with the discipline to deliver robust, clinical-grade data.',
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

export default function AboutUsPage() {
  return (
    <div className={styles.page}>
      {/* Announcement Bar */}
      <div className={styles.announcement}>
        <span>Announcement: Double Award Winner! OrgaNova Receives Industry Recognition</span>
      </div>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroLogo}>
          <img src={logoSvg} alt="OrgaNova" />
        </div>
        <h1 className={styles.heroTitle}>Seeing beyond the genome in everything we do.</h1>
        <div className={styles.introColumns}>
          {INTRO_PARAGRAPHS.map((text, index) => (
            <p key={index} className={styles.introParagraph}>
              {text}
            </p>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section className={styles.mission}>
        <div className={styles.missionLeft}>
          <span className={styles.sectionLabel}>OrgaNova: Our Core Mission</span>
          <h2 className={styles.missionSubtitle}>Our consistent drive to make cancer treatment deterministic.</h2>
        </div>
        <div className={styles.missionPillars}>
          {MISSION_PILLARS.map((pillar, index) => (
            <div key={index} className={styles.pillar}>
              <h3 className={styles.pillarTitle}>{pillar.title}</h3>
              <p className={styles.pillarDescription}>{pillar.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* News & Perspectives Section */}
      <section className={styles.newsSection}>
        <div className={styles.newsContent}>
          <span className={styles.newsLabel}>News &amp; Perspectives</span>
          <hr className={styles.newsDivider} />
          <h2 className={styles.newsTitle}>Get the latest updates from our team</h2>
          <Link to="/contact" className={styles.contactLink}>
            Contact
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
