"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

type User = {
  id: string
  name: string
  email: string
  avatarUrl?: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user data for demo purposes
const MOCK_USERS = [
  {
    id: "1",
    name: "John Developer",
    email: "john@example.com",
    password: "password123",
    avatarUrl: undefined,
  },
  {
    id: "2",
    name: "Jane Coder",
    email: "jane@example.com",
    password: "password123",
    avatarUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing session in localStorage
    const checkSession = () => {
      try {
        const savedUser = localStorage.getItem("demo-user")
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }
      } catch (error) {
        console.error("Error loading user session:", error)
      }
      setLoading(false)
    }

    checkSession()
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockUser = MOCK_USERS.find((u) => u.email === email && u.password === password)

    if (mockUser) {
      const user = {
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        avatarUrl: mockUser.avatarUrl,
      }

      setUser(user)
      localStorage.setItem("demo-user", JSON.stringify(user))
      setLoading(false)
      return { error: null }
    } else {
      setLoading(false)
      return { error: { message: "Invalid email or password" } }
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    const existingUser = MOCK_USERS.find((u) => u.email === email)
    if (existingUser) {
      setLoading(false)
      return { error: { message: "User with this email already exists" } }
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      avatarUrl: undefined,
    }

    setUser(newUser)
    localStorage.setItem("demo-user", JSON.stringify(newUser))
    setLoading(false)
    return { error: null }
  }

  const signOut = async () => {
    setUser(null)
    localStorage.removeItem("demo-user")
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
