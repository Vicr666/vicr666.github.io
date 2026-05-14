const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  title: 'V文库🍃',
  theme: 'antdocs',
  description: '面向网络安全从业者的知识文库',
  shouldPrefetch: () => false,
  // 注入到当前页面的 HTML <head> 中的标签
  head: [
    ['link', { rel: 'icon', href: 'https://security-1310978225.cos.ap-beijing.myqcloud.com/public/img/home.svg' }], // 增加一个自定义的 favicon(网页标签的图标)
  ],
  markdown: {
    lineNumbers: false,
    extractHeaders: isProd ? ['h2'] : []
  },
  plugins: {
    ...(isProd
      ? {
          'one-click-copy': {},
          'reading-progress': {},
        }
      : {}),
  },
  themeConfig: {
    sidebarDepth: 2,
    backToTop: true,
    smoothScroll: isProd,
    nav: require('./config/nav'),
    sidebar: require('./config/sidebar'),
    sidebarDepth: 0,
    search: isProd,
    pageAnchor: {
      anchorDepth: 1,
      isDisabled: !isProd,
    },
    lastUpdated: '上次更新',
    logo: 'https://security-1310978225.cos.ap-beijing.myqcloud.com/public/img/home.svg',
    repo: 'https://github.com/Vicr666/vicr666.github.io',
    editLinks: false,
  }
};
