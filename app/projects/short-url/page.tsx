"use client"

import type React from "react"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, ExternalLink } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

type ShortenedUrl = {
  id: string
  originalUrl: string
  shortCode: string
  createdAt: Date
  clicks: number
}

export default function ShortUrlPage() {
  const { user } = useAuth()
  const [url, setUrl] = useState("")
  const [customAlias, setCustomAlias] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [urls, setUrls] = useState<ShortenedUrl[]>([
    {
      id: "1",
      originalUrl: "https://example.com/very/long/url/that/needs/shortening",
      shortCode: "ex1",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      clicks: 42,
    },
    {
      id: "2",
      originalUrl: "https://another-example.com/some/path",
      shortCode: "ex2",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
      clicks: 17,
    },
  ])

  const handleCreateShortUrl = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    // Validate URL
    try {
      new URL(url)
    } catch {
      setError("Please enter a valid URL including http:// or https://")
      setLoading(false)
      return
    }

    // Check if custom alias is available
    if (customAlias && urls.some((u) => u.shortCode === customAlias)) {
      setError("This custom alias is already taken. Please choose another one.")
      setLoading(false)
      return
    }

    // Generate short code if not provided
    const shortCode = customAlias || Math.random().toString(36).substring(2, 7)

    // Create new shortened URL
    setTimeout(() => {
      const newUrl: ShortenedUrl = {
        id: Date.now().toString(),
        originalUrl: url,
        shortCode,
        createdAt: new Date(),
        clicks: 0,
      }

      setUrls([newUrl, ...urls])
      setSuccess(`URL shortened successfully! Your short URL is: short.url/${shortCode}`)
      setUrl("")
      setCustomAlias("")
      setLoading(false)
    }, 1000)
  }

  const copyToClipboard = (shortCode: string) => {
    navigator.clipboard.writeText(`https://short.url/${shortCode}`)
    alert(`Copied to clipboard: https://short.url/${shortCode}`)
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">URL Shortener</h1>
            <p className="text-muted-foreground">Create short, memorable links for your URLs</p>
          </div>

          <Card className="mb-6 sm:mb-8">
            <CardHeader>
              <CardTitle>Shorten a URL</CardTitle>
              <CardDescription>Enter a long URL to create a shortened version</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-4 bg-green-500/10 text-green-500 border-green-500/20">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleCreateShortUrl} className="space-y-4">
                <div>
                  <Input
                    placeholder="https://example.com/your/long/url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Custom alias (optional)"
                      value={customAlias}
                      onChange={(e) => setCustomAlias(e.target.value)}
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                    {loading ? "Shortening..." : "Shorten URL"}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              {user ? (
                "Your shortened URLs will be saved to your account."
              ) : (
                <>
                  <a href="/login" className="text-primary hover:underline">
                    Log in
                  </a>{" "}
                  to save and manage your shortened URLs.
                </>
              )}
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your URLs</CardTitle>
              <CardDescription>Manage your shortened URLs</CardDescription>
            </CardHeader>
            <CardContent>
              {urls.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[120px]">Short URL</TableHead>
                        <TableHead className="hidden md:table-cell">Original URL</TableHead>
                        <TableHead className="hidden md:table-cell">Created</TableHead>
                        <TableHead className="text-center">Clicks</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {urls.map((url) => (
                        <TableRow key={url.id}>
                          <TableCell className="font-medium">
                            <div className="break-all">short.url/{url.shortCode}</div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell max-w-[200px]">
                            <div className="truncate" title={url.originalUrl}>
                              {url.originalUrl}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{url.createdAt.toLocaleDateString()}</TableCell>
                          <TableCell className="text-center">{url.clicks}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1 sm:gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => copyToClipboard(url.shortCode)}
                                title="Copy short URL"
                                className="h-8 w-8"
                              >
                                <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => window.open(url.originalUrl, "_blank")}
                                title="Visit original URL"
                                className="h-8 w-8"
                              >
                                <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No URLs shortened yet.</p>
                  <p className="text-sm mt-1">Create your first short URL above!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
