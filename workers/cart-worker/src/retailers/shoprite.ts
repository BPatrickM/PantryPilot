import { chromium } from 'playwright';

const SHOPRITE_BASE = 'https://www.shoprite.com';
const FRESHOP_API   = 'https://storefrontgateway.shoprite.com/api';

interface CartPushResult {
  itemsAdded: number;
  itemsFailed: number;
  failedItems: string[];
  estimatedTotal: number;
  checkoutUrl: string;
}

export class ShopRiteCartService {
  /**
   * Get a session token for ShopRite via Playwright login.
   * In production: pull pre-authenticated session from Redis pool.
   */
  private async getSession(userId: string): Promise<{ cookies: string; storeId: string }> {
    // Production: return await sessionPool.acquire(userId);
    return {
      cookies: process.env.SHOPRITE_SESSION_COOKIE ?? '',
      storeId: process.env.SHOPRITE_STORE_ID ?? '0001',
    };
  }

  private async searchProductFreshop(
    term: string,
    storeId: string,
    cookies: string
  ): Promise<{ id: string; name: string; price: number } | null> {
    try {
      const res = await fetch(`${FRESHOP_API}/products/search?term=${encodeURIComponent(term)}&store_id=${storeId}`, {
        headers: {
          Cookie: cookies,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
          'Referer': SHOPRITE_BASE,
        },
      });

      if (!res.ok) return null;
      const data = await res.json();
      const products = data?.products ?? [];
      if (!products.length) return null;

      const top = products[0];
      return { id: top.id ?? top.productId, name: top.name, price: top.price ?? 0 };
    } catch {
      return null;
    }
  }

  private async addToCartFreshop(
    items: { productId: string; quantity: number }[],
    storeId: string,
    cookies: string
  ): Promise<void> {
    await fetch(`${FRESHOP_API}/cart/items`, {
      method: 'POST',
      headers: {
        Cookie: cookies,
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': `${SHOPRITE_BASE}/shop/cart`,
      },
      body: JSON.stringify({ store_id: storeId, items }),
    });
  }

  /**
   * Playwright fallback: use headless browser if Freshop API fails.
   */
  private async addToCartPlaywright(
    itemName: string,
    quantity: number,
    cookies: string,
    storeId: string
  ): Promise<boolean> {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0',
    });

    try {
      // Restore session cookies
      if (cookies) {
        await context.addCookies([{
          name: 'session', value: cookies,
          domain: '.shoprite.com', path: '/',
        }]);
      }

      const page = await context.newPage();
      await page.goto(`${SHOPRITE_BASE}/shop/search-results?query=${encodeURIComponent(itemName)}`, {
        waitUntil: 'networkidle',
        timeout: 30000,
      });

      // Random delay
      await page.waitForTimeout(800 + Math.floor(Math.random() * 1200));

      // Click first product's "Add to Cart"
      const addBtn = page.locator('[data-testid="add-to-cart-button"]').first();
      if (await addBtn.isVisible()) {
        await addBtn.click();
        await page.waitForTimeout(600 + Math.floor(Math.random() * 400));
        return true;
      }

      return false;
    } catch {
      return false;
    } finally {
      await browser.close();
    }
  }

  async pushCart(
    userId: string,
    listItems: { ingredientId: string; name: string; quantityNeeded: number; unit: string }[],
    onProgress: (progress: number) => void
  ): Promise<CartPushResult> {
    const { cookies, storeId } = await this.getSession(userId);

    const cartItems: { productId: string; quantity: number }[] = [];
    const failedItems: string[] = [];
    let estimatedTotal = 0;

    for (let i = 0; i < listItems.length; i++) {
      const item = listItems[i];
      onProgress(Math.floor((i / listItems.length) * 100));

      // Delay to mimic human cadence
      await new Promise(r => setTimeout(r, 800 + Math.random() * 1700));

      // Try Freshop API first
      const product = await this.searchProductFreshop(item.name, storeId, cookies);

      if (product) {
        cartItems.push({ productId: product.id, quantity: Math.ceil(item.quantityNeeded) });
        estimatedTotal += product.price;
      } else {
        // Fallback to Playwright
        console.log(`[shoprite] Freshop missed "${item.name}" — trying Playwright fallback`);
        const added = await this.addToCartPlaywright(item.name, item.quantityNeeded, cookies, storeId);
        if (!added) failedItems.push(item.name);
      }
    }

    if (cartItems.length > 0) {
      await this.addToCartFreshop(cartItems, storeId, cookies);
    }

    return {
      itemsAdded: cartItems.length,
      itemsFailed: failedItems.length,
      failedItems,
      estimatedTotal,
      checkoutUrl: `${SHOPRITE_BASE}/shop/cart`,
    };
  }
}
