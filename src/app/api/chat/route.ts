import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = body.message;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // This is a placeholder response.
    // In a real application, you would process the message with your LLM here.
    const responseText = `You asked: "${message}". I am a bot and cannot fully process your request yet.`;

    return NextResponse.json({ response: responseText }, { status: 200 });
  } catch (error) {
    console.error('Error processing chat request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}