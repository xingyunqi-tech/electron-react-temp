import { Link } from 'react-router-dom';

import heroBg from '@/assets/images/home/hero-bg.png';
import platformImg from '@/assets/images/home/platform-532331.png';
import AnnouncementBar from '@/components/AnnouncementBar';
import ProductCardsSection from '@/components/ProductCardsSection';
import SiteFooter from '@/components/SiteFooter';

import styles from './index.module.scss';

// ==================== Constants ====================

// Hero Section
const HERO = {
  title: '解码癌症',
  description:
    'OrgaNova 是一家新型精准肿瘤学公司，处于类器官智能与人工智能的交汇点，开创功能基因组学以创造突破性疗法。',
  ctaText: '探索类器官智能',
};

// Platform Section
const PLATFORM_SECTION = {
  label: '平台',
  title: '超越基因组',
  description: 'OrgaNova 平台在多种肿瘤类型中大规模生成功能性数据，代表了药物发现的根本性转变。',
  capabilities: ['高保真类器官', '功能基因组学', '深度表型分析', 'AI 与数据基础设施'],
  ctaText: '探索平台',
};

// Capabilities Section
const CAPABILITIES_CTA_TEXT = '探索能力';

// ==================== Component ====================

export default function HomePage() {
  return (
    <div className={styles.page}>
      <AnnouncementBar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBgWrapper}>
          <img src={heroBg} alt="" className={styles.heroBg} />
          <div className={styles.heroGradient} />
        </div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{HERO.title}</h1>
          <p className={styles.heroDescription}>{HERO.description}</p>
        </div>
      </section>

      {/* Explore CTA (White Transition) */}
      <section className={styles.exploreCta}>
        <Link to="/organoid-intelligence" className={styles.darkOutlineBtn}>
          {HERO.ctaText}
        </Link>
      </section>

      {/* Platform Section */}
      <section className={styles.platform}>
        <div className={styles.platformInner}>
          <div className={styles.platformContent}>
            <span className={styles.sectionLabel}>{PLATFORM_SECTION.label}</span>
            <h2 className={styles.platformTitle}>{PLATFORM_SECTION.title}</h2>
            <p className={styles.platformDescription}>{PLATFORM_SECTION.description}</p>
            <ul className={styles.capabilities}>
              {PLATFORM_SECTION.capabilities.map(cap => (
                <li key={cap}>{cap}</li>
              ))}
            </ul>
            <Link to="/platform" className={styles.lightOutlineBtn}>
              {PLATFORM_SECTION.ctaText}
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
          {CAPABILITIES_CTA_TEXT}
        </Link>
      </section>

      <ProductCardsSection />

      <SiteFooter />
    </div>
  );
}
