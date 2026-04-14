import { NextResponse } from 'next/server'

const WORKER_URL = "https://openclaw-trans.maitreyanarendra1997.workers.dev";

export async function POST(request: Request) {
  try {
    console.log('[1/5] Received transcription request');
    
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File
    
    if (!audioFile) {
      console.log('[-] Error: No audio file provided in request');
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 })
    }

    if (audioFile.size === 0) {
      console.log('[-] Error: Audio file is empty');
      return NextResponse.json({ error: 'Audio file is empty' }, { status: 400 })
    }

    console.log(`[2/5] Extracted audio file: size=${audioFile.size} bytes, type=${audioFile.type}`);

    // Convert file to base64
    const arrayBuffer = await audioFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer as ArrayBuffer)
    const base64Audio = buffer.toString('base64')
    
    console.log(`[3/5] Converted audio to base64 string (Length: ${base64Audio.length})`);

    // Determine format to send (assume wav or mp3 for the worker based on typical browser types)
    const formatToSend = audioFile.type.includes('mp3') ? 'mp3' : 'wav'

    console.log(`[4/5] Sending payload to OpenClaw Worker Agent: ${WORKER_URL} with format: ${formatToSend}`);
    
    // Call the external worker
    const workerResponse = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        audio: base64Audio,
        format: formatToSend 
      })
    });

    if (!workerResponse.ok) {
      const errorText = await workerResponse.text();
      console.error(`[-] Worker returned error status ${workerResponse.status}:`, errorText);
      return NextResponse.json({ error: `Worker API Error: ${workerResponse.status}` }, { status: workerResponse.status })
    }

    const data = await workerResponse.json()
    console.log(`[5/5] Received successful response from Worker`);

    // Assuming the worker returns a JSON object like { transcript: "..." } or similar
    // Adjust this fallback depending on the exact worker response schema
    const transcript = data.transcript || data.text || data.result || '';

    if (!transcript) {
      console.warn('[-] Warning: Worker returned empty transcript');
    } else {
      console.log('[-] SUCCESS: Transcript extracted ->', transcript.substring(0, 50) + (transcript.length > 50 ? '...' : ''));
    }

    return NextResponse.json({ transcript })

  } catch (error: any) {
    console.error('[-] Transcription route caught exception:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
