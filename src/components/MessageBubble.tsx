import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  return (
    <div
      className={cn(
        'flex w-full mb-4',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-3 text-sm transition-all animate-in fade-in slide-in-from-bottom-2 duration-300',
          isUser
            ? 'bg-indigo-600 text-white rounded-tr-none'
            : 'bg-zinc-800 text-zinc-100 rounded-tl-none border border-zinc-700'
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  )
}
