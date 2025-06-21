"use client";

import type React from "react";
import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Globe, Users, Clock, Shield } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart, ReferenceLine } from "recharts";

type ClickData = {
  id: string;
  timestamp: Date;
  ip: string;
  isp: string;
  city: string;
  region: string;
  country: string;
  userAgent: string;
  authorized: boolean | null; // null for non-password protected URLs
  referrer: string;
  device: string;
  browser: string;
  os: string;
};

type UrlAnalytics = {
  shortCode: string;
  originalUrl: string;
  createdAt: Date;
  totalClicks: number;
  uniqueClicks: number;
  isPasswordProtected: boolean;
  clicks: ClickData[];
};

// Mock data generator
const generateMockClickData = (shortCode: string): UrlAnalytics => {
  const browsers = ["Chrome", "Firefox", "Safari", "Edge", "Opera"];
  const oses = ["Windows 10", "macOS", "Ubuntu", "iOS", "Android"];
  const devices = ["Desktop", "Mobile", "Tablet"];
  const cities = ["New York", "London", "Tokyo", "Sydney", "Toronto", "Berlin", "Paris", "Mumbai"];
  const regions = ["NY", "England", "Tokyo", "NSW", "ON", "Berlin", "Île-de-France", "Maharashtra"];
  const countries = ["United States", "United Kingdom", "Japan", "Australia", "Canada", "Germany", "France", "India"];
  const isps = ["Comcast", "BT", "NTT", "Telstra", "Rogers", "Deutsche Telekom", "Orange", "Jio"];
  const referrers = ["https://google.com", "https://twitter.com", "https://facebook.com", "Direct", "https://reddit.com"];

  const clicks: ClickData[] = [];
  const clickCount = Math.floor(Math.random() * 100) + 20; // 20-120 clicks

  for (let i = 0; i < clickCount; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const hoursAgo = Math.floor(Math.random() * 24);
    const minutesAgo = Math.floor(Math.random() * 60);
    
    const timestamp = new Date();
    timestamp.setDate(timestamp.getDate() - daysAgo);
    timestamp.setHours(timestamp.getHours() - hoursAgo);
    timestamp.setMinutes(timestamp.getMinutes() - minutesAgo);

    const browser = browsers[Math.floor(Math.random() * browsers.length)];
    const os = oses[Math.floor(Math.random() * oses.length)];
    const device = devices[Math.floor(Math.random() * devices.length)];
    const cityIndex = Math.floor(Math.random() * cities.length);

    clicks.push({
      id: `click-${i}`,
      timestamp,
      ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      isp: isps[cityIndex],
      city: cities[cityIndex],
      region: regions[cityIndex],
      country: countries[cityIndex],
      userAgent: `Mozilla/5.0 (${os}) ${browser}`,
      authorized: Math.random() > 0.3 ? true : Math.random() > 0.5 ? false : null,
      referrer: referrers[Math.floor(Math.random() * referrers.length)],
      device,
      browser,
      os,
    });
  }

  // Sort by timestamp (newest first)
  clicks.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const uniqueIps = new Set(clicks.map(click => click.ip));

  return {
    shortCode,
    originalUrl: "https://example.com/very/long/url/that/was/shortened",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    totalClicks: clicks.length,
    uniqueClicks: uniqueIps.size,
    isPasswordProtected: Math.random() > 0.5,
    clicks,
  };
};

