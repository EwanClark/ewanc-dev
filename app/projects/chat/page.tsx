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
      userName: user.name,
      userAvatar: user.avatarUrl,
      content: newMessage,
      timestamp: new Date(),
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-6 flex flex-col">
        <Card className="flex-1 flex flex-col">
          <CardHeader className="border-b">
            <CardTitle>Chat Room</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 flex flex-col">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${user && message.userId === user.id ? "flex-row-reverse" : ""}`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={message.userAvatar || "/placeholder.svg"} alt={message.userName} />
                      <AvatarFallback>
                        <Code className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`max-w-[80%] ${
                        user && message.userId === user.id ? "bg-primary text-primary-foreground" : "bg-muted"
                      } rounded-lg px-4 py-2`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{message.userName}</span>
                        <span className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="mt-1">{message.content}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            <div className="p-4 border-t">
              {user ? (
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <Button type="submit" size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              ) : (
                <div className="text-center py-2 text-muted-foreground">
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
