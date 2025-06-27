export async function GET() {
    const baseUrl = 'https://compareprix.net';
    
    const robots = `# 🤖 robots.txt optimisé pour ComparePrix.net
  # Généré automatiquement par Next.js
  
  User-agent: *
  
  # ✅ Pages autorisées (importantes pour le SEO)
  Allow: /
  Allow: /mobile
  Allow: /internet
  Allow: /telephones
  Allow: /mentions-legales
  Allow: /politique-confidentialite
  Allow: /politique-cookies
  Allow: /cgv
  
  # ✅ Ressources autorisées
  Allow: /favicon.ico
  Allow: /sitemap.xml
  Allow: /*.css$
  Allow: /*.js$
  Allow: /*.png$
  Allow: /*.jpg$
  Allow: /*.jpeg$
  Allow: /*.gif$
  Allow: /*.svg$
  Allow: /*.webp$
  
  # ❌ Répertoires interdits
  Disallow: /api/
  Disallow: /_next/
  Disallow: /admin/
  
  # 🎯 Règles spécifiques pour Google
  User-agent: Googlebot
  Allow: /
  Crawl-delay: 1
  
  # 🎯 Règles pour Bing
  User-agent: Bingbot  
  Allow: /
  Crawl-delay: 2
  
  # 🗺️ SITEMAP
  Sitemap: ${baseUrl}/sitemap.xml`;
  
    return new Response(robots, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  }