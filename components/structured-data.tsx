import { generatePersonStructuredData } from '@/lib/seo'

interface StructuredDataProps {
  data: object
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  )
}

export function generateArticleStructuredData({
  title,
  description,
  url,
  publishedTime,
  modifiedTime,
  image,
}: {
  title: string
  description: string
  url: string
  publishedTime?: string
  modifiedTime?: string
  image?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    author: {
      '@type': 'Person',
      name: 'Ewan C',
      url: 'https://ewanc-dev.vercel.app',
    },
    publisher: {
      '@type': 'Person',
      name: 'Ewan C',
      url: 'https://ewanc-dev.vercel.app',
    },
    ...(publishedTime && { datePublished: publishedTime }),
    ...(modifiedTime && { dateModified: modifiedTime }),
    ...(image && { image }),
  }
}

export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateProjectStructuredData({
  name,
  description,
  url,
  image,
  technologies,
}: {
  name: string
  description: string
  url: string
  image?: string
  technologies?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url,
    applicationCategory: 'WebApplication',
    operatingSystem: 'Any',
    author: {
      '@type': 'Person',
      name: 'Ewan C',
      url: 'https://ewanc-dev.vercel.app',
    },
    ...(image && { image }),
    ...(technologies && { keywords: technologies.join(', ') }),
  }
} 