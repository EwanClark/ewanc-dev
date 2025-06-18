import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Ensure the user is authenticated
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const userId = session.user.id
    
    // Delete user data from profiles table first
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId)
    
    if (profileError) {
      console.error('Error deleting profile:', profileError)
      return NextResponse.json(
        { error: 'Failed to delete profile data' },
        { status: 500 }
      )
    }
    
    // Add more table cleanups as needed
    // e.g. delete user's posts, comments, etc.

    // In a production environment, you would use Supabase Admin APIs 
    // or a server-side function to actually delete the user account
    // This would typically require setting up a server with admin credentials
    
    // For now, we'll just return success and let the client handle signout
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in delete account route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
