'use client'

import { useState, useEffect, useRef } from 'react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { ChatInput } from './ChatInput'
import { MessageBubble } from './MessageBubble'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([])
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = (text: string) => {
    const newMessage: Message = { role: 'user', content: text }
    setMessages(prev => [...prev, newMessage])
    
    // Simple mock response logic (to be replaced by real agent logic)
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Response will come from OpenClaw here. This is where your AI model reply will appear — rich, contextual, and voice-enabled.' 
      }])
    }, 1000)
  }

  const handleTranscription = (transcript: string) => {
    // Logic for partial transcription or intermediate state can go here
    setError(null)
  }

  return (
    <div className="flex h-screen w-full bg-[var(--bg)] text-[var(--text)] overflow-hidden font-sans">
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-w-0 h-screen relative">
        <Topbar />

        <ScrollArea className="flex-1">
          <div className="max-w-[720px] mx-auto px-6 py-10 flex flex-col gap-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center text-center pt-[clamp(2.5rem,10vh,6rem)]">
                <div className="w-16 h-16 rounded-[var(--radius-xl)] bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] mb-5 shadow-[var(--shadow-sm)]">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M12 2L3 7l9 5 9-5-9-5z"/><path d="M3 17l9 5 9-5"/><path d="M3 12l9 5 9-5"/>
                  </svg>
                </div>
                <h2 className="text-[var(--text-lg)] font-semibold tracking-tight mb-2">What can I help with?</h2>
                <p className="text-[var(--text-sm)] text-[var(--text-muted)] max-w-[36ch]">Speak or type — voice transcribes instantly.</p>
                
                <div className="flex flex-wrap gap-2 justify-center max-w-[560px] mt-8">
                  {['Explain thermal runaway causes', 'Help with DFMEA table format', 'Summarize drop test standards'].map(chip => (
                    <button 
                      key={chip} 
                      onClick={() => handleSendMessage(chip)}
                      className="px-4 py-2 rounded-full border border-[var(--border)] text-[var(--text-xs)] text-[var(--text-muted)] bg-[var(--surface)] hover:bg-[var(--surface-2)] hover:border-[var(--accent-subtle)] hover:text-[var(--text)] transition-all"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className="group">
                  <MessageBubble message={msg} />
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <ChatInput 
          onSendMessage={handleSendMessage} 
          onTranscription={handleTranscription} 
          onError={setError} 
        />

        {error && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-[var(--text-xs)] text-red-500 animate-in fade-in slide-in-from-bottom-2">
            {error}
          </div>
        )}
      </main>
    </div>
  )
}