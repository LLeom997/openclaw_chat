'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowUp, Paperclip, Command } from 'lucide-react'
import { RecorderControls } from './RecorderControls'

interface ChatInputProps {
  onSendMessage: (text: string) => void
  onTranscription: (text: string) => void
  onError: (error: string) => void
}

export function ChatInput({ onSendMessage, onTranscription, onError }: ChatInputProps) {
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target
    setText(target.value)
    target.style.height = 'auto'
    target.style.height = `${Math.min(target.scrollHeight, 180)}px`
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSend = () => {
    if (!text.trim()) return
    onSendMessage(text)
    setText('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`
    }
  }, [text])

  const handleTranscriptionInternal = (transcript: string) => {
    setText(prev => (prev ? `${prev} ${transcript}` : transcript))
    onTranscription(transcript)
  }

  return (
    <div className="shrink-0 p-4 px-8 pb-6 bg-[color-mix(in_oklch,var(--bg)_90%,transparent)] backdrop-blur-xl z-20">
      <div className="max-w-[720px] mx-auto flex flex-col gap-[var(--space-3)]">
        <div className="flex items-end gap-[var(--space-3)] bg-[var(--surface-2)] border border-[var(--border)] rounded-[var(--radius-2xl)] p-3 px-4 shadow-[var(--shadow-sm)] focus-within:border-[var(--accent)] focus-within:shadow-[0_0_0_3px_var(--accent-subtle),var(--shadow-md)] transition-all">

          <RecorderControls
            onTranscription={handleTranscriptionInternal}
            onError={onError}
          />

          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Message OpenClaw..."
            className="flex-1 bg-transparent border-none outline-none font-inherit text-[var(--text-sm)] color-[var(--text)] resize-none min-h-[24px] max-h-[180px] line-height-[1.6] py-[2px] placeholder:text-[var(--text-faint)]"
          />

          <div className="flex items-center gap-[var(--space-2)] shrink-0 pb-[2px]">
            <button className="w-8 h-8 rounded-[var(--radius-md)] flex items-center justify-center text-[var(--text-faint)] hover:bg-[var(--accent-subtle)] hover:text-[var(--text-muted)] transition-all">
              <Paperclip className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleSend}
              disabled={!text.trim()}
              className="w-9 h-9 rounded-[var(--radius-lg)] bg-[var(--accent)] text-white flex items-center justify-center hover:bg-[var(--accent-hover)] hover:scale-[1.04] active:scale-[0.94] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2 text-[var(--text-xs)] text-[var(--text-faint)]">
            <span className="flex items-center gap-1.5 p-1 px-2 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] font-mono text-[10px]">
              <Command className="w-2.5 h-2.5" />
              <span>Enter</span>
            </span>
            <span>send</span>
          </div>
        </div>
      </div>
    </div>
  )
}
