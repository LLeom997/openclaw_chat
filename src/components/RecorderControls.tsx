'use client'

import { useState, useRef } from 'react'
import { Mic, Square, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

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
        try {
          const wavBlob = await convertWebMToWav(audioBlob)
          await headTranscription(wavBlob)
        } catch (err) {
          await headTranscription(audioBlob)
        }
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (err) {
      onError('Microphone access denied.')
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
    formData.append('audio', blob, 'recording.wav')

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
    <button
      onClick={isRecording ? stopRecording : startRecording}
      disabled={isUploading}
      className={cn(
        "w-9 h-9 rounded-full flex items-center justify-center transition-all",
        isRecording 
          ? "bg-[rgba(248,113,113,0.15)] text-[var(--mic-active)] mic-recording" 
          : "text-[var(--mic-idle)] hover:bg-[var(--accent-subtle)] hover:scale-[1.05]"
      )}
    >
      {isUploading ? (
        <Loader2 className="w-4 h-4 animate-spin text-[var(--text-faint)]" />
      ) : isRecording ? (
        <Square className="w-4 h-4 fill-current" />
      ) : (
        <Mic className="w-4 h-4" />
      )}
    </button>
  )
}

async function convertWebMToWav(webmBlob: Blob): Promise<Blob> {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  const arrayBuffer = await webmBlob.arrayBuffer()
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
  const numOfChan = audioBuffer.numberOfChannels
  const length = audioBuffer.length * numOfChan * 2 + 44
  const bufferArray = new ArrayBuffer(length)
  const view = new DataView(bufferArray)
  const channels = []
  let sample = 0; let offset = 0; let pos = 0
  function setUint16(data: number) { view.setUint16(pos, data, true); pos += 2 }
  function setUint32(data: number) { view.setUint32(pos, data, true); pos += 4 }
  setUint32(0x46464952); setUint32(length - 8); setUint32(0x45564157)
  setUint32(0x20746d66); setUint32(16); setUint16(1); setUint16(numOfChan)
  setUint32(audioBuffer.sampleRate); setUint32(audioBuffer.sampleRate * 2 * numOfChan)
  setUint16(numOfChan * 2); setUint16(16); setUint32(0x61746164); setUint32(length - pos - 4)
  for (let i = 0; i < audioBuffer.numberOfChannels; i++) { channels.push(audioBuffer.getChannelData(i)) }
  while (pos < length) {
    for (let i = 0; i < numOfChan; i++) {
       sample = Math.max(-1, Math.min(1, channels[i][offset])) 
       sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0 
       view.setInt16(pos, sample, true); pos += 2
    }
    offset++
  }
  return new Blob([bufferArray], { type: 'audio/wav' })
}
