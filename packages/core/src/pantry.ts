// ─────────────────────────────────────────────────────────────────────────────
// PantryPilot — Pantry Stock Engine
// Fuzzy stock levels → numeric estimates → LOW flag resolution
// ─────────────────────────────────────────────────────────────────────────────

import type {
  StockLevel,
  PantryItem,
  ScaledIngredient,
  ShoppingListItem,
  IconType,
} from './types';

// ── Stock Level Config ────────────────────────────────────────────────────────

export const STOCK_LEVELS: Record<
  StockLevel,
  { label: string; multiplier: number; emoji: string; color: string }
> = {
  just_a_little: {
    label: 'Just a little left',
    multiplier: 0.1,
    emoji: '🟥',
    color: '#EF5350',
  },
  about_half: {
    label: 'About half',
    multiplier: 0.5,
    emoji: '🟨',
    color: '#FFA726',
  },
  almost_full: {
    label: 'Almost full',
    multiplier: 0.85,
    emoji: '🟩',
    color: '#66BB6A',
  },
  plenty: {
    label: 'Plenty',
    multiplier: 1.0,
    emoji: '✅',
    color: '#2E7D32',
  },
};

export const LOW_FLAG_THRESHOLD = 0.25; // < 25% coverage triggers LOW flag

// ── Icon config per ingredient type ──────────────────────────────────────────

export const ICON_TYPE_LABELS: Record<IconType, string> = {
  jar: '🫙',
  bottle: '🍶',
  bunch: '🥦',
  box: '📦',
  bag: '🛍️',
};

/**
 * Compute estimated on-hand quantity from a fuzzy stock level.
 */
export function computeOnHandQty(
  stockLevel: StockLevel,
  standardPackageQty: number
): number {
  return standardPackageQty * STOCK_LEVELS[stockLevel].multiplier;
}

/**
 * Given a list of aggregated scaled ingredients and the user's pantry,
 * return a resolved shopping list with quantities adjusted for pantry
 * and LOW flags applied where needed.
 */
export function resolveShoppingList(
  scaledIngredients: ScaledIngredient[],
  pantryItems: PantryItem[]
): {
  items: Omit<ShoppingListItem, 'id' | 'listId'>[];
  lowFlagCount: number;
} {
  const pantryMap = new Map(
    pantryItems.map((p) => [p.ingredientId, p])
  );

  const items: Omit<ShoppingListItem, 'id' | 'listId'>[] = [];
  let lowFlagCount = 0;

  for (const scaled of scaledIngredients) {
    const pantry = pantryMap.get(scaled.ingredientId);
    const onHand = pantry?.quantityOnHand ?? 0;
    const needed = scaled.quantityFinal;
    const coverage = onHand / needed;

    let quantityNeeded: number;
    let isLowFlagged = false;

    if (coverage >= 1.0) {
      // Pantry fully covers it — skip
      continue;
    } else if (coverage < LOW_FLAG_THRESHOLD) {
      // Less than 25% covered — add full amount + flag
      quantityNeeded = needed;
      isLowFlagged = true;
      lowFlagCount++;
    } else {
      // Partial coverage — add only the delta
      quantityNeeded = Math.max(0, needed - onHand);
    }

    // Round to nearest 0.25
    quantityNeeded = Math.round(quantityNeeded * 4) / 4;

    items.push({
      ingredientId: scaled.ingredientId,
      ingredient: scaled.ingredient,
      quantityNeeded,
      unit: scaled.unit,
      isLowFlagged,
      isManuallyAdded: false,
      cartStatus: 'pending',
    });
  }

  return { items, lowFlagCount };
}

/**
 * Returns the stock level option list for the bottom sheet picker.
 */
export function getStockLevelOptions() {
  return (Object.entries(STOCK_LEVELS) as [StockLevel, (typeof STOCK_LEVELS)[StockLevel]][]).map(
    ([value, config]) => ({ value, ...config })
  );
}

/**
 * Group shopping list items by ingredient category for display.
 */
export function groupItemsByCategory(
  items: Omit<ShoppingListItem, 'id' | 'listId'>[]
): Record<string, Omit<ShoppingListItem, 'id' | 'listId'>[]> {
  const groups: Record<string, Omit<ShoppingListItem, 'id' | 'listId'>[]> = {};

  for (const item of items) {
    const category = item.ingredient?.category ?? 'Other';
    if (!groups[category]) groups[category] = [];
    groups[category].push(item);
  }

  // Sort each group so LOW-flagged items come first
  for (const key of Object.keys(groups)) {
    groups[key].sort((a, b) => (b.isLowFlagged ? 1 : 0) - (a.isLowFlagged ? 1 : 0));
  }

  return groups;
}
