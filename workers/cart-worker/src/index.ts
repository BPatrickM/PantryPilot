import 'dotenv/config';
import { Worker, Queue, QueueEvents } from 'bullmq';
import { Redis } from 'ioredis';
import { WalmartCartService } from './retailers/walmart';
import { ShopRiteCartService } from './retailers/shoprite';
import type { Retailer } from '@pantry-pilot/core';

const REDIS_URL = process.env.REDIS_URL ?? 'redis://localhost:6379';
const CONCURRENCY = parseInt(process.env.WORKER_CONCURRENCY ?? '3');

const connection = new Redis(REDIS_URL, { maxRetriesPerRequest: null });

export const cartQueue = new Queue('cart-push', { connection });

// ── Worker ────────────────────────────────────────────────────────────────────

const worker = new Worker(
  'cart-push',
  async (job) => {
    const { listId, retailer, userId } = job.data as {
      listId: string;
      retailer: Retailer;
      userId: string;
    };

    console.log(`[worker] Processing job ${job.id} | list=${listId} retailer=${retailer}`);

    await job.updateProgress(5);

    // Fetch shopping list items from DB
    // In production: const items = await db.getShoppingListItems(listId);
    const items: any[] = []; // stub

    await job.updateProgress(20);

    let result;

    if (retailer === 'walmart') {
      const service = new WalmartCartService();
      result = await service.pushCart(userId, items, (progress) => {
        job.updateProgress(20 + Math.floor(progress * 0.7));
      });
    } else if (retailer === 'shoprite') {
      const service = new ShopRiteCartService();
      result = await service.pushCart(userId, items, (progress) => {
        job.updateProgress(20 + Math.floor(progress * 0.7));
      });
    } else {
      throw new Error(`Unknown retailer: ${retailer}`);
    }

    await job.updateProgress(100);

    console.log(`[worker] Job ${job.id} complete: ${result.itemsAdded} added, ${result.itemsFailed} failed`);
    return result;
  },
  {
    connection,
    concurrency: CONCURRENCY,
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: { count: 100 },
      removeOnFail: { count: 50 },
    },
  }
);

// ── Event handlers ────────────────────────────────────────────────────────────

worker.on('completed', (job, result) => {
  console.log(`[worker] ✅ Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`[worker] ❌ Job ${job?.id} failed:`, err.message);
});

worker.on('progress', (job, progress) => {
  console.log(`[worker] Job ${job.id} progress: ${progress}%`);
});

console.log(`🚀 PantryPilot Cart Worker started (concurrency: ${CONCURRENCY})`);
console.log(`📡 Redis: ${REDIS_URL}`);
