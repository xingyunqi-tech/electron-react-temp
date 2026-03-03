import { Link } from 'react-router-dom';

import AnnouncementBar from '@/components/AnnouncementBar';
import SiteFooter from '@/components/SiteFooter';

import styles from './index.module.scss';

// ==================== Constants ====================

const HERO = {
  sectionLabel: 'OrgaNova 平台',
  title: '超越静态基因组',
  descriptions: [
    'OrgaNova 平台不仅仅是一套工具集合，更是一个功能真相引擎。传统药物发现依赖基因组代理指标，而我们依赖的是生物学现实。',
    '通过整合全球最大的活体患者类器官库与高通量原位功能检测，我们揭示了单纯测序无法发现的肿瘤脆弱性。我们将癌症生物学的"黑箱"转化为可计算、可预测的系统。',
  ],
};

const ENGINE = {
  title: 'OrgaNova 引擎：迭代循环',
  steps: [
    {
      title: '重建',
      description: '1,500+ 例患者来源类器官，保留原生 TME。',
    },
    {
      title: '探询',
      description: '大规模并行 CRISPR 扰动，迫使靶点暴露。',
    },
    {
      title: '捕获上下文',
      description: '专有 TRiC™ 技术无需细胞分离即可原位读取信号。',
    },
    {
      title: '解码',
      description: 'AI 算法预测作用机制（MoA），指导临床策略。',
    },
  ],
  diagram: {
    centerText: 'OrgaNova 平台',
    labels: ['Organoid 2.0 建模', 'TRiC™ 原位筛选', 'AI 与多组学分析', '功能基因组学'],
  },
};

const TECH_SECTIONS = [
  {
    subtitle: '重建肿瘤真实面貌，而不仅仅是细胞',
    body: '标准模型之所以失败，是因为它们是孤立的。我们的 Organoid 2.0 平台——基于专有的气液界面（ALI）技术——保留了原生免疫微环境和基质结构。凭借 1,500+ 例患者类器官库，我们针对人体生物学的全部复杂性进行药物测试。',
    imagePosition: 'right' as const,
  },
  {
    subtitle: '没有细胞是孤岛。上下文即是答案。',
    body: '传统筛选之所以失败，是因为它剥离了细胞的原生环境。我们专有的 TRiC™ 平台直接在原生组织结构中原位捕获功能信号。通过保留免疫和基质上下文，我们过滤掉假阳性结果，揭示在人体内真正有效的靶点。',
    imagePosition: 'right' as const,
  },
  {
    subtitle: '从"是否突变？"迈向"是否关键？"',
    body: '基因组学列出突变；我们找到驱动因子。通过部署大规模 CRISPR 和 shRNA 文库，我们在 2D、3D 及体内模型中系统性地扰动基因组。我们迫使肿瘤暴露其生存依赖，过滤噪音以识别功能上至关重要的靶点。',
    imagePosition: 'left' as const,
  },
  {
    subtitle: '解码不可见的逻辑',
    body: '生物学是硬件；AI 是解码器。我们将多组学数据——空间转录组学、RNA-seq 和代谢组学——整合为统一的计算模型。我们的算法预测作用机制（MoA），将原始实验噪音转化为清晰、可执行的治疗策略。',
    imagePosition: 'center' as const,
  },
  {
    subtitle: '将洞见转化为患者生存获益',
    body: '从靶点发现到个性化精准医疗，OrgaNova 架起了通向临床现实的桥梁。无论是识别新型耐药机制还是预测免疫治疗应答，我们的平台确保正确的药物到达正确的患者——将生物学数据转化为挽救生命的治疗方案。',
    imagePosition: 'left' as const,
  },
];

const CAPABILITIES_CTA = {
  label: '能力',
  title: '将生物学复杂性转化为挽救生命的确定性',
};

const CONTACT_LINK_TEXT = '联系我们';

export default function PlatformPage() {
  return (
    <div className={styles.page}>
      <AnnouncementBar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBgWrapper}>
          <div className={styles.heroBgPlaceholder} />
          <div className={styles.heroGradientTop} />
          <div className={styles.heroGradientBottom} />
        </div>
        <div className={styles.heroContent}>
          <span className={styles.sectionLabel}>{HERO.sectionLabel}</span>
          <h1 className={styles.heroTitle}>{HERO.title}</h1>
        </div>
      </section>

      {/* Description Section */}
      <section className={styles.descriptionSection}>
        <div className={styles.descriptionGrid}>
          {HERO.descriptions.map((text, index) => (
            <p key={index} className={styles.descriptionText}>
              {text}
            </p>
          ))}
        </div>
      </section>

      {/* Engine Loop Section */}
      <section className={styles.engineSection}>
        <h2 className={styles.engineTitle}>{ENGINE.title}</h2>
        <div className={styles.engineContent}>
          <div className={styles.engineSteps}>
            {ENGINE.steps.map(step => (
              <div key={step.title} className={styles.engineStep}>
                <h3 className={styles.engineStepTitle}>{step.title}</h3>
                <p className={styles.engineStepDescription}>{step.description}</p>
              </div>
            ))}
          </div>
          <div className={styles.engineDiagram}>
            <div className={styles.diagramCircle}>
              <span className={styles.diagramCenter}>{ENGINE.diagram.centerText}</span>
              {ENGINE.diagram.labels.map((label, index) => (
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
          <span className={styles.capabilitiesLabel}>{CAPABILITIES_CTA.label}</span>
          <h2 className={styles.capabilitiesTitle}>{CAPABILITIES_CTA.title}</h2>
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
          {CONTACT_LINK_TEXT}
        </Link>
      </section>

      <SiteFooter />
    </div>
  );
}
