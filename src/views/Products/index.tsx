import AnnouncementBar from '@/components/AnnouncementBar';
import ProductCardsSection from '@/components/ProductCardsSection';
import SiteFooter from '@/components/SiteFooter';

import styles from './index.module.scss';

// --- Hero ---
const HERO = {
  title: '探索生物真相的工具包',
  description:
    '我们不仅销售试剂，更分享我们的核心引擎。从专有的 OrgaGro™ 培养基系统到高通量 TRiC™ 功能筛查试剂盒，OrgaNova 为您的实验室提供构建、筛选和解码癌症生物学所需的标准化基础设施。',
};

// --- Capabilities CTA ---
const CAPABILITIES_CTA = {
  label: '能力',
  headline: '将生物学复杂性转化为拯救生命的确定性',
};

export default function ProductsPage() {
  return (
    <div className={styles.page}>
      <AnnouncementBar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>{HERO.title}</h1>
        <p className={styles.heroDescription}>{HERO.description}</p>
      </section>

      {/* Product Showcase (White Section) */}
      <section className={styles.showcase}>
        <div className={styles.showcaseImageWrapper}>
          <div className={styles.showcasePlaceholder} />
        </div>
      </section>

      <ProductCardsSection ctaText="浏览全部产品" />

      {/* Capabilities CTA Section */}
      <section className={styles.capabilitiesCta}>
        <div className={styles.capabilitiesCtaInner}>
          <span className={styles.capabilitiesLabel}>{CAPABILITIES_CTA.label}</span>
          <h2 className={styles.capabilitiesHeadline}>{CAPABILITIES_CTA.headline}</h2>
          <div className={styles.decorativeArrow}>
            <svg width="56" height="4" viewBox="0 0 56 4" fill="none">
              <line x1="0" y1="2" x2="56" y2="2" stroke="rgba(0, 0, 0, 0.3)" strokeWidth="4" />
            </svg>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
