import { useState } from 'react';
import { Link } from 'react-router-dom';

import logoSvg from '@/assets/images/home/logo.svg';

import styles from './index.module.scss';

const TABS = [
  { key: 'clinical', label: 'Clinical Precision' },
  { key: 'pharma', label: 'Pharma Solutions' },
  { key: 'academia', label: 'For Academia' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

interface TabContent {
  subtitle: string;
  description: string;
  cards: { title: string; body: string }[];
}

const TAB_CONTENT: Record<TabKey, TabContent> = {
  clinical: {
    subtitle: 'De-risking the pipeline with clinical reality',
    description:
      'From "Probabilistic" to "Deterministic". Genomics can only predict what might happen. Functional data reveals what will happen. By deploying our proprietary Organoid 2.0 and TRiC\u2122 technologies upstream, we replace the uncertainty of preclinical guesses with the biological truth of patient-derived models. We don\u2019t just screen drugs; we validate them in a living context that mirrors the human body.',
    cards: [
      {
        title: 'Immuno-Oncology Ready',
        body: 'Our Air-Liquid Interface (ALI) system generates models that retain the native immune microenvironment. Unlike standard models, Organoid 2.0 enables precise evaluation of immune checkpoint inhibitors (e.g., PD-1/PD-L1) and combination therapies, bridging the gap between petri dish and patient response.',
      },
      {
        title: 'Artifact-Free Target Discovery',
        body: 'The TRiC\u2122 In Situ Platform identifies targets directly within fresh tissue architecture. By eliminating the cellular stress of isolation, we filter out false positives (artifacts) common in traditional screening, ensuring your leads are biologically valid from day one.',
      },
      {
        title: 'Massive-Scale Screening Capacity',
        body: 'Validate your assets against a library of 1,600+ clinical drugs and diverse patient phenotypes. Our high-throughput capabilities allow for rapid stratification of patient populations and early identification of resistance mechanisms, significantly accelerating your Go/No-Go decisions.',
      },
    ],
  },
  pharma: {
    subtitle: 'Redefining Preclinical Certainty',
    description:
      'The Problem: 90% of oncology drugs fail because preclinical models lack patient relevance.\nOur Solution: We deploy a "Digital Twin" strategy. By testing on our 1,500+ patient-derived models, we filter out failures early, ensuring only the most robust candidates reach the clinic.',
    cards: [
      {
        title: 'Population-Scale Biobanking',
        body: 'Diverse Patient Avatars. Leverage our proprietary biobank of 1,500+ patient-derived organoids (PDOs). Spanning major indications (Lung, Liver, Colorectal) and rare, our standardized biobank allows you to test efficacy across diverse patient populations, not just a few cell lines.',
      },
      {
        title: 'In Situ Discovery & Screening',
        body: 'TRiC\u2122 Discovery Engine. Unlock novel targets hidden in the 3D structure. Combining AI-driven algorithms with our TRiC\u2122 In Situ platform, we identify functional targets directly within the native tissue. Our high-throughput screening creates a feedback loop, validating candidates against Chemotherapy, Targeted, and Immuno-therapies with clinical consistency.',
      },
      {
        title: 'Holistic Validation: Efficacy, Toxicity & MoA',
        body: 'Deep Mechanistic Decoding. It\u2019s not just about "what works," but "how" and "if it\u2019s safe." We run parallel Efficacy & Toxicity evaluations to predict the therapeutic window early. Furthermore, our multi-omics approach decodes the Mechanism of Action (MoA), providing the biological evidence needed for IND applications.',
      },
    ],
  },
  academia: {
    subtitle: 'Accelerating Discovery with Clinical Truth',
    description:
      'The Problem: Breakthrough hypotheses are often limited by poor models. Standard cell lines lack the heterogeneity and immune context required for high-impact publications.\nOur Solution: We open our engine to the scientific community. We act as an extension of your lab, providing the proprietary models and deep multi-omics data needed to validate your mechanisms in the real world.',
    cards: [
      {
        title: 'Exclusive Biobank Access',
        body: 'Access the world\u2019s most comprehensive library of 1,500+ Patient-Derived Organoids, including rare cancers and complex metastatic models. Crucially, we offer paired healthy/tumor tissues, providing the rigorous biological controls essential for top-tier journals.',
      },
      {
        title: 'Immune Dynamic Monitoring & Multi-omics',
        body: 'Go beyond static data. Our platform performs Immune Dynamic Monitoring to map the real-time response of the tumor microenvironment. Combined with deep multi-omics (transcriptomics & proteomics), we turn your experiments into comprehensive mechanistic insights.',
      },
      {
        title: 'Bespoke Modeling & One-Stop Solutions',
        body: 'From specific gene-edited models (PDOX) to mouse co-culture systems. Our "One-Stop" scientific solution handles everything from experimental design to visual analytics, tailoring bespoke organoid models to fit your specific research hypothesis.',
      },
    ],
  },
};

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

export default function CapabilitiesPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('clinical');

  const currentContent = TAB_CONTENT[activeTab];

  return (
    <div className={styles.page}>
      {/* Announcement Bar */}
      <div className={styles.announcement}>
        <span>Announcement: Double Award Winner! OrgaNova Receives Industry Recognition</span>
      </div>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Translating biological complexity into life-saving certainty</h1>
          <div className={styles.heroColumns}>
            <div className={styles.heroLeft}>
              <p className={styles.heroDescription}>
                A unified engine driven by functional truth. OrgaNova breaks the silos between research and clinic. By
                leveraging our world-class library of 1,500+ patient-derived organoids and proprietary TRiC&#8482;
                technology, we provide a single source of biological truth that powers every stage of the medical value
                chain.
              </p>
            </div>
            <div className={styles.heroRight}>
              <p className={styles.heroSubtext}>
                Empowering the full continuum of care. Whether accelerating drug discovery for biopharma, enabling
                precision medicine for clinicians, or advancing basic research for scientists, our mission is
                consistent: to ensure that the right treatment reaches the right patient, faster than ever before.
              </p>
            </div>
          </div>
          <p className={styles.heroStatement}>From Bench to Bedside, Powered by Truth.</p>
          <p className={styles.heroBridge}>
            Biological complexity is the barrier. OrgaNova is the bridge. By deploying our Organoid Intelligence engine
            across three critical dimensions, we ensure that every discovery in the lab translates into a victory in the
            clinic.
          </p>
        </div>
      </section>

      {/* Tabs Section */}
      <section className={`${styles.tabSection} ${activeTab === 'academia' ? styles.tabSectionGrey : ''}`}>
        {/* Tab Header */}
        <div className={styles.tabHeader}>
          <div className={styles.tabNav}>
            {TABS.map(tab => (
              <button
                key={tab.key}
                className={`${styles.tabButton} ${activeTab === tab.key ? styles.tabButtonActive : ''} ${tab.key === 'academia' ? styles.tabButtonDark : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <h2 className={`${styles.tabSubtitle} ${activeTab === 'academia' ? styles.textDark : ''}`}>
            {currentContent.subtitle}
          </h2>
        </div>

        {/* Tab Description */}
        <p className={`${styles.tabDescription} ${activeTab === 'academia' ? styles.textDark : ''}`}>
          {currentContent.description}
        </p>

        {/* Tab Cards */}
        <div className={styles.tabCards}>
          {currentContent.cards.map(card => (
            <div key={card.title} className={styles.tabCard}>
              <h3 className={`${styles.tabCardTitle} ${activeTab === 'academia' ? styles.textDark : ''}`}>
                {card.title}
              </h3>
              <p className={`${styles.tabCardBody} ${activeTab === 'academia' ? styles.textDark : ''}`}>{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Toolkit Section */}
      <section className={styles.toolkit}>
        <h2 className={styles.toolkitTitle}>The Toolkit for Biological Truth</h2>
        <Link to="/contact" className={styles.contactLink}>
          Contact
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
