// ─────────────────────────────────────────────────────────────────────────────
// PantryPilot — AI Cooking Link Builder
// Constructs deep-links to ChatGPT and Gemini with a pre-filled cooking prompt.
// No API key required — opens the user's browser.
// ─────────────────────────────────────────────────────────────────────────────

import type { Meal, AIAssistant } from './types';

export interface AILinks {
  chatgpt?: string;
  gemini?: string;
}

/**
 * Build the pre-filled cooking prompt for a meal.
 */
export function buildCookingPrompt(meal: Meal, nDiners: number): string {
  return (
    `Give me detailed step-by-step cooking instructions for ${meal.name}. ` +
    `I am cooking for ${nDiners} ${nDiners === 1 ? 'person' : 'people'}. ` +
    `The recipe yields ${meal.yieldServings} servings. ` +
    `Please include: prep time, cook time, equipment needed, step-by-step instructions, ` +
    `plating suggestions, and the most common mistakes to avoid.`
  );
}

/**
 * Generate AI assistant deep-links for a given meal and diner count.
 * Returns only the links relevant to the user's preferred assistant setting.
 */
export function buildAILinks(
  meal: Meal,
  nDiners: number,
  assistant: AIAssistant = 'both'
): AILinks {
  const prompt = encodeURIComponent(buildCookingPrompt(meal, nDiners));

  const links: AILinks = {};

  if (assistant === 'chatgpt' || assistant === 'both') {
    links.chatgpt = `https://chat.openai.com/?q=${prompt}`;
  }

  if (assistant === 'gemini' || assistant === 'both') {
    links.gemini = `https://gemini.google.com/app?q=${prompt}`;
  }

  return links;
}
