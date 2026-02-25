'use client';

import { useState } from 'react';
import Link from 'next/link';
import { parseRecipeText } from '@pantry-pilot/core';
import type { ParsedRecipe, ParsedIngredientLine } from '@pantry-pilot/core';

const CONFIDENCE_STYLES = {
  high:   { color: 'text-green-700 bg-green-50 border-green-200', icon: '✓' },
  medium: { color: 'text-amber-700 bg-amber-50 border-amber-200', icon: '~' },
  low:    { color: 'text-red-700 bg-red-50 border-red-200',       icon: '?' },
};

type Step = 'paste' | 'review' | 'saved';

export default function RecipeImportPage() {
  const [step, setStep] = useState<Step>('paste');
  const [rawText, setRawText] = useState('');
  const [parsed, setParsed] = useState<ParsedRecipe | null>(null);
  const [isParsing, setIsParsing] = useState(false);

  const handleParse = async () => {
    if (!rawText.trim()) return;
    setIsParsing(true);
    await new Promise(r => setTimeout(r, 800)); // simulate async
    const result = parseRecipeText(rawText);
    setParsed(result);
    setIsParsing(false);
    setStep('review');
  };

  const updateIngredient = (idx: number, field: keyof ParsedIngredientLine, value: string | number) => {
    if (!parsed) return;
    const updated = [...parsed.ingredients];
    updated[idx] = { ...updated[idx], [field]: value };
    setParsed({ ...parsed, ingredients: updated });
  };

  const removeIngredient = (idx: number) => {
    if (!parsed) return;
    setParsed({ ...parsed, ingredients: parsed.ingredients.filter((_, i) => i !== idx) });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4">
        <Link href="/recipes" className="text-gray-400 hover:text-gray-600">←</Link>
        <span className="font-bold text-brand-500">Import Recipe</span>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-8">

        {step === 'paste' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Paste Any Recipe</h2>
              <p className="text-gray-500 mt-1">From a blog, a note, a typed screenshot — we&apos;ll figure it out.</p>
            </div>

            <textarea
              value={rawText}
              onChange={e => setRawText(e.target.value)}
              placeholder={`Paste anything here. For example:

Chicken Stir Fry (serves 4)

2 lbs chicken breast, sliced thin
3 tbsp soy sauce
2 cloves garlic, minced
1 inch fresh ginger, grated
2 cups broccoli florets
1 tbsp sesame oil
1/2 tsp black pepper

Heat oil in wok over high heat...`}
              className="input h-72 resize-none font-mono text-sm"
            />

            <div className="flex gap-4">
              <Link href="/recipes" className="btn-secondary">Cancel</Link>
              <button
                onClick={handleParse}
                disabled={!rawText.trim() || isParsing}
                className="btn-primary flex-1">
                {isParsing ? '⏳ Parsing...' : '✨ Parse Recipe'}
              </button>
            </div>
          </div>
        )}

        {step === 'review' && parsed && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Review & Confirm</h2>
                <p className="text-gray-500 text-sm mt-1">
                  Parse confidence: {Math.round(parsed.parseConfidence * 100)}% — fix anything that looks off.
                </p>
              </div>
              <button onClick={() => setStep('paste')} className="text-sm text-gray-400 hover:text-gray-600">
                ← Re-paste
              </button>
            </div>

            {/* Recipe meta */}
            <div className="card space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Recipe Name</label>
                <input
                  className="input mt-1"
                  value={parsed.name}
                  onChange={e => setParsed({ ...parsed, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Yields (servings)</label>
                <input
                  type="number" min={1} max={50}
                  className="input mt-1 w-24"
                  value={parsed.yieldServings}
                  onChange={e => setParsed({ ...parsed, yieldServings: parseInt(e.target.value) || 4 })}
                />
              </div>
            </div>

            {/* Ingredients */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">
                Ingredients ({parsed.ingredients.length} found)
              </h3>
              {parsed.ingredients.map((ing, idx) => {
                const style = CONFIDENCE_STYLES[ing.confidenceLevel];
                return (
                  <div key={idx} className={`border rounded-xl p-3 space-y-2 ${style.color}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold w-5 h-5 rounded-full bg-current bg-opacity-20 flex items-center justify-center">
                        {style.icon}
                      </span>
                      <span className="text-xs opacity-70 capitalize">{ing.confidenceLevel} confidence</span>
                      <button onClick={() => removeIngredient(idx)}
                        className="ml-auto text-current opacity-40 hover:opacity-100 text-sm">✕</button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-xs opacity-60">Qty</label>
                        <input type="number" step="0.25" min="0"
                          className="input mt-0.5 text-sm py-1.5"
                          value={ing.quantity ?? ''}
                          onChange={e => updateIngredient(idx, 'quantity', parseFloat(e.target.value))}
                        />
                      </div>
                      <div>
                        <label className="text-xs opacity-60">Unit</label>
                        <input className="input mt-0.5 text-sm py-1.5"
                          value={ing.unit ?? ''}
                          onChange={e => updateIngredient(idx, 'unit', e.target.value)}
                        />
                      </div>
                      <div className="col-span-3">
                        <label className="text-xs opacity-60">Ingredient</label>
                        <input className="input mt-0.5 text-sm py-1.5"
                          value={ing.name}
                          onChange={e => updateIngredient(idx, 'name', e.target.value)}
                        />
                      </div>
                    </div>
                    <p className="text-xs opacity-50">Original: &ldquo;{ing.raw}&rdquo;</p>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep('paste')} className="btn-secondary">Re-paste</button>
              <button onClick={() => setStep('saved')} className="btn-primary flex-1">
                ✅ Save Recipe
              </button>
            </div>
          </div>
        )}

        {step === 'saved' && parsed && (
          <div className="text-center space-y-6 py-16">
            <div className="text-5xl">✅</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{parsed.name}</h2>
              <p className="text-gray-500">Saved to your recipe library with {parsed.ingredients.length} ingredients.</p>
            </div>
            <div className="flex gap-4 justify-center">
              <Link href="/planner" className="btn-primary">Add to This Week →</Link>
              <Link href="/recipes" className="btn-secondary">View All Recipes</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
