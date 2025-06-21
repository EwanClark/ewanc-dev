import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function DELETE(
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

    // Check if the URL exists and belongs to the user
    const { data: existingUrl, error: fetchError } = await supabase
      .from('short_urls')
      .select('id, user_id')
      .eq('short_code', shortCode)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !existingUrl) {
      return NextResponse.json(
        { error: 'Short URL not found or you do not have permission to delete it' },
        { status: 404 }
      );
    }

    // Delete the URL (this will also cascade delete analytics due to foreign key)
    const { error: deleteError } = await supabase
      .from('short_urls')
      .delete()
      .eq('id', existingUrl.id);

    if (deleteError) {
      console.error('Error deleting URL:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete URL' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Short URL "${shortCode}" has been deleted successfully.`
    });

  } catch (error) {
    console.error('Error in delete short URL:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 