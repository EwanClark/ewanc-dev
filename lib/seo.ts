import { Metadata } from 'next'

const baseUrl = 'https://ewanc-dev.vercel.app'
const siteName = 'Ewan C - Full-Stack Developer'
const defaultTitle = 'Ewan C - Full-Stack Developer Portfolio'
const defaultDescription = 'Year 8 self-taught developer from London, UK. Specializing in backend development, full-stack applications, and modern web technologies. View my projects and experience.'

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
    'full-stack developer',
    'backend developer',
    'web developer',
    'self-taught programmer',
    'London developer',
    'Python developer',
    'JavaScript developer',
    'TypeScript developer',
    'Next.js developer',
    'React developer',
    'Node.js developer',
    'API development',
    'database design',
    'web applications'
  ]

  const allKeywords = [...defaultKeywords, ...keywords].join(', ')

  const metadata: Metadata = {
    title: fullTitle,
    description: finalDescription,
    keywords: allKeywords,
    authors: [{ name: 'Ewan C', url: baseUrl }],
    creator: 'Ewan C',
    publisher: 'Ewan C',
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
          url: `${baseUrl}/profile-picture-optimized.jpg`,
          width: 1200,
          height: 630,
          alt: 'Ewan C - Full-Stack Developer',
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: finalDescription,
      images: [`${baseUrl}/profile-picture-optimized.jpg`],
      creator: '@ewanc_dev',
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
    // verification: {
    //   google: 'your-google-verification-code', // Replace with actual verification code when you get it
    // },
  }

  return metadata
}

export function generatePersonStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Ewan C',
    jobTitle: 'Full-Stack Developer',
    description: 'Year 8 self-taught developer from London, UK, specializing in backend development and full-stack applications.',
    url: baseUrl,
    image: `${baseUrl}/profile-picture-optimized.jpg`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'London',
      addressCountry: 'GB',
    },
    sameAs: [
      // Add your social media profiles here
      // 'https://github.com/yourusername',
      // 'https://linkedin.com/in/yourusername',
      // 'https://twitter.com/yourusername',
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
      'Artificial Intelligence',
      'Machine Learning',
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
      name: 'Ewan C',
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