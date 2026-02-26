import { Link } from 'react-router-dom';
import styles from './index.module.scss';
import logoSvg from '@/assets/images/home/logo.svg';

// --- Announcement ---
const ANNOUNCEMENT_TEXT = '公告：双料获奖！OrgaNova 荣获行业认可';

// --- Hero ---
const HERO = {
  title: '探索生物真相的工具包',
  description:
    '我们不仅销售试剂，更分享我们的核心引擎。从专有的 OrgaGro™ 培养基系统到高通量 TRiC™ 功能筛查试剂盒，OrgaNova 为您的实验室提供构建、筛选和解码癌症生物学所需的标准化基础设施。',
};

// --- Products Section ---
const PRODUCTS_SECTION = {
  title: '产品',
  ctaText: '浏览全部产品',
  items: [
    {
      title: 'OrgaGro™ 培养基系列',
      description:
        '我们自有 1,500+ PDO 库所使用的营养基础培养基。专为在您的实验室中构建高保真度的乳腺癌、肺癌和结直肠癌模型而优化。',
      link: '查看 OrgaGro™ 培养基系列 →',
    },
    {
      title: 'TRiC™ 原位检测试剂盒',
      description: '业界首创的功能性捕获技术。在原生组织结构中直接鉴定有效靶点，过滤因细胞分离产生的伪影。',
      link: '查看 TRiC™ 原位检测试剂盒 →',
    },
    {
      title: 'OrgaExtract™ 组学制备',
      description: '专为高密度 3D 类器官基质设计的提取方案。确保临床级 RNA/DNA 回收质量，满足下游 AI 解码和测序需求。',
      link: '查看 OrgaExtract™ 组学制备 →',
    },
  ],
};

// --- Capabilities CTA ---
const CAPABILITIES_CTA = {
  label: '能力',
  headline: '将生物学复杂性转化为拯救生命的确定性',
};

// --- Navigation ---
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

// --- Footer ---
const FOOTER = {
  title: 'OrgaNova',
  address: {
    company: 'OrgaNova',
    street: '1610 Cinnamon Lane',
    city: 'Texas, TX 78212',
    country: 'United States',
  },
  copyright: `OrgaNova \u00a9 2026. 版权所有。`,
  socialLinks: [
    { label: 'LinkedIn', url: '#' },
    { label: 'X', url: '#' },
    { label: 'YouTube', url: '#' },
  ],
};

export default function ProductsPage() {
  return (
    <div className={styles.page}>
      {/* Announcement Bar */}
      <div className={styles.announcement}>
        <span>{ANNOUNCEMENT_TEXT}</span>
      </div>

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

      {/* Product Cards Section */}
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
        <div className={styles.footerDivider} />
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
