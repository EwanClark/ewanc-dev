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
import { CiGlobe } from "react-icons/ci";
import { FaArrowLeft } from "react-icons/fa6";
import { FaRegUser, FaRegClock, FaDesktop } from "react-icons/fa";
import { IoShield } from "react-icons/io5";
import { FiMapPin } from "react-icons/fi";
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart, ReferenceLine } from "recharts";
import { createClient } from "@/utils/supabase/client";

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



export default function AnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const shortCode = params.shortCode as string;
  const [analytics, setAnalytics] = useState<UrlAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/short-url/${shortCode}/analytics`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          }
        });
        const data = await response.json();
        
        if (data.success) {
          // Convert date strings back to Date objects
          const formattedAnalytics = {
            ...data.analytics,
            createdAt: new Date(data.analytics.createdAt),
            clicks: data.analytics.clicks.map((click: any) => ({
              ...click,
              timestamp: new Date(click.timestamp)
            }))
          };
          setAnalytics(formattedAnalytics);
        } else {
          console.error('Failed to fetch analytics:', data.error);
          setAnalytics(null);
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setAnalytics(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [shortCode]);

    // Set up real-time subscriptions for analytics updates
  useEffect(() => {
    if (!analytics) return;

    const supabase = createClient();
    let urlSubscription: any = null;
    let analyticsSubscription: any = null;

    const setupSubscriptions = async () => {
      // Get the URL ID first for proper filtering
      const { data: urlData, error } = await supabase
        .from('short_urls')
        .select('id')
        .eq('short_code', shortCode)
        .single();

      if (!urlData?.id) {
        console.error('Could not get URL ID for realtime subscriptions');
        return;
      }

      // Subscribe to short_urls table for click count updates
      urlSubscription = supabase
        .channel('analytics_url_realtime')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'short_urls',
            filter: `id=eq.${urlData.id}`,
          },
          (payload) => {
            console.log('Real-time URL update received:', payload);
            setAnalytics(prev => {
              if (!prev) return prev;
              return {
                ...prev,
                totalClicks: payload.new.total_clicks,
                uniqueClicks: payload.new.unique_clicks,
              };
            });
          }
        )
        .subscribe();

      // Subscribe to short_url_analytics table for new click records
      analyticsSubscription = supabase
        .channel('analytics_clicks_realtime')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'short_url_analytics',
            filter: `short_url_id=eq.${urlData.id}`,
          },
          (payload) => {
            console.log('Real-time analytics insert received:', payload);
            const newClick: ClickData = {
              id: payload.new.id,
              timestamp: new Date(payload.new.timestamp),
              ip: payload.new.ip_address,
              isp: payload.new.isp || 'Unknown',
              city: payload.new.city || 'Unknown',
              region: payload.new.region || 'Unknown',
              country: payload.new.country || 'Unknown',
              userAgent: payload.new.user_agent || '',
              authorized: payload.new.authorized,
              device: payload.new.device || 'Unknown',
              browser: payload.new.browser || 'Unknown',
              os: payload.new.os || 'Unknown',
            };

            setAnalytics(prev => {
              if (!prev) return prev;
              
              // Update both the click list AND the counts
              const newTotalClicks = prev.totalClicks + 1;
              
              // Check if this is a unique IP for unique clicks
              const isUniqueClick = !prev.clicks.some(click => 
                click.ip === newClick.ip
              );
              const newUniqueClicks = isUniqueClick ? 
                prev.uniqueClicks + 1 : prev.uniqueClicks;

              return {
                ...prev,
                totalClicks: newTotalClicks,
                uniqueClicks: newUniqueClicks,
                clicks: [newClick, ...prev.clicks],
              };
            });
          }
        )
        .subscribe();
    };

    setupSubscriptions();

    // Cleanup subscriptions on unmount
    return () => {
      if (urlSubscription) {
        supabase.removeChannel(urlSubscription);
      }
      if (analyticsSubscription) {
        supabase.removeChannel(analyticsSubscription);
      }
    };
  }, [shortCode, analytics?.shortCode]);

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
        <div className="container py-4 px-4 sm:py-6 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-4 sm:mb-6">
              <div className="h-8 sm:h-10 bg-muted rounded mb-3 sm:mb-4 animate-pulse"></div>
              <div className="h-6 sm:h-8 bg-muted rounded w-3/4 mb-2 animate-pulse"></div>
              <div className="h-3 sm:h-4 bg-muted rounded w-1/2 animate-pulse"></div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="h-12 sm:h-16 bg-muted rounded animate-pulse"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="mb-4 sm:mb-6">
              <CardContent className="p-4 sm:p-6">
                <div className="h-64 sm:h-96 bg-muted rounded animate-pulse"></div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 sm:p-6">
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
        <div className="container py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-bold mb-4">Analytics Not Found</h1>
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">
              The analytics for this URL could not be found.
            </p>
            <Button onClick={() => router.back()} size="sm" className="sm:size-default">
              <FaArrowLeft className="w-4 h-4 mr-2" />
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
      <div className="container py-4 px-4 sm:py-6 sm:px-6 lg:py-8 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-4 sm:mb-6">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-3 sm:mb-4 -ml-2 sm:-ml-4"
              size="sm"
            >
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Back to URLs
            </Button>
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 break-words">
                    Analytics for {process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/{analytics.shortCode}
                  </h1>
                  <p className="text-muted-foreground text-sm sm:text-base break-all leading-relaxed">
                    {analytics.originalUrl}
                  </p>
                </div>
                {analytics.isPasswordProtected && (
                  <Badge variant="secondary" className="self-start shrink-0">
                    <IoShield className="w-3 h-3 mr-1" />
                    Password Protected
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <Card className="hover:shadow-md transition-all duration-200 hover:scale-[1.01] cursor-pointer">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Total Clicks</p>
                    <p className="text-lg sm:text-2xl font-bold">{analytics.totalClicks}</p>
                  </div>
                  <CiGlobe className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground shrink-0" />
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-all duration-200 hover:scale-[1.01] cursor-pointer">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Unique Visitors</p>
                    <p className="text-lg sm:text-2xl font-bold">{analytics.uniqueClicks}</p>
                  </div>
                  <FaRegUser className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground shrink-0" />
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-all duration-200 hover:scale-[1.01] cursor-pointer">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Created</p>
                    <p className="text-sm sm:text-lg lg:text-2xl font-bold">{analytics.createdAt.toLocaleDateString()}</p>
                  </div>
                  <FaRegClock className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground shrink-0" />
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-all duration-200 hover:scale-[1.01] cursor-pointer">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Avg. Daily</p>
                    <p className="text-lg sm:text-2xl font-bold">
                      {Math.round(analytics.totalClicks / Math.max(1, Math.ceil((Date.now() - analytics.createdAt.getTime()) / (1000 * 60 * 60 * 24))))}
                    </p>
                  </div>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Click Analytics Chart */}
          <Card className="mb-4 sm:mb-6 hover:shadow-md transition-all duration-200 hover:scale-[1.01] cursor-pointer">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col gap-3 sm:gap-4">
                <div>
                  <CardTitle className="text-lg sm:text-xl">Clicks Over Time (Last 30 Days)</CardTitle>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Hover over the chart to see detailed daily statistics
                  </p>
                </div>
                <div className="flex gap-4 sm:gap-6 text-sm">
                  <div className="text-center">
                    <div className="text-base sm:text-lg font-bold text-green-600">{averageDailyClicks}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Avg/Day</div>
                  </div>
                  {peakDay && (
                    <div className="text-center">
                      <div className="text-base sm:text-lg font-bold text-blue-600">{peakDay.clicks}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">Peak Day</div>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="h-64 sm:h-80 lg:h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                    <defs>
                      <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      tick={{ fontSize: 10 }}
                      tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                      interval="preserveStartEnd"
                    />
                    <YAxis 
                      tick={{ fontSize: 10 }}
                      tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                      axisLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                      width={30}
                    />
                    <Tooltip 
                      labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                      formatter={(value) => [
                        <span key="value" className="font-semibold">{value} clicks</span>, 
                        ''
                      ]}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        fontSize: '12px'
                      }}
                      cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '2 2' }}
                    />
                    {peakDay && (
                      <ReferenceLine 
                        x={peakDay.date} 
                        stroke="hsl(var(--destructive))" 
                        strokeDasharray="4 4"
                        label={{ value: "Peak", position: "top", fontSize: 10 }}
                      />
                    )}
                    <Area
                      type="monotone"
                      dataKey="clicks"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fill="url(#clicksGradient)"
                      dot={{ 
                        fill: 'hsl(var(--primary))', 
                        strokeWidth: 2, 
                        stroke: 'hsl(var(--background))',
                        r: 3
                      }}
                      activeDot={{ 
                        r: 5, 
                        fill: 'hsl(var(--primary))',
                        stroke: 'hsl(var(--background))',
                        strokeWidth: 2,
                        filter: 'drop-shadow(0 2px 4px rgb(0 0 0 / 0.1))'
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 sm:mt-4 flex flex-wrap gap-3 sm:gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span>Daily Clicks</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-1 bg-destructive"></div>
                  <span>Peak Day</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-1 border border-primary border-dashed"></div>
                  <span>Hover Cursor</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Click Table */}
          <Card className="hover:shadow-md transition-all duration-200 hover:scale-[1.01] cursor-pointer">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">Detailed Click Data</CardTitle>
            </CardHeader>
            <CardContent className="p-0 sm:p-6 sm:pt-0">
              {/* Mobile Card View */}
              <div className="block sm:hidden">
                <div className="space-y-3 p-4">
                  {analytics.clicks.map((click) => (
                    <Card key={click.id} className="p-4 space-y-3 hover:shadow-md transition-all duration-200 hover:scale-[1.01] cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">
                          {click.timestamp.toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {click.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <div className="text-muted-foreground mb-1">IP Address</div>
                          <div className="font-mono text-xs">{click.ip}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">ISP</div>
                          <div className="truncate">{click.isp}</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <FiMapPin className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs">{click.city}, {click.region}, {click.country}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaDesktop className="w-3 h-3 text-muted-foreground" />
                          <div className="flex gap-2 flex-wrap">
                            <Badge variant="outline" className="text-xs py-0">{click.device}</Badge>
                            <Badge variant="outline" className="text-xs py-0">{click.browser}</Badge>
                            <Badge variant="outline" className="text-xs py-0">{click.os}</Badge>
                          </div>
                        </div>
                      </div>



                      {analytics.isPasswordProtected && (
                        <div>
                          <div className="text-muted-foreground text-xs mb-1">Authorized</div>
                          {click.authorized === null ? (
                            <Badge variant="outline" className="text-xs">N/A</Badge>
                          ) : click.authorized ? (
                            <Badge variant="default" className="bg-green-500 text-xs">
                              ✓ Yes
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="text-xs">✗ No</Badge>
                          )}
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[140px]">Timestamp</TableHead>
                      <TableHead className="min-w-[120px]">IP Address</TableHead>
                      <TableHead className="min-w-[160px]">Location</TableHead>
                      <TableHead className="min-w-[120px]">ISP</TableHead>
                      <TableHead className="min-w-[80px]">Device</TableHead>
                      <TableHead className="min-w-[80px]">Browser</TableHead>
                      <TableHead className="min-w-[100px]">OS</TableHead>

                      {analytics.isPasswordProtected && <TableHead className="min-w-[100px]">Authorized</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analytics.clicks.map((click) => (
                      <TableRow key={click.id}>
                        <TableCell>
                          <div className="text-sm">
                            <div>{click.timestamp.toLocaleDateString()}</div>
                            <div className="text-muted-foreground">
                              {click.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {click.ip}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{click.city}, {click.region}</div>
                            <div className="text-muted-foreground">{click.country}</div>
                          </div>
                        </TableCell>
                        <TableCell>{click.isp}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{click.device}</Badge>
                        </TableCell>
                        <TableCell>{click.browser}</TableCell>
                        <TableCell>{click.os}</TableCell>

                        {analytics.isPasswordProtected && (
                          <TableCell>
                            {click.authorized === null ? (
                              <Badge variant="outline">N/A</Badge>
                            ) : click.authorized ? (
                              <Badge variant="default" className="bg-green-500">
                                ✓ Yes
                              </Badge>
                            ) : (
                              <Badge variant="destructive">✗ No</Badge>
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}