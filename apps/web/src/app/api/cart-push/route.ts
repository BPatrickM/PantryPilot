import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { listId, retailer } = await req.json();

    if (!listId || !retailer) {
      return NextResponse.json({ error: 'listId and retailer are required' }, { status: 400 });
    }

    if (!['walmart', 'shoprite'].includes(retailer)) {
      return NextResponse.json({ error: 'Invalid retailer' }, { status: 400 });
    }

    // In production: enqueue a BullMQ job
    // const job = await cartQueue.add('push-cart', { listId, retailer, userId });
    // return NextResponse.json({ jobId: job.id, status: 'queued' });

    // Development stub:
    const jobId = `job_${Date.now()}`;
    console.log(`[cart-push] Enqueued job ${jobId} for list ${listId} on ${retailer}`);

    return NextResponse.json({
      jobId,
      status: 'queued',
      message: `Cart push job queued for ${retailer}. Connect BullMQ worker to process.`,
    });
  } catch (err) {
    console.error('[cart-push]', err);
    return NextResponse.json({ error: 'Failed to queue cart push' }, { status: 500 });
  }
}
