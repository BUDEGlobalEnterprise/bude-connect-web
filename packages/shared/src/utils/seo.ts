import { useHead } from '@unhead/vue';

export interface MetadataOptions {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  keywords?: string;
}

const DEFAULT_META: MetadataOptions = {
  title: 'BudeGlobal - India\'s Trusted Dual Platform',
  description: 'Connect with verified talent or browse the marketplace for surplus goods and rentals.',
  image: '/logo.png',
  url: 'https://budeglobal.in',
  type: 'website',
  keywords: 'marketplace, freelancers, india, buy sell, jobs, verified experts'
};

export function useSeo(options: MetadataOptions = {}) {
  const meta = { ...DEFAULT_META, ...options };
  const fullTitle = meta.title?.includes('BudeGlobal') 
    ? meta.title 
    : `${meta.title} | BudeGlobal`;

  return useHead({
    title: fullTitle,
    meta: [
      { name: 'description', content: meta.description },
      { name: 'keywords', content: meta.keywords },
      // Open Graph
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: meta.description },
      { property: 'og:image', content: meta.image },
      { property: 'og:url', content: meta.url },
      { property: 'og:type', content: meta.type },
      // Twitter
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: meta.description },
      { name: 'twitter:image', content: meta.image },
    ],
    link: [
      { rel: 'canonical', href: meta.url }
    ]
  });
}
