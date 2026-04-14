import { createClient } from '@/lib/supabase/server'
import { openai } from '@/lib/openai/client'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File
    
    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 })
    }

    // Convert file to base64
    const arrayBuffer = await audioFile.arrayBuffer()
    const base64Audio = Buffer.from(arrayBuffer).toString('base64')

    // Call OpenRouter with input_audio
    const response = await openai.chat.completions.create({
      model: 'openai/gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Transcribe this audio exactly as spoken.' },
            {
              type: 'input_audio',
              input_audio: {
                data: base64Audio,
                format: audioFile.type.includes('wav') ? 'wav' : 'mp3',
              },
            },
          ],
        },
      ],
    })

    const transcript = response.choices[0]?.message?.content || ''

    if (!transcript) {
      return NextResponse.json({ error: 'Transcription failed' }, { status: 500 })
    }

    // Optional: Save to Supabase (Skipping user authentication for now)
    // You might need to update your RLS policies to allow anonymous inserts
    const supabase = await createClient()
    const { error: dbError } = await supabase
      .from('messages')
      .insert([
        {
          content: transcript,
          role: 'user',
          // user_id is skipped because auth is disabled for now
        }
      ])

    if (dbError) {
      console.error('Database error:', dbError)
    }

    return NextResponse.json({ transcript })

  } catch (error: any) {
    console.error('Transcription route error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
