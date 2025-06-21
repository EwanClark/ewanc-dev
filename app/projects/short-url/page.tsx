"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FaRegCopy } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { BiBarChartAlt2 } from "react-icons/bi";
import { Trash2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

type ShortenedUrl = {
  id: string;
  originalUrl: string;
  shortCode: string;
  createdAt: Date;
  totalClicks: number;
  uniqueClicks: number;
  isPasswordProtected: boolean;
  isActive: boolean;
};

export default function ShortUrlPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [password, setPasswordState] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [urlsLoading, setUrlsLoading] = useState(true);
  const [urls, setUrls] = useState<ShortenedUrl[]>([]);
  const [urlValid, setUrlValid] = useState<boolean | null>(null);
  const [baseUrl, setBaseUrl] = useState<string>("");

  const setPassword = (password: string) => {
    setPasswordState(password);
  };

  // Fetch user's URLs from API
  const fetchUrls = async () => {
    if (!user) return;
    
    try {
      setUrlsLoading(true);
      const response = await fetch('/api/short-url/user');
      const data = await response.json();
      
      if (data.success) {
        // Convert date strings to Date objects
        const formattedUrls = data.urls.map((url: any) => ({
          ...url,
          createdAt: new Date(url.createdAt)
        }));
        setUrls(formattedUrls);
      } else {
        setError(data.error || 'Failed to fetch URLs');
        setTimeout(() => setError(null), 5000);
      }
    } catch (error) {
      console.error('Error fetching URLs:', error);
      setError('Failed to fetch URLs');
      setTimeout(() => setError(null), 5000);
    } finally {
      setUrlsLoading(false);
    }
  };

  // Set base URL on client side only
  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  // Fetch URLs when component mounts and user is available
  useEffect(() => {
    if (user) {
      fetchUrls();
    } else {
      setUrlsLoading(false);
    }
  }, [user]);

  const validateUrl = (inputUrl: string) => {
    if (!inputUrl) {
      setUrlValid(null);
      return;
    }
    try {
      new URL(inputUrl);
      setUrlValid(true);
    } catch {
      setUrlValid(false);
    }
  };

  const handleCreateShortUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validate URL
    try {
      new URL(url);
    } catch {
      setError("Please enter a valid URL including http:// or https://");
      setTimeout(() => setError(null), 5000);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/short-url/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalUrl: url,
          customAlias: customAlias || undefined,
          password: password || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Add new URL to the list
        const newUrl: ShortenedUrl = {
          ...data.shortUrl,
          createdAt: new Date(data.shortUrl.createdAt)
        };
        setUrls([newUrl, ...urls]);
        setSuccess(data.message);
        setTimeout(() => setSuccess(null), 5000);
        
        // Clear form
        setUrl("");
        setCustomAlias("");
        setPasswordState("");
        setUrlValid(null);
      } else {
        setError(data.error || 'Failed to create short URL');
        setTimeout(() => setError(null), 5000);
      }
    } catch (error) {
      console.error('Error creating short URL:', error);
      setError('Failed to create short URL');
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (shortCode: string) => {
    try {
      await navigator.clipboard.writeText(`${baseUrl}/${shortCode}`);
      setSuccess(`Copied ${baseUrl}/${shortCode} to clipboard!`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to copy to clipboard");
      setTimeout(() => setError(null), 3000);
    }
  };

  const viewAnalytics = (shortCode: string) => {
    router.push(`/projects/short-url/${shortCode}/analytics`);
  };

  const deleteUrl = async (id: string, shortCode: string) => {
    if (!window.confirm(`Are you sure you want to delete the short URL "${shortCode}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/short-url/${shortCode}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        // Remove URL from the list
        setUrls(urls.filter(url => url.id !== id));
        setSuccess(data.message);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.error || 'Failed to delete URL');
        setTimeout(() => setError(null), 3000);
      }
    } catch (error) {
      console.error('Error deleting URL:', error);
      setError('Failed to delete URL');
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              URL Shortener
            </h1>
          </div>

          {!user && (
            <Card className="mb-6 sm:mb-8">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="mb-4">
                    Please log in to use the URL shortener.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                    <Button size="lg" className="w-full sm:w-32" asChild>
                      <a href="/login">Log In</a>
                    </Button>
                    <Button
                      size="lg"
                      className="w-full sm:w-32"
                      variant="outline"
                      asChild
                    >
                      <a href="/signup">Sign Up</a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className={!user ? "opacity-50 pointer-events-none" : ""}>
            <Card className="mb-6 sm:mb-8">
              <CardHeader>
                <CardTitle>Shorten a URL</CardTitle>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="mb-4 bg-green-500/10 text-green-500 border-green-500/20 animate-in fade-in duration-300">
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleCreateShortUrl} className="space-y-4">
                  <div>
                    <div className="relative">
                      <Input
                        placeholder="https://example.com/your/long/url"
                        value={url}
                        onChange={(e) => {
                          setUrl(e.target.value);
                          validateUrl(e.target.value);
                        }}
                        disabled={!user}
                        required
                        className={`mb-3 text-lg transition-colors duration-200 ${
                          urlValid === true ? 'border-green-500 focus:border-green-500' : 
                          urlValid === false ? 'border-red-500 focus:border-red-500' : ''
                        }`}
                      />
                      {urlValid === true && (
                        <div className="absolute right-3 top-3 text-green-500 animate-in fade-in duration-200">
                          ✓
                        </div>
                      )}
                    </div>
                    <div className="space-y-2 mb-3">
                      <Input
                        placeholder="Custom alias (optional)"
                        value={customAlias}
                        onChange={(e) => setCustomAlias(e.target.value)}
                        disabled={!user}
                        className="text-sm opacity-80 transition-opacity duration-200 hover:opacity-100 focus:opacity-100"
                      />
                      <Input
                        placeholder="Password (optional)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={!user}
                        className="text-sm opacity-80 transition-opacity duration-200 hover:opacity-100 focus:opacity-100"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 mt-4">
                    <div className="text-sm text-muted-foreground">
                      Your shortened URLs are saved to your account.
                    </div>
                    <Button
                      type="submit"
                      disabled={loading || !user}
                      className="w-full sm:w-auto transition-all duration-200 hover:scale-105"
                    >
                      {loading ? "Shortening..." : "Shorten URL"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Shortened URLs</CardTitle>
              </CardHeader>
              <CardContent>
                {urlsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading your URLs...</p>
                  </div>
                ) : urls.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[120px]">
                            Short URL
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                            Original URL
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                            Created
                          </TableHead>
                          <TableHead className="text-center">Clicks</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {urls.map((url) => (
                          <TableRow key={url.id}>
                            <TableCell className="font-medium">
                              <div className="break-all">
                                {baseUrl ? baseUrl.replace(/^https?:\/\//, '') : 'Loading...'}/{url.shortCode}
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell max-w-[200px]">
                              <div className="truncate" title={url.originalUrl}>
                                {url.originalUrl}
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {url.createdAt.toLocaleDateString()}
                            </TableCell>
                                                    <TableCell className="text-center">
                          {url.totalClicks}
                        </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1 sm:gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => viewAnalytics(url.shortCode)}
                                  title="View Analytics"
                                  className="h-8 w-8"
                                  disabled={!user}
                                >
                                  <BiBarChartAlt2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => copyToClipboard(url.shortCode)}
                                  title="Copy short URL"
                                  className="h-8 w-8"
                                  disabled={!user}
                                >
                                  <FaRegCopy className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    window.open(url.originalUrl, "_blank")
                                  }
                                  title="Visit original URL"
                                  className="h-8 w-8"
                                  disabled={!user}
                                >
                                  <FiExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => deleteUrl(url.id, url.shortCode)}
                                  title="Delete short URL"
                                  className="h-8 w-8"
                                  disabled={!user}
                                >
                                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
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
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
