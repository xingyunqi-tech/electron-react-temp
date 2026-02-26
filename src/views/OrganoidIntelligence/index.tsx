import { Link } from 'react-router-dom';
import styles from './index.module.scss';
import logoSvg from '@/assets/images/home/logo.svg';

// ==================== Constants & Mock Data ====================

const ANNOUNCEMENT_TEXT = 'Announcement: Double Award Winner! OrgaNova Receives Industry Recognition';

const HERO_LABEL = 'Organoid Intelligence';

const HERO_TITLE = 'Decoding cancer with precision we never thought possible.';

const HERO_ASIDE_TITLE = 'What if...clinical trials didn\u2019t have to be the first real test of efficacy?';

const HERO_ASIDE_BODY =
  'Now we see.\nBy building huge libraries of Patient-Derived Organoids (PDOs), we create digital avatars that mirror human biology.';

const INTRO_LEFT_TEXT =
  'We\u2019ve put technology to work to interrogate tumors in ways that genomics alone never could.';

const INTRO_RIGHT_STATEMENT = 'It turns out... The genetic blueprint does not guarantee the biological outcome.';

const INTRO_RIGHT_BODY = [
  'By training the OrgaNova Platform on our proprietary library of 1,500+ patient-derived organoids\u2014supplemented with high-throughput CRISPR functional perturbation data\u2014we can learn the deterministic rules governing how specific tumor architectures respond to therapeutic intervention.',
  'By training the OrgaNova Platform on our proprietary library of 1,500+ patient-derived organoids\u2014supplemented with high-throughput CRISPR functional perturbation data\u2014we can learn the deterministic rules governing how specific tumor architectures respond to therapeutic intervention.',
  'We call this innovation Organoid Intelligence.',
];

const DETAIL_CARDS = [
  {
    title: 'High-Fidelity Biological Avatars',
    description:
      'Standard models fail because they lack context. Our Organoid 2.0 systems retain the original tumor microenvironment (TME) and immune interactions. From drug sensitivity testing (IC50/AUC) to complex immune co-culture, we ensure the data fed into our AI is clinically relevant from day one.',
  },
  {
    title: 'The Interrogation',
    description:
      'Utilizing our proprietary TRIC platform, we perform direct target discovery within the native tissue structure. By applying CRISPR/shRNA perturbations in situ, we filter out false positives caused by cell isolation, identifying hidden targets that drive tumor survival in the real world',
  },
  {
    title: 'The Decoding',
    description:
      'Our deep learning algorithms ingest RNA-seq, spatial transcriptomics, and metabolomics data to map the invisible networks of disease. We translate raw experimental signals into clear Mechanism-of-Action (MoA) predictions, accelerating the journey from Hit to Lead.',
  },
];

const INSIGHTS_HEADING = 'Generating insights unlike anything that exists today.';

const DEMOCRATIZING_TITLE = 'Democratizing Discovery';

const DEMOCRATIZING_BODY = [
  'We believe Organoid Intelligence should be accessible to every pioneer. Unlike traditional CROs that offer rigid menus, OrgaNova operates as an extension of your R&D team. Whether you are a biotech startup needing target validation or a pharma giant seeking pipeline expansion, our platform adapts to your science.',
  'Co-Development: Jointly developing novel models or targets with shared IP.',
  'End-to-End Service: From experimental design to visual analytics reports.',
  'Data Integration: AI-powered analysis of your existing sequencing data.',
];

const PLATFORM_LABEL = 'Platform';

const PLATFORM_TITLE = 'Moving beyond the static genome';

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

export default function OrganoidIntelligencePage() {
  return (
    <div className={styles.page}>
      {/* Announcement Bar */}
      <div className={styles.announcement}>
        <span>{ANNOUNCEMENT_TEXT}</span>
      </div>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBgWrapper}>
          <div className={styles.heroBgPlaceholder} />
          <div className={styles.heroGradientTop} />
          <div className={styles.heroGradientBottom} />
        </div>

        {/* Hero Content */}
        <div className={styles.heroContent}>
          <div className={styles.heroLabelRow}>
            <span className={styles.heroLabel}>{HERO_LABEL}</span>
            <h1 className={styles.heroTitle}>{HERO_TITLE}</h1>
          </div>
        </div>

        {/* Hero Aside (bottom-right of hero) */}
        <div className={styles.heroAside}>
          <h2 className={styles.heroAsideTitle}>{HERO_ASIDE_TITLE}</h2>
          <p className={styles.heroAsideBody}>
            {HERO_ASIDE_BODY.split('\n').map((line, i) => (
              <span key={i}>
                {line}
                {i < HERO_ASIDE_BODY.split('\n').length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>
      </section>

      {/* Intro Section (black bg, two columns) */}
      <section className={styles.intro}>
        <div className={styles.introLeft}>
          <p className={styles.introLeftText}>{INTRO_LEFT_TEXT}</p>
        </div>
        <div className={styles.introRight}>
          <h3 className={styles.introRightStatement}>{INTRO_RIGHT_STATEMENT}</h3>
          <div className={styles.introRightBody}>
            {INTRO_RIGHT_BODY.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Details Section (black bg, split layout) */}
      <section className={styles.details}>
        <div className={styles.detailsLeft}>
          <p className={styles.insightsHeading}>{INSIGHTS_HEADING}</p>
        </div>
        <div className={styles.detailsRight}>
          {DETAIL_CARDS.map(card => (
            <div key={card.title} className={styles.detailCard}>
              <h4 className={styles.detailCardTitle}>{card.title}</h4>
              <p className={styles.detailCardDescription}>{card.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Democratizing Section (white bg) */}
      <section className={styles.democratizing}>
        <div className={styles.democratizingLeft}>
          <h2 className={styles.democratizingTitle}>{DEMOCRATIZING_TITLE}</h2>
        </div>
        <div className={styles.democratizingRight}>
          {DEMOCRATIZING_BODY.map((paragraph, i) => (
            <p key={i} className={styles.democratizingParagraph}>
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* Illustration Placeholder */}
      <section className={styles.illustration}>
        <div className={styles.illustrationPlaceholder} />
      </section>

      {/* Platform Section (white bg) */}
      <section className={styles.platform}>
        <div className={styles.platformInner}>
          <span className={styles.platformLabel}>{PLATFORM_LABEL}</span>
          <Link to="/platform" className={styles.platformRow}>
            <h2 className={styles.platformTitle}>{PLATFORM_TITLE}</h2>
            <span className={styles.platformArrow} />
            <div className={styles.platformTriangle} />
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
