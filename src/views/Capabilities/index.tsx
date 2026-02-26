import { useState } from 'react';
import { Link } from 'react-router-dom';

import logoSvg from '@/assets/images/home/logo.svg';

import styles from './index.module.scss';

// ==================== Constants ====================

const ANNOUNCEMENT_TEXT = '公告：双奖得主！OrgaNova 荣获行业认可';

const HERO = {
  title: '将生物学复杂性转化为挽救生命的确定性',
  description:
    '一个由功能真相驱动的统一引擎。OrgaNova 打破研究与临床之间的壁垒。通过利用我们世界一流的 1,500+ 例患者来源类器官库和专有的 TRiC\u2122 技术，我们提供单一的生物学真相来源，驱动医疗价值链的每一个阶段。',
  subtext:
    '赋能全周期医疗。无论是为生物制药加速药物发现、为临床医生实现精准医疗，还是为科学家推进基础研究，我们的使命始终如一：确保正确的治疗方案以前所未有的速度到达正确的患者。',
  statement: '从实验台到病床，由真相驱动。',
  bridge:
    '生物学复杂性是障碍，OrgaNova 是桥梁。通过在三个关键维度部署我们的类器官智能引擎，我们确保实验室中的每一项发现都能转化为临床上的胜利。',
};

const TABS = [
  { key: 'clinical', label: '临床精准' },
  { key: 'pharma', label: '制药解决方案' },
  { key: 'academia', label: '学术研究' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

interface TabContent {
  subtitle: string;
  description: string;
  cards: { title: string; body: string }[];
}

const TAB_CONTENT: Record<TabKey, TabContent> = {
  clinical: {
    subtitle: '用临床现实为管线降低风险',
    description:
      '从"概率性"到"确定性"。基因组学只能预测可能发生什么，而功能数据揭示的是将会发生什么。通过在上游部署我们专有的 Organoid 2.0 和 TRiC™ 技术，我们用患者来源模型的生物学真相取代了临床前猜测的不确定性。我们不仅仅筛选药物；我们在模拟人体的活体环境中验证药物。',
    cards: [
      {
        title: '免疫肿瘤学就绪',
        body: '我们的气液界面（ALI）系统生成保留原生免疫微环境的模型。与标准模型不同，Organoid 2.0 能够精准评估免疫检查点抑制剂（如 PD-1/PD-L1）和联合疗法，弥合培养皿与患者应答之间的鸿沟。',
      },
      {
        title: '无伪影靶点发现',
        body: 'TRiC™ 原位平台直接在新鲜组织结构中识别靶点。通过消除细胞分离带来的应激反应，我们过滤掉传统筛选中常见的假阳性（伪影），确保您的先导化合物从第一天起就具有生物学有效性。',
      },
      {
        title: '大规模筛选能力',
        body: '针对 1,600+ 种临床药物和多样化的患者表型库验证您的资产。我们的高通量能力支持快速分层患者群体并早期识别耐药机制，显著加速您的 Go/No-Go 决策。',
      },
    ],
  },
  pharma: {
    subtitle: '重新定义临床前确定性',
    description:
      '问题：90% 的肿瘤药物因临床前模型缺乏患者相关性而失败。\n我们的解决方案：我们采用"数字孪生"策略。通过在 1,500+ 例患者来源模型上进行测试，我们在早期过滤掉失败的候选药物，确保只有最可靠的候选药物进入临床。',
    cards: [
      {
        title: '群体规模生物样本库',
        body: '多样化的患者类器官库。利用我们专有的 1,500+ 例患者来源类器官（PDO）生物样本库。涵盖主要适应症（肺癌、肝癌、结直肠癌）及罕见肿瘤，我们的标准化样本库让您能够跨多样化患者群体测试药效，而不仅仅依赖少数细胞系。',
      },
      {
        title: '原位发现与筛选',
        body: 'TRiC™ 发现引擎。解锁隐藏在三维结构中的新型靶点。将 AI 驱动的算法与我们的 TRiC™ 原位平台相结合，我们直接在原生组织中识别功能性靶点。我们的高通量筛选形成反馈闭环，以临床一致性验证候选药物在化疗、靶向治疗和免疫治疗中的表现。',
      },
      {
        title: '全面验证：药效、毒性与 MoA',
        body: '深度机制解码。这不仅关乎"什么有效"，还关乎"如何起效"和"是否安全"。我们并行运行药效和毒性评估，以早期预测治疗窗口。此外，我们的多组学方法解码作用机制（MoA），提供 IND 申报所需的生物学证据。',
      },
    ],
  },
  academia: {
    subtitle: '以临床真相加速科学发现',
    description:
      '问题：突破性假说往往受限于低质量模型。标准细胞系缺乏高影响力发表所需的异质性和免疫上下文。\n我们的解决方案：我们向科学界开放我们的引擎。我们作为您实验室的延伸，提供在真实世界中验证您的机制所需的专有模型和深度多组学数据。',
    cards: [
      {
        title: '独家生物样本库访问',
        body: '获取全球最全面的 1,500+ 例患者来源类器官库，包括罕见肿瘤和复杂转移模型。至关重要的是，我们提供配对的健康/肿瘤组织，为顶级期刊发表提供严格的生物学对照。',
      },
      {
        title: '免疫动态监测与多组学',
        body: '超越静态数据。我们的平台执行免疫动态监测，实时映射肿瘤微环境的应答。结合深度多组学（转录组学和蛋白质组学），我们将您的实验转化为全面的机制洞见。',
      },
      {
        title: '定制建模与一站式解决方案',
        body: '从特定基因编辑模型（PDOX）到小鼠共培养系统。我们的"一站式"科研解决方案涵盖从实验设计到可视化分析的全流程，量身定制类器官模型以匹配您的特定研究假说。',
      },
    ],
  },
};

const TOOLKIT = {
  title: '生物学真相工具包',
  ctaText: '联系我们',
};

const PRODUCTS_SECTION = {
  title: '产品',
  ctaText: '浏览全部产品',
  items: [
    {
      title: 'OrgaGro™ 培养基系列',
      description:
        '我们自有 1,500+ 例 PDO 样本库所使用的营养丰富基础培养基。经优化可在您的实验室中重建高保真乳腺癌、肺癌和结直肠癌模型。',
      link: '查看 OrgaGro™ 培养基系列 →',
    },
    {
      title: 'TRiC™ 原位检测试剂盒',
      description: '行业首创的功能捕获技术。直接在原生组织结构中识别有效靶点，过滤掉因细胞分离导致的伪影。',
      link: '查看 TRiC™ 原位检测试剂盒 →',
    },
    {
      title: 'OrgaExtract™ 组学制备',
      description: '专为致密三维类器官基质设计的提取方案。确保临床级 RNA/DNA 回收质量，用于下游 AI 解码和测序。',
      link: '查看 OrgaExtract™ 组学制备 →',
    },
  ],
};

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

const FOOTER = {
  title: '解码癌症',
  address: {
    company: 'OrgaNova',
    street: '1610 Cinnamon Lane',
    city: 'Texas, TX 78212',
    country: 'United States',
  },
  copyright: 'OrgaNova \u00a9 2026. 保留所有权利。',
  socialLinks: [
    { label: 'LinkedIn', url: '#' },
    { label: 'X', url: '#' },
    { label: 'YouTube', url: '#' },
  ],
};

export default function CapabilitiesPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('clinical');

  const currentContent = TAB_CONTENT[activeTab];

  return (
    <div className={styles.page}>
      {/* Announcement Bar */}
      <div className={styles.announcement}>
        <span>{ANNOUNCEMENT_TEXT}</span>
      </div>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{HERO.title}</h1>
          <div className={styles.heroColumns}>
            <div className={styles.heroLeft}>
              <p className={styles.heroDescription}>{HERO.description}</p>
            </div>
            <div className={styles.heroRight}>
              <p className={styles.heroSubtext}>{HERO.subtext}</p>
            </div>
          </div>
          <p className={styles.heroStatement}>{HERO.statement}</p>
          <p className={styles.heroBridge}>{HERO.bridge}</p>
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
        <h2 className={styles.toolkitTitle}>{TOOLKIT.title}</h2>
        <Link to="/contact" className={styles.contactLink}>
          {TOOLKIT.ctaText}
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