export default function AnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const shortCode = params.shortCode as string;
  const [analytics, setAnalytics] = useState<UrlAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Simulate API call
    setTimeout(() => {
      setAnalytics(generateMockClickData(shortCode));
      setLoading(false);
    }, 1000);

    return () => window.removeEventListener('resize', checkMobile);
  }, [shortCode]);

  const chartData = useMemo(() => {
    if (!analytics) return [];

    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toISOString().split('T')[0],
        clicks: 0,
      };
    });

    analytics.clicks.forEach(click => {
      const clickDate = click.timestamp.toISOString().split('T')[0];
      const dayData = last30Days.find(day => day.date === clickDate);
      if (dayData) {
        dayData.clicks++;
      }
    });

    return last30Days;
  }, [analytics]);

  const peakDay = useMemo(() => {
    if (!analytics || chartData.length === 0) return null;
    
    const maxClicks = Math.max(...chartData.map(d => d.clicks));
    return chartData.find(d => d.clicks === maxClicks);
  }, [analytics, chartData]);

  const averageDailyClicks = useMemo(() => {
    if (!chartData || chartData.length === 0) return 0;
    
    const totalChartClicks = chartData.reduce((sum, day) => sum + day.clicks, 0);
    return Math.round(totalChartClicks / chartData.length * 10) / 10;
  }, [chartData]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-6 sm:py-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <div className="h-10 bg-muted rounded mb-4 animate-pulse"></div>
              <div className="h-8 bg-muted rounded w-3/4 mb-2 animate-pulse"></div>
              <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="h-16 bg-muted rounded animate-pulse"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="mb-6">
              <CardContent className="p-4 sm:p-6">
                <div className="h-64 sm:h-80 lg:h-96 bg-muted rounded animate-pulse"></div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-2 sm:p-6">
                <div className="h-64 sm:h-96 bg-muted rounded animate-pulse"></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Analytics Not Found</h1>
            <p className="text-muted-foreground mb-4">
              The analytics for this URL could not be found.
            </p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to URLs
            </Button>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                  Analytics for /{analytics.shortCode}
                </h1>
                <p className="text-muted-foreground break-all">
                  {analytics.originalUrl}
                </p>
              </div>
              {analytics.isPasswordProtected && (
                <Badge variant="secondary" className="self-start">
                  <Shield className="w-3 h-3 mr-1" />
                  Password Protected
                </Badge>
              )}
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Clicks</p>
                    <p className="text-2xl font-bold">{analytics.totalClicks}</p>
                  </div>
                  <Globe className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Unique Visitors</p>
                    <p className="text-2xl font-bold">{analytics.uniqueClicks}</p>
                  </div>
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Created</p>
                    <p className="text-2xl font-bold">{analytics.createdAt.toLocaleDateString()}</p>
                  </div>
                  <Clock className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg. Daily</p>
                    <p className="text-2xl font-bold">
                      {Math.round(analytics.totalClicks / Math.max(1, Math.ceil((Date.now() - analytics.createdAt.getTime()) / (1000 * 60 * 60 * 24))))}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Click Analytics Chart */}
          <Card className="mb-6">
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-4">
                <div>
                  <CardTitle className="text-lg sm:text-xl">Clicks Over Time (Last 30 Days)</CardTitle>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    <span className="hidden sm:inline">Hover over the chart to see detailed daily statistics</span>
                    <span className="sm:hidden">Tap on the chart to see daily statistics</span>
                  </p>
                </div>
                <div className="flex justify-center sm:justify-end gap-6 sm:gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-lg sm:text-xl font-bold text-green-600">{averageDailyClicks}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Avg/Day</div>
                  </div>
                  {peakDay && (
                    <div className="text-center">
                      <div className="text-lg sm:text-xl font-bold text-blue-600">{peakDay.clicks}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">Peak Day</div>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
              <div className="h-64 sm:h-80 lg:h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart 
                    data={chartData} 
                    margin={{ 
                      top: 20, 
                      right: isMobile ? 10 : 30, 
                      left: isMobile ? 10 : 20, 
                      bottom: 20 
                    }}
                  >
                    <defs>
                      <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(date) => {
                        const d = new Date(date);
                        return isMobile 
                          ? d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })
                          : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      }}
                      tick={{ fontSize: isMobile ? 10 : 12 }}
                      tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                      interval={isMobile ? 'preserveStartEnd' : 0}
                    />
                    <YAxis 
                      tick={{ fontSize: isMobile ? 10 : 12 }}
                      tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                      axisLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                      width={isMobile ? 30 : 40}
                    />
                    <Tooltip 
                      labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { 
                        weekday: isMobile ? 'short' : 'long', 
                        year: 'numeric', 
                        month: isMobile ? 'short' : 'long', 
                        day: 'numeric' 
                      })}
                      formatter={(value, name) => [
                        <span key="value" className="font-semibold">{value} clicks</span>, 
                        ''
                      ]}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        fontSize: isMobile ? '12px' : '14px'
                      }}
                      cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '2 2' }}
                    />
                    {peakDay && (
                      <ReferenceLine 
                        x={peakDay.date} 
                        stroke="hsl(var(--destructive))" 
                        strokeDasharray="4 4"
                        label={{ value: "Peak", position: "top", fontSize: isMobile ? 10 : 12 }}
                      />
                    )}
                    <Area
                      type="monotone"
                      dataKey="clicks"
                      stroke="hsl(var(--primary))"
                      strokeWidth={isMobile ? 2 : 3}
                      fill="url(#clicksGradient)"
                      dot={{ 
                        fill: 'hsl(var(--primary))', 
                        strokeWidth: 2, 
                        stroke: 'hsl(var(--background))',
                        r: isMobile ? 3 : 4
                      }}
                      activeDot={{ 
                        r: isMobile ? 5 : 6, 
                        fill: 'hsl(var(--primary))',
                        stroke: 'hsl(var(--background))',
                        strokeWidth: 2,
                        filter: 'drop-shadow(0 2px 4px rgb(0 0 0 / 0.1))'
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 sm:mt-4 flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-primary"></div>
                  <span className="text-xs">Daily Clicks</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-0.5 sm:w-3 sm:h-1 bg-destructive"></div>
                  <span className="text-xs">Peak Day</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-0.5 sm:w-3 sm:h-1 border border-primary border-dashed"></div>
                  <span className="text-xs hidden sm:inline">Hover Cursor</span>
                  <span className="text-xs sm:hidden">Tap for Details</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Click Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Detailed Click Data</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground">
                <span className="sm:hidden">Scroll horizontally to see all data</span>
                <span className="hidden sm:inline">Complete click tracking information</span>
              </p>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
              <div className="overflow-x-auto -mx-2 sm:mx-0">
                <div className="min-w-[900px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[120px]">Timestamp</TableHead>
                        <TableHead className="min-w-[120px]">IP Address</TableHead>
                        <TableHead className="min-w-[140px]">Location</TableHead>
                        <TableHead className="min-w-[100px]">ISP</TableHead>
                        <TableHead className="min-w-[80px]">Device</TableHead>
                        <TableHead className="min-w-[80px]">Browser</TableHead>
                        <TableHead className="min-w-[100px]">OS</TableHead>
                        <TableHead className="min-w-[120px]">Referrer</TableHead>
                        {analytics.isPasswordProtected && <TableHead className="min-w-[100px]">Authorized</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {analytics.clicks.map((click) => (
                        <TableRow key={click.id}>
                          <TableCell className="min-w-[120px]">
                            <div className="text-xs sm:text-sm">
                              <div className="font-medium">
                                {click.timestamp.toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </div>
                              <div className="text-muted-foreground text-xs">
                                {click.timestamp.toLocaleTimeString('en-US', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-xs sm:text-sm min-w-[120px]">
                            <div className="break-all">{click.ip}</div>
                          </TableCell>
                          <TableCell className="min-w-[140px]">
                            <div className="text-xs sm:text-sm">
                              <div className="font-medium">{click.city}</div>
                              <div className="text-muted-foreground text-xs">
                                {click.region}, {click.country}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="min-w-[100px] text-xs sm:text-sm">
                            {click.isp}
                          </TableCell>
                          <TableCell className="min-w-[80px]">
                            <Badge variant="outline" className="text-xs">
                              {click.device}
                            </Badge>
                          </TableCell>
                          <TableCell className="min-w-[80px] text-xs sm:text-sm">
                            {click.browser}
                          </TableCell>
                          <TableCell className="min-w-[100px] text-xs sm:text-sm">
                            {click.os}
                          </TableCell>
                          <TableCell className="min-w-[120px]">
                            <div className="max-w-[120px]">
                              <div className="truncate text-xs sm:text-sm" title={click.referrer}>
                                {click.referrer === "Direct" ? (
                                  <Badge variant="secondary" className="text-xs">Direct</Badge>
                                ) : (
                                  <a 
                                    href={click.referrer} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline text-xs"
                                  >
                                    {new URL(click.referrer).hostname}
                                  </a>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          {analytics.isPasswordProtected && (
                            <TableCell className="min-w-[100px]">
                              {click.authorized === null ? (
                                <Badge variant="outline" className="text-xs">N/A</Badge>
                              ) : click.authorized ? (
                                <Badge variant="default" className="bg-green-500 text-xs">
                                  ✓ Yes
                                </Badge>
                              ) : (
                                <Badge variant="destructive" className="text-xs">✗ No</Badge>
                              )}
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              <div className="mt-4 text-xs text-muted-foreground text-center sm:hidden">
                💡 Scroll left/right to see all columns
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}