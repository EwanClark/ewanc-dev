"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Code } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

type Message = {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  timestamp: Date
}

export default function ChatPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      userId: "system",
      userName: "System",
      content: "Welcome to the chat! This is a simple chat application demo.",
      timestamp: new Date(),
    },
    {
      id: "2",
      userId: "user1",
      userName: "Alice",
      content: "Hey everyone! How's it going?",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
      id: "3",
      userId: "user2",
      userName: "Bob",
      content: "Just working on some code. This portfolio site is looking great!",
      timestamp: new Date(Date.now() - 1000 * 60 * 3),
    },
  ])
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user) return

    const message: Message = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name || 'Anonymous',
      userAvatar: user.avatarUrl || undefined,
      content: newMessage,
      timestamp: new Date(),
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 container py-4 sm:py-6 flex flex-col">
        <Card className="flex-1 flex flex-col">
          <CardHeader className="border-b px-4 sm:px-6 py-3 sm:py-4">
            <CardTitle className="text-lg sm:text-xl">Chat Room</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 flex flex-col">
            <ScrollArea className="flex-1 p-3 sm:p-4">
              <div className="space-y-3 sm:space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-2 sm:gap-3 ${user && message.userId === user.id ? "flex-row-reverse" : ""}`}
                  >
                    <Avatar className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0">
                      <AvatarImage src={message.userAvatar || "/placeholder.svg"} alt={message.userName} />
                      <AvatarFallback>
                        <Code className="h-3 w-3 sm:h-4 sm:w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`max-w-[85%] sm:max-w-[80%] ${
                        user && message.userId === user.id ? "bg-primary text-primary-foreground" : "bg-muted"
                      } rounded-lg px-3 py-2 sm:px-4 sm:py-2`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-xs sm:text-sm">{message.userName}</span>
                        <span className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="mt-1 text-sm sm:text-base">{message.content}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            <div className="p-3 sm:p-4 border-t">
              {user ? (
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" className="flex-shrink-0">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              ) : (
                <div className="text-center py-2 text-muted-foreground text-sm">
                  Please{" "}
                  <a href="/login" className="text-primary hover:underline">
                    log in
                  </a>{" "}
                  to send messages
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
