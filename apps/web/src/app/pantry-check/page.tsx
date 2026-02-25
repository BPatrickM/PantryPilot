'use client';

import { useState } from 'react';
import Link from 'next/link';
import { STOCK_LEVELS, getStockLevelOptions } from '@pantry-pilot/core';
import type { StockLevel } from '@pantry-pilot/core';

interface PantryIngredient {
  id: string;
  name: string;
  category: string;
  quantityNeeded: number;
  unit: string;
  stockLevel?: StockLevel;
  iconType: 'jar' | 'bottle' | 'bunch' | 'box' | 'bag';
}

const ICON_MAP = { jar: '🫙', bottle: '🍶', bunch: '🥦', box: '📦', bag: '🛍️' };

const MOCK_INGREDIENTS: PantryIngredient[] = [
  { id: '1', name: 'Garlic powder', category: 'Pantry & Dry Goods', quantityNeeded: 4, unit: 'tsp', iconType: 'jar' },
  { id: '2', name: 'Olive oil', category: 'Pantry & Dry Goods', quantityNeeded: 3, unit: 'tbsp', iconType: 'bottle' },
  { id: '3', name: 'Chicken broth', category: 'Pantry & Dry Goods', quantityNeeded: 2, unit: 'cup', iconType: 'box' },
  { id: '4', name: 'Soy sauce', category: 'Pantry & Dry Goods', quantityNeeded: 4, unit: 'tbsp', iconType: 'bottle' },
  { id: '5', name: 'Broccoli', category: 'Produce', quantityNeeded: 2, unit: 'head', iconType: 'bunch' },
  { id: '6', name: 'Yellow onion', category: 'Produce', quantityNeeded: 3, unit: 'each', iconType: 'bunch' },
  { id: '7', name: 'Eggs', category: 'Dairy & Eggs', quantityNeeded: 6, unit: 'each', iconType: 'bag' },
  { id: '8', name: 'Butter', category: 'Dairy & Eggs', quantityNeeded: 4, unit: 'tbsp', iconType: 'box' },
];

export default function PantryCheckPage() {
  const [ingredients, setIngredients] = useState<PantryIngredient[]>(MOCK_INGREDIENTS);
  const [activeItem, setActiveItem] = useState<PantryIngredient | null>(null);

  const setStockLevel = (id: string, level: StockLevel) => {
    setIngredients(prev => prev.map(i => i.id === id ? { ...i, stockLevel: level } : i));
    setActiveItem(null);
  };

  const checkedCount = ingredients.filter(i => i.stockLevel).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4">
        <Link href="/planner" className="text-gray-400 hover:text-gray-600">←</Link>
        <div>
          <span className="font-bold text-brand-500">Pantry Check</span>
          <p className="text-xs text-gray-400">{checkedCount}/{ingredients.length} items reviewed</p>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        <div className="bg-brand-50 border border-brand-100 rounded-2xl p-4 text-sm text-brand-500">
          <strong>Tap &ldquo;I have this&rdquo;</strong> on anything you already own. We&apos;ll deduct it from your list — and flag anything critically low.
        </div>

        <div className="space-y-3">
          {ingredients.map(item => {
            const stockConfig = item.stockLevel ? STOCK_LEVELS[item.stockLevel] : null;
            return (
              <div key={item.id} className="card flex items-center gap-4">
                <span className="text-2xl">{ICON_MAP[item.iconType]}</span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">Need: {item.quantityNeeded} {item.unit}</p>
                  {stockConfig && (
                    <span className="text-xs font-medium" style={{ color: stockConfig.color }}>
                      {stockConfig.emoji} {stockConfig.label}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setActiveItem(item)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors ${
                    item.stockLevel
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-brand-50 hover:text-brand-500'
                  }`}>
                  {item.stockLevel ? 'Edit' : 'I have this'}
                </button>
              </div>
            );
          })}
        </div>

        <Link href="/list" className="btn-primary block text-center">
          Build Final List →
        </Link>
      </div>

      {/* Bottom sheet for stock level picker */}
      {activeItem && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end" onClick={() => setActiveItem(null)}>
          <div className="w-full bg-white rounded-t-3xl p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900">{activeItem.name}</h3>
                <p className="text-sm text-gray-500">How much do you have?</p>
              </div>
              <span className="text-3xl">{ICON_MAP[activeItem.iconType]}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {getStockLevelOptions().map(option => (
                <button key={option.value}
                  onClick={() => setStockLevel(activeItem.id, option.value)}
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${
                    activeItem.stockLevel === option.value
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-gray-100 hover:border-gray-300'
                  }`}>
                  <span className="text-2xl">{option.emoji}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{option.label}</p>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={() => setActiveItem(null)} className="w-full text-center text-sm text-gray-400 py-2">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
