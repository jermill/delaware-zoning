import Head from 'next/head';

interface ArticleSchemaProps {
  title: string;
  description: string;
  publishedTime: string;
  modifiedTime?: string;
  author?: string;
  url: string;
  image: string;
  keywords?: string[];
}

export default function ArticleSchema({
  title,
  description,
  publishedTime,
  modifiedTime,
  author = 'Delaware Zoning Team',
  url,
  image,
  keywords = [],
}: ArticleSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://delawarezoning.com';
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
  const fullImage = image.startsWith('http') ? image : `${baseUrl}${image}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: fullImage,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Delaware Zoning',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': fullUrl,
    },
    keywords: keywords.join(', '),
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
}


