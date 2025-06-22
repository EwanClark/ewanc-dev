import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
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

    // Get user's URLs
    const { data: urls, error: fetchError } = await supabase
      .from('short_urls')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error fetching URLs:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch URLs' },
        { status: 500 }
      );
    }

    // Format the response
    const formattedUrls = urls.map(url => ({
      id: url.id,
      originalUrl: url.original_url,
      shortCode: url.short_code,
      createdAt: new Date(url.created_at),
      totalClicks: url.total_clicks,
      uniqueClicks: url.unique_clicks,
      isPasswordProtected: !!url.password_hash,
      isActive: url.is_active,
    }));

    return NextResponse.json({
      success: true,
      urls: formattedUrls,
    });

  } catch (error) {
    console.error('Error in get user URLs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 