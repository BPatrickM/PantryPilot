import axios from 'axios';
import type { RetailerProduct } from '@pantry-pilot/core';

const WALMART_BASE = process.env.WALMART_API_BASE ?? 'https://api.walmart.com';

interface CartPushResult {
  itemsAdded: number;
  itemsFailed: number;
  failedItems: string[];
  estimatedTotal: number;
  checkoutUrl: string;
}

export class WalmartCartService {
  private async getAccessToken(userId: string): Promise<string> {
    // In production: fetch from DB (users.retailer_auth_token), decrypt, refresh if expired
    const token = process.env.WALMART_ACCESS_TOKEN ?? '';
    return token;
  }

  private async searchProduct(query: string, storeId: string, token: string): Promise<RetailerProduct | null> {
    try {
      const res = await axios.get(`${WALMART_BASE}/v1/search`, {
        params: { query, storeId, limit: 5 },
        headers: { Authorization: `Bearer ${token}` },
      });

      const items = res.data?.items ?? [];
      if (!items.length) return null;

      // Return highest-scored item (Walmart ranks by relevance)
      const top = items[0];
      return {
        id: top.itemId,
        name: top.name,
        brand: top.brand,
        category: top.category,
        price: top.salePrice ?? top.msrp,
        size: top.size,
        isOrganic: top.name?.toLowerCase().includes('organic') ?? false,
        isGeneric: top.name?.toLowerCase().includes('great value') ?? false,
        imageUrl: top.thumbnailImage,
        retailer: 'walmart',
      };
    } catch (err) {
      console.error(`[walmart] Search failed for "${query}":`, err);
      return null;
    }
  }

  private async addToCart(items: { itemId: string; quantity: number }[], token: string): Promise<void> {
    await axios.post(
      `${WALMART_BASE}/v1/cart/add`,
      { items },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }

  async pushCart(
    userId: string,
    listItems: { ingredientId: string; name: string; quantityNeeded: number; unit: string }[],
    onProgress: (progress: number) => void
  ): Promise<CartPushResult> {
    const token = await this.getAccessToken(userId);
    const storeId = process.env.WALMART_STORE_ID ?? '1';

    const cartItems: { itemId: string; quantity: number }[] = [];
    const failedItems: string[] = [];
    let estimatedTotal = 0;

    for (let i = 0; i < listItems.length; i++) {
      const item = listItems[i];
      onProgress(Math.floor((i / listItems.length) * 100));

      // Random delay to mimic human cadence
      await new Promise(r => setTimeout(r, 800 + Math.random() * 700));

      const product = await this.searchProduct(item.name, storeId, token);

      if (product) {
        cartItems.push({ itemId: product.id, quantity: Math.ceil(item.quantityNeeded) });
        estimatedTotal += product.price;
      } else {
        failedItems.push(item.name);
      }
    }

    if (cartItems.length > 0) {
      await this.addToCart(cartItems, token);
    }

    return {
      itemsAdded: cartItems.length,
      itemsFailed: failedItems.length,
      failedItems,
      estimatedTotal,
      checkoutUrl: 'https://www.walmart.com/cart',
    };
  }
}
