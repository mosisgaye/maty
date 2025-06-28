// app/blog/[slug]/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { BlogArticle, formatDate, getImageUrl } from '@/types/blog';
import { blogService } from '@/lib/blog-service';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowLeft, 
  Facebook, 
  Twitter, 
  Linkedin,
  ChevronRight,
  TrendingUp,
  Mail,
  Tag,
  ArrowRight,
  Eye
} from 'lucide-react';

interface BlogArticlePageProps {
  params: {
    slug: string;
  };
}

const categoryColors: Record<string, string> = {
  'Box': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  'Mobile': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  'Téléphone': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  'Guide': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  'Bons plans': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
};

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const article = await blogService.getArticleBySlug(params.slug);
  
  if (!article) {
    return {
      title: 'Article non trouvé | ComparePrix Blog',
      description: 'L\'article que vous recherchez n\'existe pas ou a été supprimé.',
    };
  }

  return {
    title: `${article.Titre} | ComparePrix Blog`,
    description: article.Extrait,
    openGraph: {
      title: article.Titre,
      description: article.Extrait,
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      images: article.Image ? [{
        url: getImageUrl(article.Image, 'large'),
        width: 1200,
        height: 630,
        alt: article.Titre,
      }] : [],
    },
  };
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const [article, suggestedArticles] = await Promise.all([
    blogService.getArticleBySlug(params.slug),
    blogService.getLatestArticles(4)
  ]);

  if (!article) {
    notFound();
  }

  const relatedArticles = suggestedArticles
    .filter(a => a.Slug !== article.Slug)
    .slice(0, 3);

  const articleUrl = `https://compareprix.net/blog/${article.Slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.Titre,
    description: article.Extrait,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      '@type': 'Organization',
      name: 'ComparePrix'
    },
    publisher: {
      '@type': 'Organization',
      name: 'ComparePrix',
      logo: {
        '@type': 'ImageObject',
        url: 'https://compareprix.net/logo.png'
      }
    },
    image: article.Image ? getImageUrl(article.Image, 'large') : undefined,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section avec fix pour le header */}
        <div className="relative pt-20">
          {/* Image de fond */}
          {article.Image && (
            <div className="absolute inset-0 h-[500px]">
              <Image
                src={getImageUrl(article.Image, 'large')}
                alt={article.Titre}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
            </div>
          )}

          {/* Contenu hero */}
          <div className="relative z-10">
            <div className="container mx-auto px-4 pt-24 pb-16">
              {/* Breadcrumb */}
              <nav className="text-sm mb-8">
                <ol className="flex items-center space-x-2 text-white/80">
                  <li><Link href="/" className="hover:text-white">Accueil</Link></li>
                  <li>/</li>
                  <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                  <li>/</li>
                  <li className="text-white font-medium">{article.category || 'Article'}</li>
                </ol>
              </nav>

              {/* Header article */}
              <div className="max-w-4xl mx-auto text-center">
                <Badge className={`${categoryColors[article.category || 'Guide']} mb-4`}>
                  {article.category}
                </Badge>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                  {article.Titre}
                </h1>

                <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto">
                  {article.Extrait}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/80">
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Rédaction ComparePrix
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(article.Date)}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {article.readingTime || 5} min
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {Math.floor(Math.random() * 5000 + 1000)} vues
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal - LARGEUR CORRIGÉE */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-4 gap-12 max-w-7xl mx-auto">
            {/* Article - LARGEUR AUGMENTÉE */}
            <div className="lg:col-span-3">
              <Card className="shadow-xl">
                <CardContent className="p-8 md:p-12">
                  {/* Contenu HTML avec styles appropriés */}
                  <div 
                    className="prose prose-lg dark:prose-invert max-w-none article-content"
                    dangerouslySetInnerHTML={{ __html: article.Contenus }}
                  />

                  {/* CTA en fin d'article */}
                  <div className="mt-12 p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                      Prêt à économiser sur vos forfaits ?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Comparez les meilleures offres du moment et trouvez le forfait idéal.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Link href="/forfaits-mobiles">
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                          Comparer les forfaits
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                      <Link href="/box-internet">
                        <Button variant="outline">
                          Voir les box internet
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Partage */}
                  <div className="mt-12 pt-8 border-t text-center">
                    <h3 className="text-lg font-semibold mb-4">Partagez cet article</h3>
                    <div className="flex justify-center gap-3">
                      <Button variant="outline" size="lg" asChild>
                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`} target="_blank" rel="noopener noreferrer">
                          <Facebook className="w-5 h-5 mr-2" />
                          Facebook
                        </a>
                      </Button>
                      <Button variant="outline" size="lg" asChild>
                        <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(article.Titre)}`} target="_blank" rel="noopener noreferrer">
                          <Twitter className="w-5 h-5 mr-2" />
                          Twitter
                        </a>
                      </Button>
                      <Button variant="outline" size="lg" asChild>
                        <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="w-5 h-5 mr-2" />
                          LinkedIn
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-8">
                <Link href="/blog">
                  <Button variant="outline" size="lg" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Retour au blog
                  </Button>
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-8">
              {/* Newsletter */}
              <Card>
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                  <Mail className="w-12 h-12 mb-3" />
                  <h3 className="font-bold text-xl mb-2">Newsletter</h3>
                  <p className="text-sm">Les meilleurs bons plans chaque semaine !</p>
                </div>
                <CardContent className="p-6">
                  <form className="space-y-4">
                    <input
                      type="email"
                      placeholder="Votre email"
                      className="w-full px-4 py-3 rounded-lg border"
                      required
                    />
                    <Button className="w-full">Je m'abonne</Button>
                  </form>
                </CardContent>
              </Card>

              {/* Articles suggérés */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                    À lire également
                  </h3>
                  <div className="space-y-6">
                    {relatedArticles.map((related) => (
                      <Link key={related.id} href={`/blog/${related.Slug}`} className="block group">
                        <div className="flex gap-4">
                          <div className="relative w-24 h-16 flex-shrink-0 overflow-hidden rounded-lg">
                            <Image
                              src={getImageUrl(related.Image, 'thumbnail')}
                              alt={related.Titre}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform"
                              sizes="96px"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {related.Titre}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(related.Date)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-purple-500" />
                    Tags populaires
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {['Fibre', '5G', 'Bbox', 'Free', 'Orange', 'SFR'].map((tag) => (
                      <Link key={tag} href={`/blog?search=${encodeURIComponent(tag)}`}>
                        <Badge variant="secondary" className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700">
                          #{tag}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </article>
    </>
  );
}