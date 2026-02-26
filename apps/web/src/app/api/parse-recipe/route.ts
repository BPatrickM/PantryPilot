import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'text is required' }, { status: 400 });
    }

    if (text.length > 10000) {
      return NextResponse.json({ error: 'Text too long (max 10,000 chars)' }, { status: 400 });
    }

    const parsed = parseRecipeText(text);

    return NextResponse.json({ success: true, recipe: parsed });
  } catch (err) {
    console.error('[parse-recipe]', err);
    return NextResponse.json({ error: 'Parse failed' }, { status: 500 });
  }
}
