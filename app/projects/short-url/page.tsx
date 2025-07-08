"use client";

import type React from "react";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FaRegCopy } from "react-icons/fa";
import { BiBarChartAlt2 } from "react-icons/bi";
import { FaRegTrashAlt } from "react-icons/fa";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { isReservedRoute } from "@/lib/route-utils";
import { createClient } from "@/utils/supabase/client";

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
  const [isErrorExiting, setIsErrorExiting] = useState(false);
  const [isSuccessExiting, setIsSuccessExiting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [urlsLoading, setUrlsLoading] = useState(true);
  const [urls, setUrls] = useState<ShortenedUrl[]>([]);
  const [urlValid, setUrlValid] = useState<boolean | null>(null);
  const [aliasValid, setAliasValid] = useState<boolean | null>(null);
  const [baseUrl, setBaseUrl] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [urlToDelete, setUrlToDelete] = useState<{ id: string; shortCode: string } | null>(null);

  const setPassword = (password: string) => {
    setPasswordState(password);
  };

  // Helper functions for animated dismissal
  const dismissError = useCallback(() => {
    setIsErrorExiting(true);
    setTimeout(() => {
      setError(null);
      setIsErrorExiting(false);
    }, 300); // Match animation duration
  }, []);

  const dismissSuccess = useCallback(() => {
    setIsSuccessExiting(true);
    setTimeout(() => {
      setSuccess(null);
      setIsSuccessExiting(false);
    }, 300); // Match animation duration
  }, []);

  // Fetch user's URLs from API
  const fetchUrls = useCallback(async () => {
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
        setTimeout(dismissError, 5000);
      }
    } catch (error) {
      console.error('Error fetching URLs:', error);
      setError('Failed to fetch URLs');
      setTimeout(dismissError, 5000);
    } finally {
      setUrlsLoading(false);
    }
  }, [user, dismissError]);

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
  }, [user, fetchUrls]);

  // Set up real-time subscriptions for click count updates
  useEffect(() => {
    if (!user || urls.length === 0) return;

    const supabase = createClient();
    let urlSubscription: any = null;
    let analyticsSubscription: any = null;

    const setupSubscriptions = async () => {
      // Get all URL IDs for the current user
      const urlIds = urls.map(url => url.id);
      
      if (urlIds.length === 0) return;

      // Subscribe to short_urls table for click count updates
      urlSubscription = supabase
        .channel('main_page_url_realtime')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'short_urls',
            filter: `id=in.(${urlIds.join(',')})`,
          },
          (payload) => {
            console.log('Real-time URL update received:', payload);
            setUrls(prevUrls => 
              prevUrls.map(url => 
                url.id === payload.new.id
                  ? {
                      ...url,
                      totalClicks: payload.new.total_clicks,
                      uniqueClicks: payload.new.unique_clicks,
                    }
                  : url
              )
            );
          }
        )
        .subscribe();

      // Subscribe to short_url_analytics table for new click records
      analyticsSubscription = supabase
        .channel('main_page_analytics_realtime')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'short_url_analytics',
            filter: `short_url_id=in.(${urlIds.join(',')})`,
          },
          (payload) => {
            console.log('Real-time analytics insert received:', payload);
            setUrls(prevUrls => 
              prevUrls.map(url => {
                if (url.id === payload.new.short_url_id) {
                  // Increment total clicks
                  const newTotalClicks = url.totalClicks + 1;
                  
                  // For unique clicks, we'll rely on the database trigger to update
                  // the short_urls table, which will be caught by the first subscription
                  return {
                    ...url,
                    totalClicks: newTotalClicks,
                  };
                }
                return url;
              })
            );
          }
        )
        .subscribe();
    };

    setupSubscriptions();

    // Cleanup subscriptions on unmount or when dependencies change
    return () => {
      if (urlSubscription) {
        supabase.removeChannel(urlSubscription);
      }
      if (analyticsSubscription) {
        supabase.removeChannel(analyticsSubscription);
      }
    };
  }, [user, urls.length]);



  const validateUrl = (inputUrl: string) => {
    if (!inputUrl) {
      setUrlValid(null);
      return;
    }
    
    // Comprehensive URL regex pattern
    const urlRegex = /^https?:\/\/(?:[-\w.])+(?:\:[0-9]+)?(?:\/(?:[\w\/_.])*)?(?:\?(?:[\w&=%.])*)?(?:\#(?:[\w.])*)?$/;
    
    // More specific domain validation regex
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
    
    // First check with regex
    if (!urlRegex.test(inputUrl)) {
      setUrlValid(false);
      return;
    }
    
    try {
      const url = new URL(inputUrl);
      
      // Check if the URL has a valid protocol (http or https)
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        setUrlValid(false);
        return;
      }
      
      // Check if the URL has a valid hostname
      if (!url.hostname || url.hostname.length === 0) {
        setUrlValid(false);
        return;
      }
      
      // Validate domain structure with regex
      if (!domainRegex.test(url.hostname)) {
        setUrlValid(false);
        return;
      }
      
      // Additional checks for malformed URLs
      if (url.hostname.includes('..') || url.hostname.startsWith('.') || url.hostname.endsWith('.')) {
        setUrlValid(false);
        return;
      }
      
      // Ensure TLD is at least 2 characters
      const tld = url.hostname.split('.').pop();
      if (!tld || tld.length < 2) {
        setUrlValid(false);
        return;
      }
      
      // URL is valid
      setUrlValid(true);
    } catch {
      setUrlValid(false);
    }
  };

  const validateCustomAlias = (inputAlias: string) => {
    if (!inputAlias) {
      setAliasValid(null);
      return;
    }
    
    // Check for characters that would break URL routing or cause conflicts
    const invalidChars = /[\/\\\.\s#\?&=\+%]/;
    
    // Check for routing-breaking characters
    if (invalidChars.test(inputAlias)) {
      setAliasValid(false);
      return;
    }
    
    // Check for reserved route prefixes
    if (isReservedRoute(inputAlias)) {
      setAliasValid(false);
      return;
    }
    
    // Alias is valid
    setAliasValid(true);
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
      setTimeout(dismissError, 5000);
      setLoading(false);
      return;
    }

    // Validate custom alias if provided
    if (customAlias && aliasValid === false) {
      setError("Please enter a valid custom alias (avoid spaces, slashes, dots, and words like 'api', 'login', 'signup')");
      setTimeout(dismissError, 5000);
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
        setTimeout(dismissSuccess, 5000);
        
        // Clear form
        setUrl("");
        setCustomAlias("");
        setPasswordState("");
        setUrlValid(null);
        setAliasValid(null);
      } else {
        setError(data.error || 'Failed to create short URL');
        setTimeout(dismissError, 5000);
      }
    } catch (error) {
      console.error('Error creating short URL:', error);
      setError('Failed to create short URL');
      setTimeout(dismissError, 5000);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (shortCode: string) => {
    try {
      await navigator.clipboard.writeText(`${baseUrl}/${shortCode}`);
      setSuccess(`Copied ${baseUrl}/${shortCode} to clipboard!`);
      setTimeout(dismissSuccess, 3000);
    } catch {
      setError("Failed to copy to clipboard");
      setTimeout(dismissError, 3000);
    }
  };

  const viewAnalytics = (shortCode: string) => {
    router.push(`/projects/short-url/${shortCode}/analytics`);
  };

  const handleDeleteClick = (id: string, shortCode: string) => {
    setUrlToDelete({ id, shortCode });
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogChange = (open: boolean) => {
    setDeleteDialogOpen(open);
    if (!open) {
      setUrlToDelete(null);
    }
  };

  const deleteUrl = async () => {
    if (!urlToDelete) return;

    try {
      const response = await fetch(`/api/short-url/${urlToDelete.shortCode}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        // Remove URL from the list
        setUrls(urls.filter(url => url.id !== urlToDelete.id));
        setSuccess(data.message);
        setTimeout(dismissSuccess, 3000);
      } else {
        setError(data.error || 'Failed to delete URL');
        setTimeout(dismissError, 3000);
      }
    } catch (error) {
      console.error('Error deleting URL:', error);
      setError('Failed to delete URL');
      setTimeout(dismissError, 3000);
    } finally {
      setDeleteDialogOpen(false);
      setUrlToDelete(null);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Short URL
            </h1>
          </div>

          {!user && (
            <Card className="mb-6 sm:mb-8 hover:shadow-md transition-all duration-200 hover:scale-[1.01] cursor-pointer">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="mb-4">
                    Please log in to use the URL shortener.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                    <Button size="lg" className="w-full sm:w-32" asChild>
                      <Link href="/login">Log In</Link>
                    </Button>
                    <Button
                      size="lg"
                      className="w-full sm:w-32"
                      variant="outline"
                      asChild
                    >
                      <Link href="/signup">Sign Up</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className={!user ? "opacity-50 pointer-events-none" : ""}>
            <Card className="mb-6 sm:mb-8 hover:shadow-md transition-all duration-200 hover:scale-[1.01] cursor-pointer">
              <CardHeader>
                <CardTitle>Shorten a URL</CardTitle>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert 
                    variant="destructive" 
                    className={`mb-4 transition-all duration-300 ${
                      isErrorExiting 
                        ? 'animate-out fade-out slide-out-to-top-2' 
                        : 'animate-in fade-in slide-in-from-top-2'
                    }`}
                  >
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert 
                    className={`mb-4 bg-green-500/10 text-green-500 border-green-500/20 transition-all duration-300 ${
                      isSuccessExiting 
                        ? 'animate-out fade-out slide-out-to-top-2' 
                        : 'animate-in fade-in slide-in-from-top-2'
                    }`}
                  >
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
                      <div className="relative">
                        <Input
                          placeholder="Custom alias (optional)"
                          value={customAlias}
                          onChange={(e) => {
                            setCustomAlias(e.target.value);
                            validateCustomAlias(e.target.value);
                          }}
                          disabled={!user}
                          className={`text-sm opacity-80 transition-all duration-200 hover:opacity-100 focus:opacity-100 ${
                            aliasValid === true ? 'border-green-500 focus:border-green-500 opacity-100' : 
                            aliasValid === false ? 'border-red-500 focus:border-red-500 opacity-100' : ''
                          }`}
                        />
                        {aliasValid === true && (
                          <div className="absolute right-3 top-3 text-green-500 animate-in fade-in duration-200">
                            ✓
                          </div>
                        )}
                        {aliasValid === false && (
                          <div className="absolute right-3 top-3 text-red-500 animate-in fade-in duration-200">
                            ✗
                          </div>
                        )}
                      </div>
                      {aliasValid === false && (
                        <p className="text-xs text-red-500 mt-1 animate-in fade-in duration-200">
                          Invalid alias. Avoid spaces, slashes, dots, and words like 'api', 'login', 'signup'.
                        </p>
                      )}
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

            <Card className="hover:shadow-md transition-all duration-200 hover:scale-[1.01] cursor-pointer">
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
                            <TableCell>
                              <Link 
                                href={`${baseUrl}/${url.shortCode}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                prefetch={false}
                                className="break-all text-foreground hover:text-primary underline decoration-foreground/60 hover:decoration-primary transition-all duration-200 underline-offset-2 hover:underline-offset-4 cursor-pointer"
                                title="Open short URL"
                              >
                                {baseUrl ? baseUrl.replace(/^https?:\/\//, '') : 'Loading...'}/{url.shortCode}
                              </Link>
                            </TableCell>
                            <TableCell className="hidden md:table-cell max-w-[200px]">
                              <Link 
                                href={url.originalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                prefetch={false}
                                className="truncate block text-foreground hover:text-primary underline decoration-foreground/60 hover:decoration-primary transition-all duration-200 underline-offset-2 hover:underline-offset-4 cursor-pointer"
                                title={url.originalUrl}
                              >
                                {url.originalUrl}
                              </Link>
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
                                  onClick={() => handleDeleteClick(url.id, url.shortCode)}
                                  title="Delete short URL"
                                  className="h-8 w-8"
                                  disabled={!user}
                                >
                                  <FaRegTrashAlt className="h-3 w-3 sm:h-4 sm:w-4" />
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={handleDeleteDialogChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Short URL</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the short URL "{urlToDelete?.shortCode}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteUrl} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
