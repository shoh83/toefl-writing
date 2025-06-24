// src/app/api/chat/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const MODEL_NAME = 'gemini-2.5-pro';                  // ← one place to change
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });
let chat = ai.chats.create({ model: MODEL_NAME, history: [] });

export async function POST(req: Request) {
  const { prompt, reset } = await req.json();

  if (reset) {
    chat = ai.chats.create({ model: MODEL_NAME, history: [] });
  }

  const response = await chat.sendMessage({ message: prompt });
  console.log('Server got response:', response.text);
  return NextResponse.json({ text: response.text ?? '' });
}
