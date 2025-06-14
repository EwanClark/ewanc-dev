"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "./supabase"
import { Session, User, AuthError } from "@supabase/supabase-js"

type UserProfile = {
  id: string
  name: string | null
  email: string | null
  avatarUrl?: string | null
}

type AuthContextType = {
  user: UserProfile | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signUp: (email: string, password: string, name: string) => Promise<{ error: AuthError | null }>
  signInWithGithub: () => Promise<{ error: AuthError | null }>
  signInWithGoogle: () => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true)
      
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error("Error fetching session:", error.message)
          return
        }
        
        setSession(session)
        
        if (session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single()
          
          setUser({
            id: session.user.id,
            name: profile?.full_name || session.user.user_metadata?.full_name || null,
            email: session.user.email || null,
            avatarUrl: profile?.avatar_url || session.user.user_metadata?.avatar_url || null,
          })
        }
      } catch (error) {
        console.error("Error in session fetch:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.full_name || null,
          email: session.user.email || null,
          avatarUrl: session.user.user_metadata?.avatar_url || null,
        })

        // Update profile in the background
        supabase
          .from("profiles")
          .upsert({
            id: session.user.id,
            full_name: session.user.user_metadata?.full_name || null,
            avatar_url: session.user.user_metadata?.avatar_url || null,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'id' })
          .then(({ error }) => {
            if (error) console.error("Error updating profile:", error)
          })
      } else {
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      return { error }
    } catch (error) {
      console.error("Sign in error:", error)
      return { error: error as AuthError }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (!error && data.user) {
        // Create a profile entry
        await supabase.from("profiles").upsert({
          id: data.user.id,
          full_name: name,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      }

      return { error }
    } catch (error) {
      console.error("Sign up error:", error)
      return { error: error as AuthError }
    } finally {
      setLoading(false)
    }
  }

  const signInWithGithub = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      return { error }
    } catch (error) {
      console.error("GitHub sign in error:", error)
      return { error: error as AuthError }
    }
  }

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      return { error }
    } catch (error) {
      console.error("Google sign in error:", error)
      return { error: error as AuthError }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        session, 
        loading, 
        signIn, 
        signUp, 
        signInWithGithub, 
        signInWithGoogle, 
        signOut 
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
