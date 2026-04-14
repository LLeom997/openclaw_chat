'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, Square, Loader2 } from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface RecorderControlsProps {
  onTranscription: (text: string) => void
  onError: (error: string) => void
}

export function RecorderControls({ onTranscription, onError }: RecorderControlsProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
        await headTranscription(audioBlob)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (err) {
      console.error('Error accessing microphone:', err)
      onError('Microphone access denied or not available.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const headTranscription = async (blob: Blob) => {
    setIsUploading(true)
    const formData = new FormData()
    formData.append('audio', blob, 'recording.webm')

    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (data.transcript) {
        onTranscription(data.transcript)
      } else {
        onError(data.error || 'Transcription failed')
      }
    } catch (err) {
      onError('Network error during transcription')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      {isRecording ? (
        <button
          onClick={stopRecording}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white transition-all hover:bg-red-50 hover:scale-105 active:scale-95 shadow-lg shadow-red-900/20"
        >
          <Square className="h-5 w-5 fill-current" />
        </button>
      ) : (
        <button
          onClick={startRecording}
          disabled={isUploading}
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full transition-all shadow-lg",
            isUploading 
              ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" 
              : "bg-indigo-600 text-white hover:bg-indigo-500 hover:scale-105 active:scale-95 shadow-indigo-900/20"
          )}
        >
          {isUploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
        </button>
      )}
      
      {isRecording && (
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <span className="text-sm font-medium text-red-500 animate-pulse">Recording...</span>
        </div>
      )}
    </div>
  )
}
