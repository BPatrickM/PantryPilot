// ─────────────────────────────────────────────────────────────────────────────
// PantryPilot — Text-Paste Recipe NLP Parser
// Converts raw pasted text → structured ParsedRecipe
// ─────────────────────────────────────────────────────────────────────────────

import type { ParsedRecipe, ParsedIngredientLine, ParseConfidence } from './types';

// ── Unit Dictionary ───────────────────────────────────────────────────────────

const UNITS = new Set([
  'cup', 'cups', 'c',
  'tablespoon', 'tablespoons', 'tbsp', 'tbs',
  'teaspoon', 'teaspoons', 'tsp',
  'ounce', 'ounces', 'oz',
  'pound', 'pounds', 'lb', 'lbs',
  'gram', 'grams', 'g',
  'kilogram', 'kilograms', 'kg',
  'milliliter', 'milliliters', 'ml',
  'liter', 'liters', 'l',
  'pint', 'pints', 'pt',
  'quart', 'quarts', 'qt',
  'gallon', 'gallons', 'gal',
  'pinch', 'pinches',
  'dash', 'dashes',
  'handful', 'handfuls',
  'piece', 'pieces', 'slice', 'slices',
  'clove', 'cloves',
  'sprig', 'sprigs',
  'stalk', 'stalks',
  'head', 'heads',
  'bunch', 'bunches',
  'can', 'cans',
  'package', 'packages', 'pkg',
  'bottle', 'bottles',
  'jar', 'jars',
]);

const UNIT_CANONICAL: Record<string, string> = {
  'c': 'cup', 'cups': 'cup',
  'tablespoons': 'tbsp', 'tablespoon': 'tbsp', 'tbs': 'tbsp',
  'teaspoons': 'tsp', 'teaspoon': 'tsp',
  'ounces': 'oz', 'ounce': 'oz',
  'pounds': 'lb', 'lbs': 'lb', 'pound': 'lb',
  'grams': 'g', 'gram': 'g',
  'kilograms': 'kg', 'kilogram': 'kg',
  'milliliters': 'ml', 'milliliter': 'ml',
  'liters': 'l', 'liter': 'l',
  'pints': 'pt', 'pint': 'pt',
  'quarts': 'qt', 'quart': 'qt',
  'gallons': 'gal', 'gallon': 'gal',
  'pinches': 'pinch',
  'dashes': 'dash',
  'handfuls': 'handful',
  'pieces': 'piece', 'slices': 'slice',
  'cloves': 'clove',
  'sprigs': 'sprig',
  'stalks': 'stalk',
  'heads': 'head',
  'bunches': 'bunch',
  'cans': 'can',
  'packages': 'package', 'pkg': 'package',
  'bottles': 'bottle',
  'jars': 'jar',
};

const PREP_NOTES = [
  'diced', 'minced', 'chopped', 'sliced', 'grated', 'shredded',
  'peeled', 'crushed', 'ground', 'beaten', 'melted', 'softened',
  'sifted', 'packed', 'heaping', 'leveled', 'rinsed', 'drained',
  'cooked', 'raw', 'fresh', 'dried', 'frozen', 'thawed',
  'room temperature', 'cold', 'hot', 'warm',
];

// ── Fraction helpers ──────────────────────────────────────────────────────────

const UNICODE_FRACTIONS: Record<string, number> = {
  '½': 0.5, '⅓': 0.333, '⅔': 0.667, '¼': 0.25, '¾': 0.75,
  '⅛': 0.125, '⅜': 0.375, '⅝': 0.625, '⅞': 0.875,
};

function parseFraction(str: string): number | null {
  // Unicode fraction
  if (UNICODE_FRACTIONS[str]) return UNICODE_FRACTIONS[str];

  // Slash fraction like "1/2"
  const slashMatch = str.match(/^(\d+)\/(\d+)$/);
  if (slashMatch) {
    const num = parseInt(slashMatch[1]);
    const den = parseInt(slashMatch[2]);
    if (den !== 0) return num / den;
  }

  return null;
}

function parseQuantity(tokens: string[]): { value: number; consumed: number } | null {
  if (!tokens.length) return null;

  let value = 0;
  let consumed = 0;

  // Check for unicode fraction or slash fraction first
  const frac0 = parseFraction(tokens[0]);
  if (frac0 !== null) return { value: frac0, consumed: 1 };

  // Check for a plain number
  const num0 = parseFloat(tokens[0]);
  if (!isNaN(num0)) {
    value = num0;
    consumed = 1;

    // Check for a following fraction (e.g., "1 1/2" or "1 ½")
    if (tokens[1]) {
      const frac1 = parseFraction(tokens[1]);
      if (frac1 !== null) {
        value += frac1;
        consumed = 2;
      }
    }
    return { value, consumed };
  }

  // Handle range like "1-2" → midpoint
  const rangeMatch = tokens[0].match(/^(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)$/);
  if (rangeMatch) {
    const lo = parseFloat(rangeMatch[1]);
    const hi = parseFloat(rangeMatch[2]);
    return { value: (lo + hi) / 2, consumed: 1 };
  }

  return null;
}

