import { Metadata } from 'next'

const baseUrl = 'https://ewanc.dev'
const siteName = 'Ewan Clark - Full Stack Developer'
const defaultTitle = 'Ewan Clark - Full Stack Developer'
const defaultDescription = 'Ewan Clark - Year 8 programmer and full-stack developer from London. Self-taught specializing in backend development.'

export function generateMetadata({
  title,
  description,
  path = '',
  keywords = [],
  type = 'website',
  publishedTime,
  modifiedTime,
  noIndex = false,
}: {
  title?: string
  description?: string
  path?: string
  keywords?: string[]
  type?: 'website' | 'article' | 'profile'
  publishedTime?: string
  modifiedTime?: string
  noIndex?: boolean
} = {}): Metadata {
  const fullTitle = title ? `${title} | ${siteName}` : defaultTitle
  const finalDescription = description || defaultDescription
  const url = `${baseUrl}${path}`

  const defaultKeywords = [
    'Ewan Clark',
    'Programmer',
    'Coder',
    'Portfolio',
    'Developer',
    'Full Stack Developer',
    'Backend Developer',
    'Year 8',
    'London',
    'Self-Taught Programmer',
    'Web Developer',
    'Python Developer',
    'JavaScript Developer',
    'TypeScript Developer',
    'Next.js Developer',
    'React Developer',
    'Backend',
    'Data Analysis',
    'Computer Science'
  ]

  const allKeywords = [...defaultKeywords, ...keywords].join(', ')

  const metadata: Metadata = {
    title: fullTitle,
    description: finalDescription,
    keywords: allKeywords,
    authors: [{ name: 'Ewan Clark', url: baseUrl }],
    creator: 'Ewan Clark',
    publisher: 'Ewan Clark',
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description: finalDescription,
      url,
      siteName,
      type,
      locale: 'en_GB',
      images: [
        {
          url: `${baseUrl}/favicon.ico`,
          width: 512,
          height: 512,
          alt: defaultTitle,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: finalDescription,
      images: [`${baseUrl}/favicon.ico`],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
  return metadata
}

export function generatePersonStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Ewan Clark',
    jobTitle: 'Full Stack Developer',
    description: defaultDescription,
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
    knowsAbout: [
      'Backend Development',
      'Full-Stack Development',
      'Python Programming',
      'JavaScript Programming',
      'TypeScript Programming',
      'Next.js Framework',
      'React Framework',
      'Node.js',
      'API Development',
      'Database Design',
      'PostgreSQL',
      'Supabase',
      'Web Development',
      'Software Engineering',
    ],
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'Self-Taught',
    },
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
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/projects?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
} 