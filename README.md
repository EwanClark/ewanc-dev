# Personal Portfolio & URL Shortener

A modern, full-stack personal portfolio website with an integrated URL shortening service. Built with Next.js 15, TypeScript, Tailwind CSS, and Supabase.

## 🚀 Features

### Portfolio Features
- **Personal Portfolio**: Showcase projects, skills, and experience
- **About Page**: Personal story and development journey
- **Projects Showcase**: Detailed project listings with descriptions
- **Tech Stack Display**: Visual representation of technologies used
- **Contact Information**: Easy ways to get in touch
- **Responsive Design**: Mobile-first, fully responsive layout
- **Dark/Light Theme**: Toggle between themes with persistence
- **SEO Optimized**: Meta tags, sitemap, and structured data

### URL Shortening Service
- **Custom Short URLs**: Create short links with optional custom aliases
- **Password Protection**: Secure links with password protection
- **Analytics Dashboard**: Track clicks, unique visitors, and detailed analytics
- **Geolocation Tracking**: See where your links are being accessed from
- **Device & Browser Analytics**: Detailed user agent parsing
- **User Management**: Personal dashboard to manage all your links
- **Bulk Operations**: Create, edit, and delete multiple links

### Authentication & User Management
- **Multiple Auth Providers**: Email/Password, GitHub, Google OAuth
- **Profile Management**: Customizable user profiles
- **Avatar Upload**: Profile picture upload with cropping functionality
- **Password Reset**: Forgot password functionality
- **Account Deletion**: Complete account removal with data cleanup
- **Secure Sessions**: JWT-based authentication with Supabase

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI component library
- **React Hook Form** - Form management
- **Radix UI** - Unstyled, accessible components

### Backend & Database
- **Supabase** - Backend as a Service
- **PostgreSQL** - Database
- **Row Level Security (RLS)** - Database security
- **Supabase Auth** - Authentication service
- **Supabase Storage** - File storage for avatars

### Analytics & Monitoring
- **Custom Analytics System** - Track URL clicks and user behavior
- **IP Geolocation** - Location-based analytics
- **User Agent Parsing** - Device and browser detection
- **Vercel Analytics** - Performance monitoring

### Deployment
- **Vercel** - Hosting and deployment
- **Vercel Speed Insights** - Performance monitoring

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Git

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ewanc-dev.git
cd ewanc-dev
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Variables

Copy the example environment file and configure it with your values:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your actual values:

```env
# The domain name, if testing then http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# https://ipinfo.io/ token (required for geolocation analytics)
IP_LOCATOR_TOKEN=your-ipinfo-token

# Supabase service role key (required for server-side operations)
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Supabase anon key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Supabase project URL
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
```


### 4. Supabase Setup

