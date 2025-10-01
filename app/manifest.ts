import { MetadataRoute } from 'next'
import { getAge } from '@/lib/age-calculator'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Ewan Clark - Full-Stack Developer Portfolio',
    short_name: 'Ewan Clark Dev',
    description: `Ewan Clark - ${getAge()} year old Full-Stack Developer from London. Self-taught developer specializing in backend development, full-stack applications, and modern web technologies.`,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
    categories: ['developer', 'programmer', 'coder', 'portfolio', 'full stack', 'backend'],
    lang: 'en-GB',
    orientation: 'portrait-primary',
  }
} 