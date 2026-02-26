import { NextRequest, NextResponse } from 'next/server';
import { parseRecipeText } from '@pantry-pilot/core';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text } = body as { text: string };

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'text is required' }, { status: 400 });
    }

    if (text.length > 20000) {
      return NextResponse.json({ error: 'Text too long (max 20,000 chars)' }, { status: 400 });
    }

    const parsed = parseRecipeText(text);

    return NextResponse.json({ success: true, recipe: parsed });
  } catch (err) {
    console.error('[parse-recipe]', err);
    return NextResponse.json({ error: 'Parse failed' }, { status: 500 });
  }
}
