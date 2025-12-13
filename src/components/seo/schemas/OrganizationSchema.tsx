import Head from 'next/head';

interface OrganizationSchemaProps {
  name?: string;
  url?: string;
  logo?: string;
  description?: string;
  email?: string;
  areaServed?: string;
}

export default function OrganizationSchema({
  name = 'Delaware Zoning',
  url = 'https://delawarezoning.com',
  logo = '/logo.png',
  description = 'The leading zoning lookup platform for Delaware real estate professionals',
  email = 'contact@delawarezoning.com',
  areaServed = 'Delaware, United States',
}: OrganizationSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://delawarezoning.com';
  const fullLogo = logo.startsWith('http') ? logo : `${baseUrl}${logo}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo: fullLogo,
    description,
    email,
    areaServed: {
      '@type': 'State',
      name: areaServed,
    },
    sameAs: [
      // Add social media profiles here when available
      // 'https://www.facebook.com/delawarezoning',
      // 'https://twitter.com/delawarezoning',
      // 'https://www.linkedin.com/company/delawarezoning',
    ],
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

