
  import { MetadataRoute } from 'next';
  import { SEO_CONFIG } from '@/lib/seo/config';
  
  export default function robots(): MetadataRoute.Robots {
    const baseUrl = SEO_CONFIG.domain;
    
    return {
      rules: [
        {
          userAgent: '*',
          allow: [
            '/',
            '/forfaits-mobiles',
            '/telephones',
            '/box-internet',
            '/mentions-legales',
            '/politique-confidentialite',
            '/politique-cookies',
            '/cgv',
            '/*.css$',
            '/*.js$',
            '/*.png$',
            '/*.jpg$',
            '/*.jpeg$',
            '/*.svg$',
            '/*.webp$',
          ],
          disallow: [
            '/api/',
            '/_next/',
            '/admin/',
            '/*?*utm_*',
            '/*?*ref=*',
            '/*?*source=*',
          ],
          crawlDelay: 1,
        },
        {
          userAgent: 'Googlebot',
          allow: '/',
          crawlDelay: 1,
        },
        {
          userAgent: ['AhrefsBot', 'SemrushBot', 'MJ12bot', 'DotBot'],
          disallow: '/',
        },
      ],
      sitemap: `${baseUrl}/sitemap.xml`,
    };
  }
  