import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product';
  product?: {
    name: string;
    price: number;
    currency?: string;
    availability?: string;
    description?: string;
    image?: string;
    sku?: string;
  };
}

const BASE_URL = 'https://domainefendri.com';
const DEFAULT_IMAGE = `${BASE_URL}/produit2-nobg.webp`;
const SITE_NAME = 'Domaine Fendri';

export default function SEO({
  title = 'Domaine Fendri — Huile d\'Olive Extra Vierge Bio, Sfax, Tunisie',
  description = 'Découvrez l\'huile d\'olive extra vierge bio du Domaine Fendri, produite à Sfax depuis 1911. Médaillée internationalement, extraction à froid, certifiée bio EU.',
  image = DEFAULT_IMAGE,
  url = BASE_URL,
  type = 'website',
  product,
}: SEOProps) {
  const fullTitle = title.includes('Domaine Fendri') ? title : `${title} — Domaine Fendri`;

  const schemaOrg = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description || description,
        image: product.image || image,
        sku: product.sku,
        brand: {
          '@type': 'Brand',
          name: 'Domaine Fendri',
        },
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: product.currency || 'TND',
          availability: product.availability || 'https://schema.org/InStock',
          url,
        },
      }
    : {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Domaine Fendri',
        url: BASE_URL,
        logo: `${BASE_URL}/logo-fendri.png`,
        description,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Meknessi',
          addressRegion: 'Sfax',
          addressCountry: 'TN',
        },
        sameAs: ['https://www.instagram.com/domainefendri'],
      };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="fr_TN" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <script type="application/ld+json">
        {JSON.stringify(schemaOrg)}
      </script>
    </Helmet>
  );
}
