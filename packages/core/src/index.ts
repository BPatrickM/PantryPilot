export * from './types';

export function buildAILinks(
  meal: { name: string; yieldServings: number },
  nDiners: number,
  preference: string
) {
  const prompt = encodeURIComponent(
    `Give me detailed step-by-step cooking instructions for ${meal.name}. ` +
    `I am cooking for ${nDiners} people. The recipe yields ${meal.yieldServings} servings. ` +
    `Include prep time, cook time, plating tips, and common mistakes to avoid.`
  );
  return {
    chatgpt: `https://chat.openai.com/?q=${prompt}`,
    gemini: `https://gemini.google.com/app?q=${prompt}`,
  };
}
