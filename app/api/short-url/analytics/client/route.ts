import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { shortCode, clickId, clientData } = body;

    if (!shortCode || !clientData) {
      return NextResponse.json(
        { error: 'Missing required data' },
        { status: 400 }
      );
    }

    // Use service role for system operations (bypasses RLS)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    if (clickId) {
      // Update existing click record with client-side data
      const { error } = await supabase
        .from('short_url_analytics')
        .update({
          vm: clientData.vm,
          incognito: clientData.incognito,
          timezone: clientData.timezone,
          language: clientData.language,
          screen_size: clientData.screen_size,
          battery_level: clientData.battery_level,
          charging_status: clientData.charging_status,
          connection_type: clientData.connection_type,
          local_ip: clientData.local_ip
        })
        .eq('id', clickId);

      if (error) {
        console.error('Error updating analytics with client data:', error);
        return NextResponse.json(
          { error: 'Failed to update analytics' },
          { status: 500 }
        );
      }
    } else {
      // If no clickId provided, we can't update a specific record
      console.warn('No clickId provided for client analytics update');
      return NextResponse.json(
        { error: 'No click ID provided' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in client analytics API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