// ── Confidence scoring ────────────────────────────────────────────────────────

function confidenceLevel(score: number): ParseConfidence {
  if (score >= 0.85) return 'high';
  if (score >= 0.60) return 'medium';
  return 'low';
}

// ── Line classifier — is this an ingredient line? ─────────────────────────────

function isLikelyIngredientLine(line: string): boolean {
  const lower = line.toLowerCase().trim();

  // Skip empty, too long (instructions), or common non-ingredient patterns
  if (!lower || lower.length > 120) return false;
  if (/^(step|instructions?|directions?|method|notes?|tips?|prep|cook|total):/i.test(lower)) return false;
  if (/\b(preheat|bake|mix|stir|cook|heat|add|place|combine|pour|set|allow|let|remove|serve)\b/.test(lower)) return false;

  // Strong signal: starts with a number or fraction
  if (/^[\d½⅓⅔¼¾⅛⅜⅝⅞]/.test(lower)) return true;

  // Contains a unit word
  const tokens = lower.split(/\s+/);
  if (tokens.some(t => UNITS.has(t.replace(/[,.)]/g, '')))) return true;

  return false;
}

// ── Single line parser ────────────────────────────────────────────────────────

export function parseIngredientLine(raw: string): ParsedIngredientLine {
  const line = raw.trim();
  const tokens = line.split(/\s+/);
  let idx = 0;
  let confidence = 0.5;

  // Pass 1: quantity
  const qResult = parseQuantity(tokens.slice(idx));
  let quantity: number | undefined;
  if (qResult) {
    quantity = qResult.value;
    idx += qResult.consumed;
    confidence += 0.2;
  }

  // Pass 2: unit
  let unit: string | undefined;
  if (tokens[idx]) {
    const candidate = tokens[idx].toLowerCase().replace(/[,.)]/g, '');
    if (UNITS.has(candidate)) {
      unit = UNIT_CANONICAL[candidate] ?? candidate;
      idx++;
      confidence += 0.15;
    }
  }

  // Pass 3: prep note (check remaining tokens)
  let prepNote: string | undefined;
  const remaining = tokens.slice(idx).join(' ').toLowerCase();
  for (const note of PREP_NOTES) {
    if (remaining.includes(note)) {
      prepNote = note;
      confidence += 0.05;
      break;
    }
  }

  // Pass 4: name — everything left after qty and unit, stripping prep note and punctuation
  let name = tokens
    .slice(idx)
    .join(' ')
    .replace(/,.*$/, '') // remove everything after first comma (usually prep note)
    .replace(/\(.*?\)/g, '') // remove parentheticals
    .trim()
    .toLowerCase();

  if (name.length > 2) confidence += 0.1;
  if (!name) { name = raw; confidence = 0.2; }

  // Clamp confidence
  confidence = Math.min(1.0, Math.max(0.0, confidence));

  return {
    raw,
    quantity,
    unit,
    name,
    prepNote,
    confidence,
    confidenceLevel: confidenceLevel(confidence),
  };
}

// ── Yield detector ────────────────────────────────────────────────────────────

function detectYield(lines: string[]): number {
  for (const line of lines) {
    const lower = line.toLowerCase();
    const patterns = [
      /serves?\s+(\d+)/,
      /makes?\s+(\d+)/,
      /yield[s:]?\s+(\d+)/,
      /(\d+)\s+servings?/,
      /(\d+)\s+portions?/,
      /for\s+(\d+)\s+people/,
    ];
    for (const re of patterns) {
      const m = lower.match(re);
      if (m) return parseInt(m[1]);
    }
  }
  return 4; // sensible default
}

// ── Name extractor ────────────────────────────────────────────────────────────

function detectName(lines: string[]): string {
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.length > 80) continue;
    if (!isLikelyIngredientLine(trimmed)) {
      // Looks like a title — title case, short, no quantities
      if (/^[A-Z]/.test(trimmed) || trimmed === trimmed.toUpperCase()) {
        return trimmed;
      }
      // First non-blank non-ingredient short line
      if (trimmed.split(' ').length <= 8) return trimmed;
    }
  }
  return 'Imported Recipe';
}

// ── Main parser ───────────────────────────────────────────────────────────────

export function parseRecipeText(rawText: string): ParsedRecipe {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);

  const name = detectName(lines);
  const yieldServings = detectYield(lines);

  const ingredientLines = lines.filter(isLikelyIngredientLine);
  const parsed = ingredientLines.map(parseIngredientLine);

  const avgConfidence =
    parsed.length > 0
      ? parsed.reduce((sum, p) => sum + p.confidence, 0) / parsed.length
      : 0;

  return {
    name,
    yieldServings,
    ingredients: parsed,
    parseConfidence: Math.round(avgConfidence * 100) / 100,
  };
}
