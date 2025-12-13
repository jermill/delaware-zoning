import Head from 'next/head';

interface SoftwareSchemaProps {
  name?: string;
  description?: string;
  url?: string;
  price?: string;
  priceCurrency?: string;
  ratingValue?: string;
  ratingCount?: string;
  operatingSystem?: string;
}

export default function SoftwareSchema({
  name = 'Delaware Zoning',
  description = 'Instant zoning lookup for Delaware properties',
  url = 'https://delawarezoning.com',
  price = '19.00',
  priceCurrency = 'USD',
  ratingValue = '4.9',
  ratingCount = '50',
  operatingSystem = 'Any',
}: SoftwareSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url,
    applicationCategory: 'BusinessApplication',
    operatingSystem,
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency,
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue,
      ratingCount,
      bestRating: '5',
      worstRating: '1',
    },
    creator: {
      '@type': 'Organization',
      name: 'Delaware Zoning',
      url,
    },
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

