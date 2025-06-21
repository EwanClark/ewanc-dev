import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Ewan C - Full-Stack Developer Portfolio',
    short_name: 'Ewan C Dev',
    description: 'Year 8 self-taught developer from London, UK. Specializing in backend development, full-stack applications, and modern web technologies.',
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
    categories: ['developer', 'portfolio', 'technology', 'programming'],
    lang: 'en-GB',
    orientation: 'portrait-primary',
  }
} 