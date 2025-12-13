/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://delawarezoning.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: [
    '/admin',
    '/admin/*',
    '/api/*',
    '/dashboard',
    '/checkout/*',
    '/login',
    '/signup',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/api/*',
          '/dashboard',
          '/checkout/*',
          '/login',
          '/signup',
        ],
      },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_SITE_URL || 'https://delawarezoning.com'}/sitemap.xml`,
    ],
  },
  changefreq: 'daily',
  priority: 0.7,
  transform: async (config, path) => {
    // Custom priority for different page types
    let priority = 0.7;
    let changefreq = 'daily';

    // Homepage - highest priority
    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    }
    // Blog posts - high priority
    else if (path.startsWith('/blog/')) {
      priority = 0.9;
      changefreq = 'weekly';
    }
    // County pages - high priority
    else if (path.startsWith('/county/')) {
      priority = 0.8;
      changefreq = 'weekly';
    }
    // City pages - medium-high priority
    else if (path.startsWith('/city/')) {
      priority = 0.7;
      changefreq = 'weekly';
    }
    // Resources - medium priority
    else if (path.startsWith('/resources/')) {
      priority = 0.8;
      changefreq = 'monthly';
    }
    // Pricing - high priority
    else if (path === '/pricing') {
      priority = 0.9;
      changefreq = 'weekly';
    }
    // Other pages
    else {
      priority = 0.6;
      changefreq = 'monthly';
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    };
  },
};

