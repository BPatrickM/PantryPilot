export * from './types';

export const STOCK_LEVELS = {
  just_a_little: { label: 'Just a little left', multiplier: 0.10, icon: '🟥' },
  about_half:    { label: 'About half',          multiplier: 0.50, icon: '🟨' },
  almost_full:   { label: 'Almost full',         multiplier: 0.85, icon: '🟩' },
  plenty:        { label: 'Plenty',              multiplier: 1.00, icon: '✅' },
} as const;

export function getStockLevelOptions() {
  return Object.entries(STOCK_LEVELS).map(([value, data]) => ({ value, ...data }));
}

export function parseRecipeText(text: string) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  return {
    name: lines[0] ?? 'Unnamed Recipe',
    yieldServings: 4,
    ingredients: [],
    parseConfidence: 0.5,
  };
}

export function buildAILinks(meal: { name: string; yieldServings: number }, nDiners: number, preference: string) {
  const prompt = encodeURIComponent(
    `Give me step-by-step cooking instructions for ${meal.name} for ${nDiners} people. Recipe yields ${meal.yieldServings} servings.`
  );
  return {
    chatgpt: `https://chat.openai.com/?q=${prompt}`,
    gemini: `https://gemini.google.com/app?q=${prompt}`,
  };
}
