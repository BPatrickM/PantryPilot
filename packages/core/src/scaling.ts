// ─────────────────────────────────────────────────────────────────────────────
// PantryPilot — Ingredient Scaling Engine
// Q_final = Q_base × (N_diners / N_yield)
// ─────────────────────────────────────────────────────────────────────────────

import type { Meal, ScaledIngredient, WeekPlan } from './types';

/**
 * Scale a single ingredient quantity for a given diner count.
 * Result rounded to nearest 0.25 unit increment.
 */
export function scaleQuantity(
  qBase: number,
  nDiners: number,
  nYield: number
): number {
  if (nYield <= 0) throw new Error('Recipe yield must be > 0');
  if (nDiners <= 0) throw new Error('Diner count must be > 0');
  const raw = qBase * (nDiners / nYield);
  return Math.round(raw * 4) / 4; // nearest 0.25
}

/**
 * Scale all ingredients for a single meal, returning a map of
 * ingredientId → scaled quantity.
 */
export function scaleMeal(
  meal: Meal,
  nDiners: number
): Map<string, { quantity: number; unit: string }> {
  const result = new Map<string, { quantity: number; unit: string }>();
  if (!meal.recipeIngredients) return result;

  for (const ri of meal.recipeIngredients) {
    const scaled = scaleQuantity(ri.quantityBase, nDiners, meal.yieldServings);
    result.set(ri.ingredientId, { quantity: scaled, unit: ri.unit });
  }
  return result;
}

/**
 * Aggregate and scale all ingredients across an entire week plan.
 * Identical ingredients across meals are summed into a single line.
 */
export function buildAggregatedList(
  weekPlan: WeekPlan,
  meals: Meal[]
): ScaledIngredient[] {
  const mealMap = new Map(meals.map((m) => [m.id, m]));
  const aggregated = new Map<string, ScaledIngredient>();

  const processMeal = (mealId: string) => {
    const meal = mealMap.get(mealId);
    if (!meal?.recipeIngredients) return;

    for (const ri of meal.recipeIngredients) {
      const scaled = scaleQuantity(
        ri.quantityBase,
        weekPlan.nDiners,
        meal.yieldServings
      );

      if (aggregated.has(ri.ingredientId)) {
        const existing = aggregated.get(ri.ingredientId)!;
        existing.quantityFinal += scaled;
        existing.sources.push({
          mealId: meal.id,
          mealName: meal.name,
          quantity: scaled,
        });
      } else {
        aggregated.set(ri.ingredientId, {
          ingredientId: ri.ingredientId,
          ingredient: ri.ingredient,
          quantityFinal: scaled,
          unit: ri.unit,
          sources: [{ mealId: meal.id, mealName: meal.name, quantity: scaled }],
        });
      }
    }
  };

  for (const day of weekPlan.days) {
    if (day.main) processMeal(day.main.id);
    for (const side of day.sides) processMeal(side.id);
    if (day.dessert) processMeal(day.dessert.id);
  }

  return Array.from(aggregated.values());
}

/**
 * Format a quantity for display — avoids ugly decimals like 1.75.
 * Returns strings like "1¾", "½", "2½".
 */
export function formatQuantity(qty: number): string {
  const whole = Math.floor(qty);
  const decimal = Math.round((qty - whole) * 4); // quarters
  const fractionMap: Record<number, string> = {
    0: '',
    1: '¼',
    2: '½',
    3: '¾',
  };
  const fraction = fractionMap[decimal] ?? '';
  if (whole === 0) return fraction || '0';
  return `${whole}${fraction}`;
}
