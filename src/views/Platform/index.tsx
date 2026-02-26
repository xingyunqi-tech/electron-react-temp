import { Link } from 'react-router-dom';

import styles from './index.module.scss';
import logoSvg from '@/assets/images/home/logo.svg';

// ==================== Constants ====================

const HERO_TITLE = 'Moving beyond the static genome';

const HERO_DESCRIPTIONS = [
  'The OrgaNova Platform is not just a collection of tools; it is a functional truth engine. While traditional discovery relies on genomic proxies, we rely on biological reality.',
  'By integrating the world\u2019s largest library of living patient avatars with high-throughput in situ interrogation, we expose tumor vulnerabilities that sequencing alone cannot see. We turn the \u201cblack box\u201d of cancer biology into a computable, predictable system.',
];

const ENGINE_TITLE = 'The OrgaNova Engine: An Iterative Loop';

const ENGINE_STEPS = [
  {
    title: 'Reconstruct',
    description: '1,500+ Patient-Derived Organoids retaining native TME.',
  },
  {
    title: 'Interrogate',
    description: 'Massively parallel CRISPR perturbations to force target exposure.',
  },
  {
    title: 'Capture Context',
    description: 'Proprietary TRiC\u2122 technology reads signals in situ without cell isolation.',
  },
  {
    title: 'Decode',
    description: 'AI algorithms predict Mechanism-of-Action (MoA) to guide clinical strategy.',
  },
];

const PLATFORM_DIAGRAM_LABELS = [
  'Organoid 2.0 Modeling',
  'TRiC\u2122 In Situ Screening',
  'AI & Multi-omics Analytics',
  'Functional Genomics',
];

const TECH_SECTIONS = [
  {
    subtitle: 'Reconstructing tumor reality, not just cells',
    body: 'Standard models fail because they are isolated. Our Organoid 2.0 platform\u2014powered by proprietary Air-Liquid Interface (ALI) technology\u2014preserves the native immune microenvironment and stromal architecture. With a library of 1,500+ patient avatars, we test drugs against the full complexity of human biology.',
    imagePosition: 'right' as const,
  },
  {
    subtitle: 'No cell is an island. Context is the cure.',
    body: 'Traditional screening fails because it strips cells of their environment. Our proprietary TRiC\u2122 platform captures functional signals in situ\u2014directly within the native tissue architecture. By preserving the immune and stromal context, we filter out false positives to reveal targets that actually work in the human body.',
    imagePosition: 'right' as const,
  },
  {
    subtitle: 'Moving from \u201cIs it mutated?\u201d to \u201cDoes it matter?',
    body: 'Genomics lists the mutations; we find the drivers. By deploying massive-scale CRISPR and shRNA libraries, we systematically perturb the genome across 2D, 3D, and in vivo models. We force the tumor to reveal its survival dependencies, filtering out noise to identify targets that are functionally essential.',
    imagePosition: 'left' as const,
  },
  {
    subtitle: 'Decoding the invisible logic',
    body: 'Biology is the hardware; AI is the decoder. We integrate multi-omics data\u2014spatial transcriptomics, RNA-seq, and metabolomics\u2014into a unified computational model. Our algorithms predict Mechanism of Action (MoA), turning raw experimental noise into clear, actionable therapeutic strategies.',
    imagePosition: 'center' as const,
  },
  {
    subtitle: 'Translating insight into patient survival.',
    body: 'From Target Discovery to Personalized Precision Medicine, OrgaNova bridges the chasm to clinical reality. Whether identifying novel resistance mechanisms or predicting immunotherapy responses, our platform ensures that the right drug reaches the right patient\u2014turning biological data into life-saving cures.',
    imagePosition: 'left' as const,
  },
];

const CAPABILITIES_CTA_TITLE = 'Translating biological complexity into life-saving certainty';

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

