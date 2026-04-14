'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageBubble } from './MessageBubble'
import { RecorderControls } from './RecorderControls'
import { createClient } from '@/lib/supabase/client'
import { LogOut, User as UserIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Message {
  id?: string
  role: 'user' | 'assistant'
  content: string
  created_at?: string
}

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([])
  const [error, setError] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    fetchMessages()
    getUser()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) setUserEmail(user.email ?? 'Anonymous')
  }

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching messages:', error)
    } else if (data) {
      setMessages(data)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleTranscription = (transcript: string) => {
    setMessages(prev => [...prev, { role: 'user', content: transcript }])
    sendToOpenClaw(transcript)
  }

  const sendToOpenClaw = (transcript: string) => {
    // Placeholder function for future OpenClaw integration
    console.log('Sending to OpenClaw:', transcript)
    
    // Simulate assistant response
    setTimeout(() => {
      const response = "I've received your transcription. This is a placeholder for the OpenClaw integration response."
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
      
      // We don't save assistant response to DB yet in this minimal version, 
      // but we could if needed.
    }, 1000)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <div className="flex h-screen w-full flex-col bg-zinc-950 font-sans text-zinc-100">
      {/* Navbar */}
      <header className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/50 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
            <span className="text-lg font-bold">O</span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight">OpenClaw Chat</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <UserIcon className="h-4 w-4" />
            <span>{userEmail}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg bg-zinc-800 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-zinc-700"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto px-6 py-8">
        <div className="mx-auto max-w-3xl space-y-2">
          {messages.length === 0 && (
            <div className="flex h-[40vh] flex-col items-center justify-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800">
                <Mic className="h-8 w-8 text-indigo-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Start a conversation</h2>
                <p className="max-w-xs text-zinc-400">Tap the microphone below and speak to transcribe your voice.</p>
              </div>
            </div>
          )}
          {messages.map((msg, index) => (
            <MessageBubble key={index} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="border-t border-zinc-800 bg-zinc-900/50 px-6 py-6 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <div className="flex-1">
            {error && (
              <p className="mb-2 text-sm text-red-500">{error}</p>
            )}
            <div className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-4 min-h-[56px] flex items-center text-zinc-400 italic">
              Transcription will appear here after recording...
            </div>
          </div>
          <RecorderControls 
            onTranscription={handleTranscription} 
            onError={setError} 
          />
        </div>
      </footer>
    </div>
  )
}

function Mic({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>
    </svg>
  )
}
