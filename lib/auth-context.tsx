"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
  Session,
  User as SupabaseUser,
  AuthError,
} from "@supabase/supabase-js";

// Extend the User type to ensure TypeScript knows about the identities property
type User = SupabaseUser & {
  identities?: Array<{
    id: string;
    user_id: string;
    identity_data?: Record<string, any>;
    provider: string;
    created_at?: string;
    last_sign_in_at?: string;
    updated_at?: string;
  }>;
};

type UserProfile = {
  id: string
  name: string | null
  email: string | null
  avatarUrl?: string | null
  provider?: "github" | "google" | "email" | null
  providerAvatarUrl?: string | null
  avatarSource?: 'upload' | 'provider' | 'url' | 'default'
  availableProviders?: Array<{
    provider: string
    avatarUrl: string | null
    name: string | null
  }>
}

type AuthContextType = {
  user: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  signUp: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ error: AuthError | null }>;
  signInWithGithub: () => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  updateProfile: (data: {
    name?: string;
    avatarUrl?: string | null;
    avatarSource?: "upload" | "provider" | "url" | "default";
  }) => Promise<{ error: Error | null }>;
  uploadAvatar: (file: File) => Promise<{ url?: string; error: Error | null }>;
  getDisplayAvatarUrl: () => string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  const createUserProfile = (
    sessionUser: SupabaseUser,
    existingProfile?: any
  ) => {

    const identities = (sessionUser as User).identities || [];

    // Filter out email provider and get OAuth providers
    const oauthProviders = identities.filter(
      (identity) =>
        identity.provider !== "email" && identity.provider !== "phone"
    );

    // Get the most recent OAuth provider (or first available)
    const primaryProvider =
      oauthProviders.length > 0
        ? oauthProviders[oauthProviders.length - 1] // Most recent
        : { provider: "email", identity_data: {} };

    const provider = primaryProvider.provider as "github" | "google" | "email";

    // Get provider-specific avatar URL
    const providerAvatarUrl =
      provider !== "email"
        ? (primaryProvider.identity_data as Record<string, any> | undefined)?.avatar_url ||
          sessionUser.user_metadata?.avatar_url ||
          sessionUser.user_metadata?.picture ||
          null
        : null;

    // Get all available provider avatars for selection
    const availableProviders = oauthProviders.map((identity) => ({
      provider: identity.provider,
      avatarUrl: identity.identity_data?.avatar_url || null,
      name: identity.identity_data?.full_name || null,
    }));

    return {
      id: sessionUser.id,
      name:
        existingProfile?.full_name ||
        sessionUser.user_metadata?.full_name ||
        null,
      email: sessionUser.email || null,
      avatarUrl: existingProfile?.avatar_url || null,
      provider: provider,
      providerAvatarUrl: providerAvatarUrl,
      avatarSource: existingProfile?.avatar_source || "upload",
      website: existingProfile?.website || null,
      availableProviders: availableProviders,
    };
  };

  const getDisplayAvatarUrl = (): string | null => {
    if (!user) return null;

    switch (user.avatarSource) {
      case "provider":
        // For provider source, use the avatarUrl which should contain the selected provider's URL
        return user.avatarUrl ?? null;
      case "url":
        return user.avatarUrl ?? null;
      case "default":
        // Return null to trigger the AvatarFallback which will show initials
        return null;
      case "upload":
      default:
        return user.avatarUrl ?? null;
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);

      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error fetching session:", error.message);
          return;
        }

        setSession(session);

        if (session?.user) {
          // Fetch existing profile first
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          // Create user profile prioritizing existing data
          const userProfile = createUserProfile(session.user, profile);
          setUser(userProfile);
        }
      } catch (error) {
        console.error("Error in session fetch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);

      if (session?.user) {
        // Handle profile operations
        const handleUserProfile = async () => {
          try {
            // Check if profile exists
            const { data: existingProfile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();

            // Create user profile prioritizing existing data
            const userProfile = createUserProfile(
              session.user,
              existingProfile
            );
            setUser(userProfile);

            // Only create profile if it doesn't exist, NEVER update existing ones
            if (!existingProfile) {
              await supabase.from("profiles").insert({
                id: session.user.id,
                full_name: session.user.user_metadata?.full_name || null,
                avatar_url: null,
                avatar_source: "upload",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              });
            }
          } catch (error) {
            console.error("Error handling profile operations:", error);
            // Fallback: set user with just session data
            const userProfile = createUserProfile(session.user);
            setUser(userProfile);
          }
        };

        handleUserProfile();
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return { error };
    } catch (error) {
      console.error("Sign in error:", error);
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);
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
      });

      if (!error && data.user) {
        // Create a profile entry for new signups
        await supabase.from("profiles").insert({
          id: data.user.id,
          full_name: name,
          avatar_source: "upload",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }

      return { error };
    } catch (error) {
      console.error("Sign up error:", error);
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signInWithGithub = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      return { error };
    } catch (error) {
      console.error("GitHub sign in error:", error);
      return { error: error as AuthError };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      return { error };
    } catch (error) {
      console.error("Google sign in error:", error);
      return { error: error as AuthError };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const updateProfile = async (data: {
    name?: string;
    avatarUrl?: string | null;
    avatarSource?: "upload" | "provider" | "url" | "default";
  }) => {
    if (!user || !session) {
      return { error: new Error("No authenticated user found") };
    }

    try {
      // Update profile in database
      const updates: any = {
        updated_at: new Date().toISOString(),
      };

      if (data.name !== undefined) updates.full_name = data.name;
      if (data.avatarUrl !== undefined) updates.avatar_url = data.avatarUrl;
      if (data.avatarSource !== undefined)
        updates.avatar_source = data.avatarSource;

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

      if (error) {
        throw error;
      }

      // Update local state
      setUser({
        ...user,
        name: data.name ?? user.name,
        avatarUrl:
          data.avatarUrl === undefined ? user.avatarUrl : data.avatarUrl,
        avatarSource: data.avatarSource ?? user.avatarSource,
      });

      return { error: null };
    } catch (error) {
      console.error("Error updating profile:", error);
      return { error: error as Error };
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!user || !session) {
      return { error: new Error("No authenticated user found") };
    }

    try {
      // Create a unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload file to Supabase storage
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        if (error.message.includes("Bucket not found")) {
          throw new Error(
            "Storage bucket not found. Please set up the avatars bucket in Supabase. See AVATAR_SETUP.md for instructions."
          );
        }
        throw error;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      return { url: publicUrl, error: null };
    } catch (error) {
      console.error("Error uploading avatar:", error);
      return { error: error as Error };
    }
  };

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
        signOut,
        updateProfile,
        uploadAvatar,
        getDisplayAvatarUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}