export default function PlatformPage() {
  return (
    <div className={styles.page}>
      {/* Announcement Bar */}
      <div className={styles.announcement}>
        <span>Announcement: Double Award Winner! OrgaNova Receives Industry Recognition</span>
      </div>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBgWrapper}>
          <div className={styles.heroBgPlaceholder} />
          <div className={styles.heroGradientTop} />
          <div className={styles.heroGradientBottom} />
        </div>
        <div className={styles.heroContent}>
          <span className={styles.sectionLabel}>The OrgaNova Platform</span>
          <h1 className={styles.heroTitle}>{HERO_TITLE}</h1>
        </div>
      </section>

      {/* Description Section */}
      <section className={styles.descriptionSection}>
        <div className={styles.descriptionGrid}>
          {HERO_DESCRIPTIONS.map((text, index) => (
            <p key={index} className={styles.descriptionText}>
              {text}
            </p>
          ))}
        </div>
      </section>

      {/* Engine Loop Section */}
      <section className={styles.engineSection}>
        <h2 className={styles.engineTitle}>{ENGINE_TITLE}</h2>
        <div className={styles.engineContent}>
          <div className={styles.engineSteps}>
            {ENGINE_STEPS.map(step => (
              <div key={step.title} className={styles.engineStep}>
                <h3 className={styles.engineStepTitle}>{step.title}</h3>
                <p className={styles.engineStepDescription}>{step.description}</p>
              </div>
            ))}
          </div>
          <div className={styles.engineDiagram}>
            <div className={styles.diagramCircle}>
              <span className={styles.diagramCenter}>The OrgaNova Platform</span>
              {PLATFORM_DIAGRAM_LABELS.map((label, index) => (
                <span key={label} className={`${styles.diagramLabel} ${styles[`diagramLabel${index + 1}`]}`}>
                  {label}
                </span>
              ))}
              <div className={styles.diagramDot1} />
              <div className={styles.diagramDot2} />
              <div className={styles.diagramDot3} />
              <div className={styles.diagramDot4} />
              {/* Decorative image thumbnails */}
              <div className={`${styles.diagramImg} ${styles.diagramImgTopRight}`} />
              <div className={`${styles.diagramImg} ${styles.diagramImgRight}`} />
              <div className={`${styles.diagramImg} ${styles.diagramImgBottom}`} />
              <div className={`${styles.diagramImg} ${styles.diagramImgLeft}`} />
            </div>
          </div>
        </div>
      </section>

      {/* Tech Sections - Alternating Layout */}
      <section className={styles.techSections}>
        {/* Section 1: Organoid 2.0 - image full width background */}
        <div className={styles.techBlock}>
          <div className={styles.techBlockImageFull}>
            <div className={styles.imagePlaceholderWide} />
          </div>
          <div className={styles.techBlockOverlay}>
            <div className={styles.techBlockLeft}>
              <h3 className={styles.techSubtitle}>{TECH_SECTIONS[0].subtitle}</h3>
              <p className={styles.techBody}>{TECH_SECTIONS[0].body}</p>
            </div>
            <div className={styles.techBlockSpacer} />
          </div>
        </div>

        {/* Section 2: TRiC - text left, image block right */}
        <div className={styles.techBlockSplit}>
          <div className={styles.techBlockTextLeft}>
            <h3 className={styles.techSubtitle}>{TECH_SECTIONS[1].subtitle}</h3>
            <p className={styles.techBody}>{TECH_SECTIONS[1].body}</p>
          </div>
          <div className={styles.imagePlaceholderBlock} />
        </div>

        {/* Section 3: Full width image - Functional Genomics */}
        <div className={styles.techBlock}>
          <div className={styles.techBlockImageFull}>
            <div className={styles.imagePlaceholderWide2} />
          </div>
          <div className={styles.techBlockOverlayRight}>
            <div className={styles.techBlockSpacer} />
            <div className={styles.techBlockRight}>
              <h3 className={styles.techSubtitle}>{TECH_SECTIONS[2].subtitle}</h3>
              <p className={styles.techBody}>{TECH_SECTIONS[2].body}</p>
            </div>
          </div>
        </div>

        {/* Section 4: AI Decoding - centered large image */}
        <div className={styles.techBlockCenter}>
          <div className={styles.imagePlaceholderCenter} />
          <div className={styles.techBlockCenterOverlay}>
            <div className={styles.techBlockRight}>
              <h3 className={styles.techSubtitle}>{TECH_SECTIONS[3].subtitle}</h3>
              <p className={styles.techBody}>{TECH_SECTIONS[3].body}</p>
            </div>
          </div>
        </div>

        {/* Section 5: Translational - text left, image block right */}
        <div className={styles.techBlockSplit}>
          <div className={styles.techBlockTextLeft}>
            <h3 className={styles.techSubtitle}>{TECH_SECTIONS[4].subtitle}</h3>
            <p className={styles.techBody}>{TECH_SECTIONS[4].body}</p>
          </div>
          <div className={styles.imagePlaceholderBlock} />
        </div>
      </section>

      {/* Capabilities CTA Section */}
      <section className={styles.capabilitiesCta}>
        <div className={styles.capabilitiesCtaInner}>
          <span className={styles.capabilitiesLabel}>Capabilities</span>
          <h2 className={styles.capabilitiesTitle}>{CAPABILITIES_CTA_TITLE}</h2>
          <div className={styles.capabilitiesArrow}>
            <svg width="56" height="4" viewBox="0 0 56 4" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line y1="2" x2="56" y2="2" stroke="rgba(0,0,0,0.3)" strokeWidth="4" />
            </svg>
          </div>
        </div>
      </section>

      {/* Contact Banner */}
      <section className={styles.contactBanner}>
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
