'use client'

import { Search, Moon, Sun, ChevronDown } from "lucide-react"
import { useState, useEffect } from "react"

export function Topbar() {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const savedTheme = document.documentElement.getAttribute('data-theme') || 'dark'
    setTheme(savedTheme)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  return (
    <div className="flex items-center justify-between px-8 h-14 shrink-0 border-b border-[var(--border-subtle)] bg-[color-mix(in_oklch,var(--bg)_85%,transparent)] backdrop-blur-xl z-20">
      <div className="text-[var(--text-sm)] font-medium text-[var(--text-muted)] truncate max-w-[300px]">
        Design system review
      </div>

      <div className="flex items-center gap-[var(--space-2)]">
        <button className="flex items-center gap-[var(--space-2)] p-2 px-3 rounded-full border border-[var(--border)] text-[var(--text-xs)] text-[var(--text-muted)] bg-[var(--surface)] hover:bg-[var(--surface-2)] hover:border-[var(--accent-subtle)] transition-all">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
          <span>Claw-3.5</span>
          <ChevronDown className="w-3 h-3" />
        </button>

        <button className="w-9 h-9 rounded-[var(--radius-md)] flex items-center justify-center text-[var(--text-faint)] hover:bg-[var(--surface-2)] hover:text-[var(--text-muted)] transition-all">
          <Search className="w-4 h-4" />
        </button>

        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-[var(--radius-md)] flex items-center justify-center text-[var(--text-faint)] hover:bg-[var(--surface-2)] hover:text-[var(--text-muted)] transition-all"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </div>
  )
}
