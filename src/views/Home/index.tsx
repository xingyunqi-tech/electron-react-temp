import { Link } from 'react-router-dom';
import styles from './index.module.scss';
import heroBg from '@/assets/images/home/hero-bg.png';
import platformImg from '@/assets/images/home/platform-532331.png';
import logoSvg from '@/assets/images/home/logo.svg';

// ==================== Constants ====================

// Announcement
const ANNOUNCEMENT_TEXT = '公告：双奖得主！OrgaNova 荣获行业认可';

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

// Products Section
const PRODUCTS_SECTION = {
  title: '产品',
  ctaText: '探索全部产品',
  items: [
    {
      title: 'OrgaGro\u2122 培养基系列',
      description:
        '我们自有 1,500+ PDO 库所使用的营养丰富的基础培养基。针对在您自己的实验室中重建高保真乳腺癌、肺癌和结直肠癌模型进行了优化。',
      link: '查看 OrgaGro\u2122 培养基系列 \u2192',
    },
    {
      title: 'TRiC\u2122 原位检测试剂盒',
      description: '行业首创的功能捕获技术。直接在原生组织结构中识别有效靶点，过滤因细胞分离引起的伪影。',
      link: '查看 TRiC\u2122 原位检测试剂盒 \u2192',
    },
    {
      title: 'OrgaExtract\u2122 组学制备',
      description: '专为致密 3D 类器官基质设计的提取解决方案。确保临床级 RNA/DNA 回收质量，用于下游 AI 解码和测序。',
      link: '查看 OrgaExtract\u2122 组学制备 \u2192',
    },
  ],
};

// Navigation
const NAV = {
  primary: [
    { label: '类器官智能', path: '/organoid-intelligence' },
    { label: '平台', path: '/platform' },
    { label: '能力', path: '/capabilities' },
    { label: '产品', path: '/products' },
    { label: '关于我们', path: '/about-us' },
  ],
  secondary: [
    { label: '新闻与观点', path: '/news' },
    { label: '联系我们', path: '/contact' },
  ],
};

// Footer
const FOOTER = {
  title: '解码癌症',
  address: {
    company: 'OrgaNova',
    street: '1610 Cinnamon Lane',
    city: 'Texas, TX 78212',
    country: 'United States',
  },
  copyright: 'OrgaNova \u00a9 2026. 版权所有。',
  socialLinks: [
    { label: 'LinkedIn', url: '#' },
    { label: 'X', url: '#' },
    { label: 'YouTube', url: '#' },
  ],
};

// ==================== Component ====================

export default function HomePage() {
  return (
    <div className={styles.page}>
      {/* Announcement Bar */}
      <div className={styles.announcement}>
        <span>{ANNOUNCEMENT_TEXT}</span>
      </div>

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

      {/* Products Section */}
      <section className={styles.products}>
        <div className={styles.productsInner}>
          <h3 className={styles.productsTitle}>{PRODUCTS_SECTION.title}</h3>
          <div className={styles.productCards}>
            {PRODUCTS_SECTION.items.map(product => (
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
            {PRODUCTS_SECTION.ctaText}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
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
    </div>
  );
}
