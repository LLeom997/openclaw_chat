'use client'

import { cn } from "@/lib/utils"
import { Copy, ThumbsUp, RotateCcw } from "lucide-react"

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div className={cn("flex gap-4 items-start animate-msg-in", isUser ? "flex-row-reverse" : "flex-row")}>
      <div className={cn(
        "w-[30px] h-[30px] rounded-full shrink-0 flex items-center justify-center text-[var(--text-xs)] font-bold mt-[2px]",
        isUser ? "bg-gradient-to-br from-[var(--accent)] to-indigo-600 text-white" : "bg-[var(--accent-subtle)] border border-[var(--border)] text-[var(--accent)]"
      )}>
        {isUser ? 'AK' : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 2L3 7l9 5 9-5-9-5z" />
            <path d="M3 17l9 5 9-5" />
            <path d="M3 12l9 5 9-5" />
          </svg>
        )}
      </div>

      <div className={cn("max-w-[min(520px,100%)] flex flex-col gap-[var(--space-1)]", isUser && "items-end")}>
        <div className={cn(
          "px-4 py-3 rounded-[var(--radius-xl)] text-[var(--text-sm)] leading-[1.65] break-words shadow-[var(--shadow-sm)]",
          isUser
            ? "bg-[var(--user-bubble)] text-[var(--user-text)] border-none rounded-br-[var(--radius-md)]"
            : "bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border-subtle)] rounded-bl-[var(--radius-md)]"
        )}>
          {message.content}
        </div>

        <div className={cn("flex items-center gap-[var(--space-2)] px-2", isUser && "flex-row-reverse")}>
          <span className="text-[var(--text-xs)] text-[var(--text-faint)]">{time}</span>
          {!isUser && (
            <div className="flex gap-[var(--space-1)] opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="w-7 h-7 rounded-[var(--radius-md)] flex items-center justify-center text-[var(--text-faint)] hover:bg-[var(--surface-offset)] hover:text-[var(--text-muted)] transition-all">
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button className="w-7 h-7 rounded-[var(--radius-md)] flex items-center justify-center text-[var(--text-faint)] hover:bg-[var(--surface-offset)] hover:text-[var(--text-muted)] transition-all">
                <ThumbsUp className="w-3.5 h-3.5" />
              </button>
              <button className="w-7 h-7 rounded-[var(--radius-md)] flex items-center justify-center text-[var(--text-faint)] hover:bg-[var(--surface-offset)] hover:text-[var(--text-muted)] transition-all">
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}