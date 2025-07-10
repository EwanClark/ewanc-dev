import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { shortCode } = await params;

    // Get the short URL and verify ownership
    const { data: shortUrl, error: urlError } = await supabase
      .from('short_urls')
      .select('*')
      .eq('short_code', shortCode)
      .eq('user_id', user.id)
      .single();

    if (urlError || !shortUrl) {
      return NextResponse.json(
        { error: 'Short URL not found or access denied' },
        { status: 404 }
      );
    }

    // Get all analytics data for this URL
    const { data: analyticsData, error: analyticsError } = await supabase
      .from('short_url_analytics')
      .select('*')
      .eq('short_url_id', shortUrl.id)
      .order('timestamp', { ascending: false });

    if (analyticsError) {
      console.error('Error fetching analytics:', analyticsError);
      return NextResponse.json(
        { error: 'Failed to fetch analytics data' },
        { status: 500 }
      );
    }

    // Process and format analytics data
    const analytics = {
      shortCode: shortUrl.short_code,
      originalUrl: shortUrl.original_url,
      createdAt: new Date(shortUrl.created_at),
      totalClicks: shortUrl.total_clicks,
      uniqueClicks: shortUrl.unique_clicks,
      isPasswordProtected: !!shortUrl.password_hash,
      clicks: analyticsData.map(click => ({
        id: click.id,
        timestamp: new Date(click.timestamp),
        ip: click.ip_address,
        isp: click.isp || 'Unknown',
        city: click.city || 'Unknown',
        region: click.region || 'Unknown',
        country: click.country || 'Unknown',
        userAgent: click.user_agent || '',
        authorized: click.authorized,

        device: click.device || 'Unknown',
        browser: click.browser || 'Unknown',
        os: click.os || 'Unknown',
      }))
    };

    return NextResponse.json({
      success: true,
      analytics
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });

  } catch (error) {
    console.error('Error in analytics API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 