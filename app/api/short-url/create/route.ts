import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { originalUrl, customAlias, password } = body;

    // Validate required fields
    if (!originalUrl) {
      return NextResponse.json(
        { error: 'Original URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(originalUrl);
    } catch {
      return NextResponse.json(
        { error: 'Please enter a valid URL including http:// or https://' },
        { status: 400 }
      );
    }

    // Generate short code if no custom alias provided
    const shortCode = customAlias || Math.random().toString(36).substring(2, 8);

    // Check if short code is already taken
    const { data: existingUrl } = await supabase
      .from('short_urls')
      .select('id')
      .ilike('short_code', shortCode)
      .single();

    if (existingUrl) {
      return NextResponse.json(
        { error: 'This short code is already taken. Please choose another one.' },
        { status: 409 }
      );
    }

    // Hash password if provided
    let passwordHash = null;
    if (password) {
      passwordHash = await bcrypt.hash(password, 10);
    }

    // Create the short URL
    const { data: shortUrl, error: insertError } = await supabase
      .from('short_urls')
      .insert({
        user_id: user.id,
        original_url: originalUrl,
        short_code: shortCode,
        password_hash: passwordHash,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating short URL:', insertError);
      return NextResponse.json(
        { error: 'Failed to create short URL' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      shortUrl: {
        id: shortUrl.id,
        originalUrl: shortUrl.original_url,
        shortCode: shortUrl.short_code,
        createdAt: shortUrl.created_at,
        totalClicks: shortUrl.total_clicks,
        uniqueClicks: shortUrl.unique_clicks,
        isPasswordProtected: !!shortUrl.password_hash,
      },
      message: `URL shortened successfully! Your short URL is: ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${shortCode}`
    });

  } catch (error) {
    console.error('Error in create short URL:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 