import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const logs: string[] = [];

  const log = (msg: string) => {
    const line = `[${new Date().toISOString()}] ${msg}`;
    console.log(line);
    logs.push(line);
  };

  try {
    log("Stage 1: request received");

    const formData = await request.formData()
    const audioFile = formData.get('audio') as File

    if (!audioFile) throw new Error("No audio file provided");

    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Audio = buffer.toString('base64');

    log(`Stage 2: audio length (base64) = ${base64Audio.length}`);
    log(`Stage 2b: raw buffer length = ${buffer.length}`);

    const header = buffer.slice(0, 4).toString('ascii');
    log(`Stage 4: header = ${header}`);

    const payload = {
      model: "openai/gpt-audio-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Transcribe. If no speech say NO_SPEECH"
            },
            {
              type: "input_audio",
              input_audio: {
                data: base64Audio,
                format: audioFile.type.includes('mp3') ? 'mp3' : 'wav'
              }
            }
          ]
        }
      ],
      temperature: 0
    };

    log("Stage 5: sending to OpenRouter");

    const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const text = await resp.text();
    log(`Stage 6: raw response = ${text.slice(0, 200)}`);

    if (!resp.ok) {
      throw new Error(`OpenRouter Error: ${resp.status} - ${text}`);
    }

    const data = JSON.parse(text);
    const content = data.choices?.[0]?.message?.content;

    let transcript = "";
    if (Array.isArray(content)) {
      transcript = content.map((p: any) => p.text || "").join("").trim();
    } else {
      transcript = content || "";
    }

    log(`Stage 7: transcript = ${transcript}`);

    return NextResponse.json({
      transcript,
      logs
    });

  } catch (e: any) {
    log(`ERROR: ${e.message}`);
    return NextResponse.json({ error: e.message, logs }, { status: 500 });
  }
}
