import { Metadata } from 'next'

const baseUrl = 'https://ewanc.dev'
const siteName = 'Ewan Clark - Full-Stack Developer'
const defaultTitle = 'Ewan Clark - Full-Stack Developer Portfolio'
const defaultDescription = 'Year 8 self-taught developer from London, UK. Specializing in backend development, full-stack applications, and modern web technologies. View my projects and experience.'

// Simplified SEO function - just the essentials
export function generateMetadata({
  title,
  description,
  path = '',
  keywords = [],
}: {
  title?: string
  description?: string
  path?: string
  keywords?: string[]
} = {}): Metadata {
  const fullTitle = title ? `${title} | ${siteName}` : defaultTitle
  const finalDescription = description || defaultDescription
  const url = `${baseUrl}${path}`

  return {
    title: fullTitle,
    description: finalDescription,
    authors: [{ name: 'Ewan Clark', url: baseUrl }],
    metadataBase: new URL(baseUrl),
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description: finalDescription,
      url,
      siteName,
      type: 'website',
      images: [{ url: `${baseUrl}/favicon.ico`, alt: 'Ewan Clark - Full-Stack Developer' }],
    },
    twitter: {
      card: 'summary',
      title: fullTitle,
      description: finalDescription,
      images: [`${baseUrl}/favicon.ico`],
    },
  }
}

// Simplified structured data - just the essentials
export function generatePersonStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Ewan Clark',
    jobTitle: 'Full-Stack Developer',
    description: 'Year 8 self-taught developer from London, UK, specializing in backend development and full-stack applications.',
    url: baseUrl,
    image: `${baseUrl}/favicon.ico`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'London',
      addressCountry: 'GB',
    },
    sameAs: [
      'https://github.com/ewanclark',
    ],
  }
}

export function generateWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: baseUrl,
    description: defaultDescription,
    author: {
      '@type': 'Person',
      name: 'Ewan Clark',
    },
  }
} 