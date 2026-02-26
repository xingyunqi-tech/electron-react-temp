import { Link } from 'react-router-dom';
import styles from './index.module.scss';
import logoSvg from '@/assets/images/home/logo.svg';

// --- Announcement ---
const ANNOUNCEMENT_TEXT = '公告：双料获奖！OrgaNova 荣获行业认可';

// --- Hero ---
const HERO = {
  title: '我们所做的一切，皆超越基因组。',
  introParagraphs: [
    '癌症远不止是基因突变的集合。长期以来，我们依赖测序寻找答案，但那只是冰山一角。我们正在开创功能性精准肿瘤学——一种革命性的方法，将关注点从静态基因列表转向原生肿瘤微环境中的动态功能行为。',
    '真正的突破需要多领域的融合。我们是一支由顶尖机构（斯坦福、清华、诺华、辉瑞）的科学家和行业资深专家组成的团队，肩负统一使命：重构靶点发现与验证的范式，为下一代"First-in-Class"疗法提供数据基础。',
  ],
};

// --- Mission ---
const MISSION = {
  label: 'OrgaNova：我们的核心使命',
  subtitle: '我们始终致力于让癌症治疗变得确定可控。',
  pillars: [
    {
      title: '保留原生肿瘤微环境，模拟真实临床场景。',
      description:
        '我们超越传统培养皿。通过使用高保真度的患者来源类器官（PDO）替代标准细胞系，我们在"活体"环境中系统性地筛选和验证关键驱动因子，确保实验室中有效的方案在患者身上同样有效。',
    },
    {
      title: '解锁基因组学无法发现的功能性靶点。',
      description:
        '我们不仅解读代码，更验证功能。利用专有的 CRISPR/shRNA 工具，我们发现肿瘤进展中隐藏的脆弱靶点。我们致力于解决药物发现中的"从 0 到 1"难题，在他人只看到噪声的地方发现可执行的治疗机会。',
    },
    {
      title: '汇聚学术界与产业界的世界级人才。',
      description:
        '我们的基因融合了学术严谨与产业敏捷。团队成员根植于全球顶尖研究机构和头部制药企业，将探索未知机制的好奇心与交付稳健、临床级数据的执行力完美结合。',
    },
  ],
};

// --- News Section ---
const NEWS_SECTION = {
  label: '新闻与观点',
  title: '获取团队的最新动态',
  ctaText: '联系我们',
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
  title: '解码癌症',
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

export default function AboutUsPage() {
  return (
    <div className={styles.page}>
      {/* Announcement Bar */}
      <div className={styles.announcement}>
        <span>{ANNOUNCEMENT_TEXT}</span>
      </div>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroLogo}>
          <img src={logoSvg} alt="OrgaNova" />
        </div>
        <h1 className={styles.heroTitle}>{HERO.title}</h1>
        <div className={styles.introColumns}>
          {HERO.introParagraphs.map((text, index) => (
            <p key={index} className={styles.introParagraph}>
              {text}
            </p>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section className={styles.mission}>
        <div className={styles.missionLeft}>
          <span className={styles.sectionLabel}>{MISSION.label}</span>
          <h2 className={styles.missionSubtitle}>{MISSION.subtitle}</h2>
        </div>
        <div className={styles.missionPillars}>
          {MISSION.pillars.map((pillar, index) => (
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
          <span className={styles.newsLabel}>{NEWS_SECTION.label}</span>
          <hr className={styles.newsDivider} />
          <h2 className={styles.newsTitle}>{NEWS_SECTION.title}</h2>
          <Link to="/contact" className={styles.contactLink}>
            {NEWS_SECTION.ctaText}
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
