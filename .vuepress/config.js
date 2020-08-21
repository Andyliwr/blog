module.exports = {
  title: '月光倾城的代码小屋',
  description: '站在阳光下就能看见太阳',
  dest: 'public',
  head: [
    [
      'link',
      {
        rel: 'icon',
        href: '/favicon.ico'
      }
    ],
    [
      'meta',
      {
        name: 'viewport',
        content: 'width=device-width,initial-scale=1,user-scalable=no'
      }
    ]
  ],
  theme: 'reco',
  themeConfig: {
    nav: [
      {
        text: '首页',
        link: '/',
        icon: 'reco-home'
      },
      {
        text: '时间轴',
        link: '/timeline/',
        icon: 'reco-date'
      },
      {
        text: '文档',
        icon: 'reco-message',
        items: [
          {
            text: 'vuepress-reco',
            link: '/docs/theme-reco/'
          }
        ]
      },
      {
        text: '联系博主',
        icon: 'reco-message',
        items: [
          {
            text: 'GitHub',
            link: 'https://github.com/andyliwr',
            icon: 'reco-github'
          },
          {
            text: '邮箱',
            link: 'mailto:andyliwr@outlook.com',
            icon: 'reco-email'
          }
        ]
      }
    ],
    sidebar: {
      '/docs/theme-reco/': ['', 'theme', 'plugin', 'api']
    },
    type: 'blog',
    blogConfig: {
      category: {
        location: 2,
        text: '分类'
      },
      tag: {
        location: 3,
        text: '标签'
      }
    },
    friendLink: [
      {
        title: '午后南杂',
        desc: 'Enjoy when you can, and endure when you must.',
        email: '1156743527@qq.com',
        link: 'https://www.recoluan.com'
      },
      {
        title: 'vuepress-theme-reco',
        desc: 'A simple and beautiful vuepress Blog & Doc theme.',
        avatar: 'https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png',
        link: 'https://vuepress-theme-reco.recoluan.com'
      }
    ],
    vssueConfig: {
      platform: 'github',
      owner: 'Andyliwr',
      repo: 'Andyliwr.github.io',
      admin: ['Andyliwr'],
      clientId: 'ad6f70df0c70d2b715f9',
      clientSecret: '40384bee244c1e17dd7c37733d21e9ef669e969c'
    },
    logo: '/logo.jpg',
    search: true,
    searchMaxSuggestions: 10,
    lastUpdated: 'Last Updated',
    author: '月光倾城',
    authorAvatar: '/logo.jpg',
    record: '月光倾城的博客',
    recordLink: 'https://andyliwr.github.io',
    startYear: '2016',
    codeTheme: 'tomorrow'
  },
  markdown: {
    lineNumbers: true
  }
};
