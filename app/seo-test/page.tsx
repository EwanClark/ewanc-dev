import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { generateMetadata } from "@/lib/seo"
import { Metadata } from "next"

export const metadata: Metadata = generateMetadata({
  title: "SEO Test Page",
  description: "This page tests all SEO implementations including structured data, meta tags, and performance optimizations.",
  path: "/seo-test",
  keywords: ["seo", "test", "structured data", "meta tags", "performance"],
  noIndex: true // Don't index this test page
})

export default function SEOTestPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">SEO Implementation Test</h1>
          
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>✅ Implemented SEO Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Meta Tags & OpenGraph</h3>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Page-specific titles & descriptions</li>
                      <li>• Open Graph tags for social sharing</li>
                      <li>• Twitter Card optimization</li>
                      <li>• Canonical URLs</li>
                      <li>• Keywords and author information</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Structured Data</h3>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Person schema (JSON-LD)</li>
                      <li>• Website schema</li>
                      <li>• Project/Software application schema</li>
                      <li>• Breadcrumb navigation schema</li>
                      <li>• Article schema (ready for blog)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Technical SEO</h3>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Dynamic XML sitemap</li>
                      <li>• Robots.txt configuration</li>
                      <li>• Web app manifest (PWA ready)</li>
                      <li>• Image optimization (WebP/AVIF)</li>
                      <li>• Performance headers</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Performance</h3>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Font optimization with fallbacks</li>
                      <li>• Image preloading for critical assets</li>
                      <li>• DNS prefetch for external resources</li>
                      <li>• Compression and caching headers</li>
                      <li>• Bundle optimization</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🔍 SEO Testing Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Use these tools to validate your SEO implementation:
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Validation Tools</h3>
                    <ul className="text-sm space-y-1">
                      <li>• <a href="https://search.google.com/test/rich-results" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Google Rich Results Test</a></li>
                      <li>• <a href="https://validator.schema.org/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Schema.org Validator</a></li>
                      <li>• <a href="https://developers.facebook.com/tools/debug/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Facebook Sharing Debugger</a></li>
                      <li>• <a href="https://cards-dev.twitter.com/validator" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Twitter Card Validator</a></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Performance Tools</h3>
                    <ul className="text-sm space-y-1">
                      <li>• <a href="https://pagespeed.web.dev/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Google PageSpeed Insights</a></li>
                      <li>• <a href="https://www.webpagetest.org/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">WebPageTest</a></li>
                      <li>• <a href="https://gtmetrix.com/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">GTmetrix</a></li>
                      <li>• Chrome DevTools Lighthouse</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>📋 Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Required Actions</h3>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>1. Add Google Search Console verification meta tag in lib/seo.ts</li>
                      <li>2. Update social media URLs in person schema (lib/seo.ts)</li>
                      <li>3. Submit sitemap to Google Search Console</li>
                      <li>4. Test all pages with SEO validation tools</li>
                      <li>5. Monitor Core Web Vitals in production</li>
                    </ul>
                  </div>
                  <div>
                    <Badge variant="outline" className="mr-2">Ready for Production</Badge>
                    <Badge variant="secondary">SEO Optimized</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 