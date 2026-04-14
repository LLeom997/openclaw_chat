'use client'

import { Plus, MessageSquare, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const CONVO_GROUPS = [
  {
    label: "Today",
    items: [
      { id: "1", title: "Design system review", active: true },
      { id: "2", title: "API integration help", active: false },
    ],
  },
  {
    label: "Yesterday",
    items: [
      { id: "3", title: "Thermal analysis Q+", active: false },
      { id: "4", title: "Packaging spec clarification", active: false },
    ],
  },
  {
    label: "This week",
    items: [
      { id: "5", title: "MAGNETO VPD results", active: false },
      { id: "6", title: "Drop test simulation setup", active: false },
    ],
  },
]

export function Sidebar() {
  return (
    <aside className="w-[var(--sidebar-w)] hidden md:flex flex-col bg-[var(--surface)] border-r border-[var(--border)] overflow-hidden relative z-10 h-screen">
      <div className="flex items-center gap-[var(--space-3)] p-5 pb-4 border-b border-[var(--border-subtle)]">
        <div className="w-8 h-8 rounded-[var(--radius-lg)] bg-[var(--accent)] flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L3 7l9 5 9-5-9-5z" />
            <path d="M3 17l9 5 9-5" />
            <path d="M3 12l9 5 9-5" />
          </svg>
        </div>
        <div>
          <div className="text-[var(--text-sm)] font-semibold text-[var(--text)] tracking-tight">OpenClaw</div>
          <div className="text-[var(--text-xs)] text-[var(--text-faint)] mt-[1px]">Voice Interface</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-[var(--space-3)] py-[var(--space-4)] scrollbar-thin">
        <button className="w-full flex items-center gap-[var(--space-3)] p-3 px-4 rounded-[var(--radius-lg)] text-[var(--text-sm)] color-[var(--text-muted)] border border-dashed border-[var(--border)] hover:bg-[var(--surface-2)] hover:text-[var(--text)] hover:border-[var(--border)] transition-all mb-5">
          <Plus className="w-3.5 h-3.5" />
          New conversation
        </button>

        {CONVO_GROUPS.map((group) => (
          <div key={group.label} className="mb-4">
            <div className="text-[var(--text-xs)] font-semibold text-[var(--text-faint)] tracking-widest uppercase px-3 mb-2 mt-4">
              {group.label}
            </div>
            {group.items.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "flex items-center gap-[var(--space-3)] p-2 px-3 rounded-[var(--radius-md)] cursor-pointer transition-all",
                  item.active ? "bg-[var(--accent-subtle)] text-[var(--accent)]" : "hover:bg-[var(--surface-offset)] text-[var(--text-muted)]"
                )}
              >
                <MessageSquare className={cn("w-3.5 h-3.5", item.active ? "text-[var(--accent)]" : "text-[var(--text-faint)]")} />
                <span className="text-[var(--text-sm)] truncate flex-1">{item.title}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="p-4 px-3 border-t border-[var(--border-subtle)] flex items-center gap-[var(--space-3)] bg-[var(--surface)]">
        <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-[var(--accent)] to-indigo-600 flex items-center justify-center text-[11px] font-bold text-white shrink-0 shadow-lg shadow-indigo-500/20">
          AK
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[var(--text-sm)] text-[var(--text)] font-medium truncate">Ankit K.</div>
          <div className="text-[var(--text-xs)] text-[var(--text-faint)]">Pro plan</div>
        </div>
        <button className="w-9 h-9 rounded-[var(--radius-md)] flex items-center justify-center text-[var(--text-faint)] hover:bg-[var(--surface-2)] hover:text-[var(--text-muted)] transition-all">
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </aside>
  )
}
