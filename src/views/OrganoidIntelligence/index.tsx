import { Link } from 'react-router-dom';

import AnnouncementBar from '@/components/AnnouncementBar';
import SiteFooter from '@/components/SiteFooter';

import styles from './index.module.scss';

// ==================== Constants ====================

// Hero Section
const HERO = {
  label: '类器官智能',
  title: '以前所未有的精准度解码癌症。',
  aside: {
    title: '如果……临床试验不必是疗效的第一次真正检验呢？',
    body: '现在我们看到了。\n通过构建大规模的患者来源类器官（PDO）库，我们创建了镜像人类生物学的数字化身。',
  },
};

// Intro Section
const INTRO = {
  leftText: '我们利用技术以基因组学本身无法实现的方式来探究肿瘤。',
  rightStatement: '事实证明……基因蓝图并不能保证生物学结果。',
  rightBody: [
    '通过在我们专有的 1,500+ 患者来源类器官库上训练 OrgaNova 平台——辅以高通量 CRISPR 功能扰动数据——我们可以学习决定特定肿瘤结构如何响应治疗干预的确定性规则。',
    '通过在我们专有的 1,500+ 患者来源类器官库上训练 OrgaNova 平台——辅以高通量 CRISPR 功能扰动数据——我们可以学习决定特定肿瘤结构如何响应治疗干预的确定性规则。',
    '我们将这一创新称为类器官智能。',
  ],
};

// Detail Cards
const DETAIL_CARDS = [
  {
    title: '高保真生物化身',
    description:
      '标准模型失败是因为缺乏上下文。我们的类器官 2.0 系统保留了原始肿瘤微环境（TME）和免疫互作。从药物敏感性测试（IC50/AUC）到复杂的免疫共培养，我们确保输入 AI 的数据从第一天起就具有临床相关性。',
  },
  {
    title: '深度探究',
    description:
      '利用我们专有的 TRiC 平台，我们在原生组织结构中直接进行靶点发现。通过原位应用 CRISPR/shRNA 扰动，过滤因细胞分离产生的假阳性，识别在真实世界中驱动肿瘤存活的隐藏靶点。',
  },
  {
    title: '智能解码',
    description:
      '我们的深度学习算法整合 RNA-seq、空间转录组学和代谢组学数据，绘制疾病的隐形网络。我们将原始实验信号转化为清晰的作用机制（MoA）预测，加速从苗头化合物到先导化合物的进程。',
  },
];

// Insights Section
const INSIGHTS_HEADING = '生成前所未有的洞察。';

// Democratizing Section
const DEMOCRATIZING = {
  title: '普惠发现',
  body: [
    '我们相信类器官智能应该让每一位先驱者都能触及。与提供固定菜单的传统 CRO 不同，OrgaNova 作为您研发团队的延伸来运营。无论您是需要靶点验证的生物技术初创公司，还是寻求管线扩展的大型制药企业，我们的平台都能适应您的科学需求。',
    '联合开发：共同开发具有共享知识产权的新型模型或靶点。',
    '端到端服务：从实验设计到可视化分析报告。',
    '数据整合：基于 AI 的现有测序数据分析。',
  ],
};

// Platform Section
const PLATFORM_CTA = {
  label: '平台',
  title: '超越静态基因组',
};

// ==================== Component ====================

export default function OrganoidIntelligencePage() {
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

        {/* Hero Content */}
        <div className={styles.heroContent}>
          <div className={styles.heroLabelRow}>
            <span className={styles.heroLabel}>{HERO.label}</span>
            <h1 className={styles.heroTitle}>{HERO.title}</h1>
          </div>
        </div>

        {/* Hero Aside (bottom-right of hero) */}
        <div className={styles.heroAside}>
          <h2 className={styles.heroAsideTitle}>{HERO.aside.title}</h2>
          <p className={styles.heroAsideBody}>
            {HERO.aside.body.split('\n').map((line, i) => (
              <span key={i}>
                {line}
                {i < HERO.aside.body.split('\n').length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>
      </section>

      {/* Intro Section (black bg, two columns) */}
      <section className={styles.intro}>
        <div className={styles.introLeft}>
          <p className={styles.introLeftText}>{INTRO.leftText}</p>
        </div>
        <div className={styles.introRight}>
          <h3 className={styles.introRightStatement}>{INTRO.rightStatement}</h3>
          <div className={styles.introRightBody}>
            {INTRO.rightBody.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Details Section (black bg, split layout) */}
      <section className={styles.details}>
        <div className={styles.detailsLeft}>
          <p className={styles.insightsHeading}>{INSIGHTS_HEADING}</p>
        </div>
        <div className={styles.detailsRight}>
          {DETAIL_CARDS.map(card => (
            <div key={card.title} className={styles.detailCard}>
              <h4 className={styles.detailCardTitle}>{card.title}</h4>
              <p className={styles.detailCardDescription}>{card.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Democratizing Section (white bg) */}
      <section className={styles.democratizing}>
        <div className={styles.democratizingLeft}>
          <h2 className={styles.democratizingTitle}>{DEMOCRATIZING.title}</h2>
        </div>
        <div className={styles.democratizingRight}>
          {DEMOCRATIZING.body.map((paragraph, i) => (
            <p key={i} className={styles.democratizingParagraph}>
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* Illustration Placeholder */}
      <section className={styles.illustration}>
        <div className={styles.illustrationPlaceholder} />
      </section>

      {/* Platform Section (white bg) */}
      <section className={styles.platform}>
        <div className={styles.platformInner}>
          <span className={styles.platformLabel}>{PLATFORM_CTA.label}</span>
          <Link to="/platform" className={styles.platformRow}>
            <h2 className={styles.platformTitle}>{PLATFORM_CTA.title}</h2>
            <span className={styles.platformArrow} />
            <div className={styles.platformTriangle} />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
