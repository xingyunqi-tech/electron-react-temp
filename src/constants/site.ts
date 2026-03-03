/**
 * 官网站点共享常量
 * 8 个官网页面（Home/AboutUs/Products/Capabilities/News/Contact/OrganoidIntelligence/Platform）
 * 的公共导航、页脚、公告栏等常量定义
 */

export const ANNOUNCEMENT_TEXT = '公告：双料获奖！OrgaNova 荣获行业认可';

export const NAV = {
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

export const FOOTER = {
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

export const PRODUCTS_LIST = [
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
];
