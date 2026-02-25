'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ListItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  isLowFlagged: boolean;
  cartStatus: 'pending' | 'added' | 'not_found' | 'error';
}

const MOCK_ITEMS: ListItem[] = [
  { id: '1', name: 'Chicken breast', quantity: 2, unit: 'lb', category: 'Meat & Seafood', isLowFlagged: false, cartStatus: 'pending' },
  { id: '2', name: 'Ground beef', quantity: 1, unit: 'lb', category: 'Meat & Seafood', isLowFlagged: false, cartStatus: 'pending' },
  { id: '3', name: 'Garlic powder', quantity: 4, unit: 'tsp', category: 'Pantry & Dry Goods', isLowFlagged: true, cartStatus: 'pending' },
  { id: '4', name: 'Soy sauce', quantity: 4, unit: 'tbsp', category: 'Pantry & Dry Goods', isLowFlagged: false, cartStatus: 'pending' },
  { id: '5', name: 'Broccoli', quantity: 2, unit: 'head', category: 'Produce', isLowFlagged: false, cartStatus: 'pending' },
  { id: '6', name: 'Yellow onion', quantity: 3, unit: 'each', category: 'Produce', isLowFlagged: false, cartStatus: 'pending' },
  { id: '7', name: 'Garlic', quantity: 8, unit: 'clove', category: 'Produce', isLowFlagged: false, cartStatus: 'pending' },
  { id: '8', name: 'Eggs', quantity: 6, unit: 'each', category: 'Dairy & Eggs', isLowFlagged: false, cartStatus: 'pending' },
  { id: '9', name: 'Butter', quantity: 4, unit: 'tbsp', category: 'Dairy & Eggs', isLowFlagged: false, cartStatus: 'pending' },
  { id: '10', name: 'Parmesan cheese', quantity: 0.5, unit: 'cup', category: 'Dairy & Eggs', isLowFlagged: true, cartStatus: 'pending' },
];

const CATEGORY_ORDER = ['Meat & Seafood', 'Produce', 'Dairy & Eggs', 'Pantry & Dry Goods', 'Frozen', 'Beverages', 'Other'];

type PushState = 'idle' | 'pushing' | 'done';

export default function ListPage() {
  const [items, setItems] = useState<ListItem[]>(MOCK_ITEMS);
  const [preference, setPreference] = useState<'cheapest' | 'organic' | 'generic'>('cheapest');
  const [pushState, setPushState] = useState<PushState>('idle');
  const [pushedItems, setPushedItems] = useState<Record<string, 'added' | 'not_found'>>({});

  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    const catItems = items.filter(i => i.category === cat);
    if (catItems.length) acc[cat] = catItems;
    return acc;
  }, {} as Record<string, ListItem[]>);

  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id));

  const simulateCartPush = async () => {
    setPushState('pushing');
    // Simulate item-by-item push
    for (const item of items) {
      await new Promise(r => setTimeout(r, 300));
      const success = Math.random() > 0.1;
      setPushedItems(prev => ({ ...prev, [item.id]: success ? 'added' : 'not_found' }));
    }
    setPushState('done');
  };

  const lowFlagCount = items.filter(i => i.isLowFlagged).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4">
        <Link href="/pantry-check" className="text-gray-400 hover:text-gray-600">←</Link>
        <div>
          <span className="font-bold text-brand-500">Shopping List</span>
          <p className="text-xs text-gray-400">{items.length} items</p>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">

        {/* LOW flag summary */}
        {lowFlagCount > 0 && (
          <div className="bg-danger-100 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-semibold text-danger-500 text-sm">
                {lowFlagCount} item{lowFlagCount > 1 ? 's' : ''} marked LOW
              </p>
              <p className="text-xs text-gray-600 mt-0.5">
                You marked these as nearly empty — we&apos;ve added the full amount to be safe. You can adjust below.
              </p>
            </div>
          </div>
        )}

        {/* Preference toggle */}
        <div className="card space-y-2">
          <p className="text-sm font-semibold text-gray-700">Shopping Preference</p>
          <div className="flex gap-2">
            {(['cheapest', 'organic', 'generic'] as const).map(p => (
              <button key={p} onClick={() => setPreference(p)}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors capitalize ${
                  preference === p ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {p === 'cheapest' ? '💰 Cheapest' : p === 'organic' ? '🌿 Organic' : '🏷️ Generic'}
              </button>
            ))}
          </div>
        </div>

        {/* Grouped list */}
        {Object.entries(grouped).map(([category, catItems]) => (
          <div key={category} className="space-y-2">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{category}</h3>
            {catItems
              .sort((a, b) => (b.isLowFlagged ? 1 : 0) - (a.isLowFlagged ? 1 : 0))
              .map(item => {
                const pushResult = pushedItems[item.id];
                return (
                  <div key={item.id} className={`card flex items-center gap-3 ${item.isLowFlagged ? 'border-l-4 border-l-red-400' : ''}`}>
                    {item.isLowFlagged && (
                      <span className="badge-low">LOW</span>
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.quantity} {item.unit}</p>
                    </div>
                    {pushResult && (
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        pushResult === 'added' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                      }`}>
                        {pushResult === 'added' ? '✓ Added' : '✗ Not found'}
                      </span>
                    )}
                    {pushState === 'idle' && (
                      <button onClick={() => removeItem(item.id)}
                        className="text-gray-300 hover:text-red-400 transition-colors text-sm">✕</button>
                    )}
                  </div>
                );
              })}
          </div>
        ))}

        {/* Cart push */}
        {pushState === 'idle' && (
          <button onClick={simulateCartPush} className="btn-primary w-full text-center text-lg py-4">
            🚀 Send to Cart
          </button>
        )}

        {pushState === 'pushing' && (
          <div className="card text-center py-8 space-y-3">
            <div className="text-3xl animate-bounce">🛒</div>
            <p className="font-semibold text-gray-900">Pushing to your cart...</p>
            <p className="text-sm text-gray-500">
              {Object.keys(pushedItems).length} of {items.length} items added
            </p>
          </div>
        )}

        {pushState === 'done' && (
          <div className="card text-center py-8 space-y-4">
            <div className="text-4xl">✅</div>
            <div>
              <p className="font-bold text-gray-900 text-lg">Cart ready!</p>
              <p className="text-sm text-gray-500">
                {Object.values(pushedItems).filter(s => s === 'added').length} items added ·{' '}
                {Object.values(pushedItems).filter(s => s === 'not_found').length} not found
              </p>
            </div>
            <a href="https://www.walmart.com/cart" target="_blank" rel="noopener noreferrer"
              className="btn-primary inline-block">
              Go to Walmart Checkout →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