#### Create a Supabase Project
1. Go to [Supabase](https://supabase.com/) and create a new project
2. Get your project URL from: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/settings/api
3. Get your anon key and service role key from: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/settings/api-keys
4. Add all keys to your `.env.local` file

#### Set Up IP Geolocation (Required for Analytics)
1. Go to [ipinfo.io](https://ipinfo.io/) and create a free account
2. Get your access token from the dashboard
3. Add the `IP_LOCATOR_TOKEN` to your `.env.local` file
4. The free tier provides 50,000 requests per month

#### Set Up Database Tables

Run the following SQL scripts in your Supabase SQL editor:

1. **Authentication Tables**: Execute `scripts/setup-auth-tables.sql`
2. **Profile Storage**: Execute `scripts/setup-profile-uploads.sql`  
3. **URL Shortening**: Execute `scripts/setup-shorturl-tables.sql`

#### Configure Authentication Providers

**Email Authentication**
1. Go to Authentication > Providers in your Supabase dashboard
2. Ensure Email provider is enabled
3. Configure settings as needed (confirm emails, etc.)

**GitHub Authentication**
1. Go to GitHub Developer Settings: https://github.com/settings/developers
2. Create a new OAuth App
3. Set the authorization callback URL to: `https://your-supabase-project-ref.supabase.co/auth/v1/callback`
4. Copy the Client ID and Client Secret
5. In Supabase Authentication settings, enable GitHub provider and paste your credentials

**Google Authentication**
1. Go to Google Cloud Console: https://console.cloud.google.com/
2. Create a new project or use an existing one
3. Go to "APIs & Services" > "Credentials"
4. Create an OAuth 2.0 Client ID
5. Set the authorized redirect URI to: `https://your-supabase-project-ref.supabase.co/auth/v1/callback`
6. Copy the Client ID and Client Secret
7. In Supabase Authentication settings, enable Google provider and paste your credentials

#### Configure Storage for Profile Pictures

The `setup-profile-uploads.sql` script creates:
- `avatars` storage bucket
- Row Level Security policies
- Proper CORS configuration

**Manual Storage Setup (if needed)**
1. Navigate to Storage in your Supabase dashboard
2. Create a new bucket named `avatars` (make it public)
3. Set up RLS policies for secure access

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📝 Customization

### Personal Information
Edit the following files to customize the portfolio:

- `components/hero-section.tsx` - Update personal details
- `app/about/page.tsx` - Modify about page content
- `components/projects-grid.tsx` - Add/remove projects
- `components/tech-stack.tsx` - Update skills and technologies
- `public/profile-picture-optimized.jpg` - Replace with your photo

### Styling
- `tailwind.config.ts` - Customize Tailwind configuration
- `app/globals.css` - Global styles
- `components/ui/` - Modify UI components

### SEO
- `lib/seo.ts` - Update SEO metadata
- `app/sitemap.ts` - Configure sitemap
- `app/robots.txt` - Update robots.txt

## 🗂️ Project Structure

```
ewanc-dev/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── profile/           # User profile pages
│   ├── projects/          # Projects and URL shortener
│   └── ...
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...
├── lib/                  # Utility libraries
├── scripts/              # Database setup scripts
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
└── public/               # Static assets
```

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🔐 Security Features

- **Row Level Security (RLS)** on all database tables
- **JWT Authentication** with secure session management
- **Password Hashing** with bcrypt
- **Input Validation** on all forms
- **CORS Configuration** for secure API access
- **Rate Limiting** on sensitive endpoints

## 📊 Analytics Features

The URL shortener includes comprehensive analytics:

- **Click Tracking**: Total and unique clicks
- **Geolocation**: Country, region, and city data
- **Device Analytics**: Browser, OS, and device type
- **Referrer Tracking**: See where traffic comes from
- **Time-based Analytics**: Track usage over time

## 🚀 Deployment

### Deploy on Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### Environment Variables for Production

```env
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
IP_LOCATOR_TOKEN=your-ipinfo-token
SUPABASE_SERVICE_ROLE_KEY=your-production-supabase-service-role-key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-supabase-anon-key
NEXT_PUBLIC_SUPABASE_URL=your-production-supabase-url
```

## 🧪 Testing Your Setup

1. **Authentication**: Create an account and test login/logout
2. **Profile Management**: Upload a profile picture and update details
3. **URL Shortening**: Create a short URL and test the redirect
4. **Analytics**: Check the analytics dashboard for click data
5. **Password Protection**: Create a password-protected link

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

**Authentication Errors**
- Verify Supabase URL and anon key are correct
- Check that authentication providers are properly configured
- Ensure callback URLs match your Supabase settings

**Profile Picture Upload Issues**
- Verify storage bucket is created and public
- Check RLS policies are applied correctly
- Ensure CORS settings allow your domain

**URL Shortening Problems**
- Confirm database tables are created with proper relationships
- Check that RLS policies allow authenticated users to create URLs
- Verify short codes are unique

**Database Connection Issues**
- Double-check environment variables
- Ensure Supabase project is active
- Verify database permissions

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review the [Supabase documentation](https://supabase.com/docs)
3. Open an issue on GitHub
4. Check existing issues for similar problems

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Vercel](https://vercel.com/) - Deployment platform