import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://compareprix.net';
  const currentDate = new Date().toISOString();
  
  // 🎯 Pages principales avec priorités et fréquences optimisées
  const pages = [
    { url: '', priority: '1.0', changefreq: 'daily' },
    { url: '/mobile', priority: '0.9', changefreq: 'daily' },
    { url: '/internet', priority: '0.8', changefreq: 'weekly' },
    { url: '/telephones', priority: '0.8', changefreq: 'weekly' },
    { url: '/mentions-legales', priority: '0.3', changefreq: 'monthly' },
    { url: '/politique-confidentialite', priority: '0.3', changefreq: 'monthly' },
    { url: '/politique-cookies', priority: '0.3', changefreq: 'monthly' },
    { url: '/cgv', priority: '0.3', changefreq: 'monthly' },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${pages
    .map(
      (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join('\n')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}