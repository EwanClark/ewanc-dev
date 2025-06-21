"use client";

import type React from "react";

import { useState } from "react";
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
import { useAuth } from "@/lib/auth-context";

type ShortenedUrl = {
  id: string;
  originalUrl: string;
  shortCode: string;
  createdAt: Date;
  clicks: number;
};

export default function ShortUrlPage() {
  const { user } = useAuth();
  const [url, setUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [password, setPasswordState] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [urls, setUrls] = useState<ShortenedUrl[]>([]);
  const [urlValid, setUrlValid] = useState<boolean | null>(null);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const setPassword = (password: string) => {
    console.log("Password:", password);
    setPasswordState(password);
  };

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

  const handleCreateShortUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validate URL
    try {
      new URL(url);
    } catch {
      setError("Please enter a valid URL including http:// or https://");
      setLoading(false);
      return;
    }

    // Check if custom alias is available
    if (customAlias && urls.some((u) => u.shortCode === customAlias)) {
      setError(
        "This custom alias is already taken. Please choose another one."
      );
      setLoading(false);
      return;
    }

    // Generate short code if not provided
    const shortCode = customAlias || Math.random().toString(36).substring(2, 7);

    // Create new shortened URL
    setTimeout(() => {
      const newUrl: ShortenedUrl = {
        id: Date.now().toString(),
        originalUrl: url,
        shortCode,
        createdAt: new Date(),
        clicks: 0,
      };

      setUrls([newUrl, ...urls]);
      setSuccess(
        `URL shortened successfully! Your short URL is: short.url/${shortCode}`
      );
      setUrl("");
      setCustomAlias("");
      setLoading(false);
    }, 1000);
  };

  const copyToClipboard = (shortCode: string) => {
    navigator.clipboard.writeText(`https://short.url/${shortCode}`);
    setCopySuccess(`Copied: short.url/${shortCode}`);
    setTimeout(() => setCopySuccess(null), 2000);
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

                {copySuccess && (
                  <Alert className="mb-4 bg-blue-500/10 text-blue-500 border-blue-500/20 animate-in fade-in duration-300">
                    <AlertDescription>{copySuccess}</AlertDescription>
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
                {urls.length > 0 ? (
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
                                short.url/{url.shortCode}
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
                              {url.clicks}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1 sm:gap-2">
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
