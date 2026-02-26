import { Link } from 'react-router-dom';

import styles from './index.module.scss';
import logoSvg from '@/assets/images/home/logo.svg';

const NEWS_ARTICLES = [
  {
    category: '公司新闻',
    date: '2025年3月13日',
    headline: '双料荣誉：OrgaNova 在上海第五届类器官与药物开发峰会上荣获"技术突破"和"行业之选"两项大奖。',
  },
  {
    category: '公司新闻',
    date: '2025年3月13日',
    headline: '双料荣誉：OrgaNova 在上海第五届类器官与药物开发峰会上荣获"技术突破"和"行业之选"两项大奖。',
  },
  {
    category: '研究成果',
    date: '2025年2月28日',
    headline: 'OrgaNova 在《自然·生物技术》发表里程碑研究，展示高保真结直肠癌类器官与患者肿瘤基因组一致性达95%。',
  },
  {
    category: '平台更新',
    date: '2025年2月10日',
    headline: 'AI 驱动表型分析引擎 v3.0 发布：全新深度学习模型实现 OrgaNova 平台上12种肿瘤类型的实时形态学分析。',
  },
  {
    category: '合作伙伴',
    date: '2025年1月22日',
    headline: 'OrgaNova 与领先药企达成战略合作，推动基于功能基因组学的罕见肿瘤药物发现。',
  },
  {
    category: '公司新闻',
    date: '2025年1月8日',
    headline: 'OrgaNova PDO 生物样本库扩展至超过1,500个模型，覆盖15种主要癌症类型，为精准肿瘤学研究奠定坚实基础。',
  },
];

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

// Announcement
const ANNOUNCEMENT_TEXT = '公告：双料获奖！OrgaNova 荣获行业认可';

// Hero section
const HERO = {
  title: '新闻与观点',
  subtitle: '获取我们团队在前沿研究、行业洞察以及公司新闻与活动方面的最新动态。',
};

// News card
const READ_MORE_TEXT = '阅读更多';

// Contact section
const CONTACT_SECTION = {
  label: '联系我们',
  title: '与我们取得联系',
  ctaText: '联系我们',
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

export default function NewsPage() {
  return (
    <div className={styles.page}>
      {/* Announcement Bar */}
      <div className={styles.announcement}>
        <span>{ANNOUNCEMENT_TEXT}</span>
      </div>

      {/* Hero Header */}
      <section className={styles.heroHeader}>
        <h1 className={styles.pageTitle}>{HERO.title}</h1>
        <p className={styles.pageSubtitle}>{HERO.subtitle}</p>
      </section>

      {/* Divider */}
      <div className={styles.sectionDivider} />

      {/* News List */}
      <section className={styles.newsList}>
        {NEWS_ARTICLES.map((article, index) => (
          <article key={index} className={styles.newsCard}>
            <div className={styles.cardLeft}>
              <span className={styles.categoryTag}>{article.category}</span>
            </div>
            <div className={styles.cardRight}>
              <div className={styles.cardMeta}>
                <span className={styles.categoryLabel}>{article.category}</span>
                <span className={styles.articleDate}>{article.date}</span>
              </div>
              <h2 className={styles.articleHeadline}>{article.headline}</h2>
              <div className={styles.readMoreRow}>
                <a href="#" className={styles.readMore}>
                  {READ_MORE_TEXT}
                </a>
                <span className={styles.readMoreArrow}>&rarr;</span>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Contact Section */}
      <section className={styles.contactSection}>
        <span className={styles.contactLabel}>{CONTACT_SECTION.label}</span>
        <div className={styles.contactDivider} />
        <h2 className={styles.contactTitle}>{CONTACT_SECTION.title}</h2>
        <Link to="/contact" className={styles.contactLink}>
          {CONTACT_SECTION.ctaText}
        </Link>
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
            {FOOTER.socialLinks.map(link => (
              <a key={link.label} href={link.url}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
