'use client';

import { useState } from 'react';
import type { Meal } from '@pantry-pilot/core';
import { buildAILinks } from '@pantry-pilot/core';

interface MealCardProps {
  meal: Meal;
  isSelected: boolean;
  onSelect: () => void;
  nDiners?: number;
}

export function MealCard({ meal, isSelected, onSelect, nDiners = 2 }: MealCardProps) {
  const [showAILinks, setShowAILinks] = useState(false);

  const cardStyles = {
    standard:  'bg-white border-gray-200 hover:border-brand-500',
    most_used: 'bg-orange-50 border-orange-200 hover:border-orange-400',
    favorite:  'bg-brand-50 border-brand-200 hover:border-brand-500',
    selected:  'bg-white border-brand-500 ring-2 ring-brand-500',
    in_plan:   'bg-gray-50 border-gray-200 opacity-70',
  };

  const state = isSelected ? 'selected' : (meal.cardState ?? 'standard');
  const baseStyle = cardStyles[state];

  const aiLinks = buildAILinks(meal, nDiners, 'both');

  return (
    <div className={`relative rounded-2xl border-2 p-4 transition-all cursor-pointer ${baseStyle}`}
      onClick={onSelect}>

      {/* State badges */}
      <div className="absolute top-3 right-3 flex gap-1">
        {isSelected && (
          <span className="bg-brand-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">✓</span>
        )}
        {meal.cardState === 'most_used' && !isSelected && (
          <span className="badge-most-used">⭐ Most Used</span>
        )}
        {meal.cardState === 'favorite' && !isSelected && (
          <span className="badge-favorite">♥ Fave</span>
        )}
      </div>

      {/* Content */}
      <div className="pr-20 space-y-1">
        <h4 className="font-semibold text-gray-900 text-sm">{meal.name}</h4>
        <p className="text-xs text-gray-500 line-clamp-2">{meal.description}</p>
        <p className="text-xs text-gray-400">⏱ {meal.prepTimeMins} min · serves {meal.yieldServings}</p>
      </div>

      {/* AI cooking link button */}
      <div className="mt-3 pt-3 border-t border-gray-100" onClick={e => e.stopPropagation()}>
        <button
          onClick={() => setShowAILinks(!showAILinks)}
          className="text-xs text-brand-500 hover:underline font-medium">
          🤖 Cook with AI
        </button>
        {showAILinks && (
          <div className="mt-2 flex gap-2">
            <a href={aiLinks.chatgpt} target="_blank" rel="noopener noreferrer"
              className="flex-1 text-center text-xs bg-green-50 text-green-700 border border-green-200 rounded-lg py-1.5 font-semibold hover:bg-green-100 transition-colors">
              Open in ChatGPT
            </a>
            <a href={aiLinks.gemini} target="_blank" rel="noopener noreferrer"
              className="flex-1 text-center text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-lg py-1.5 font-semibold hover:bg-blue-100 transition-colors">
              Open in Gemini
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
export default MealCard;
