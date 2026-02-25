'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MealCard } from '@/components/meals/MealCard';
import { DinerCountInput } from '@/components/planner/DinerCountInput';
import type { Meal, DayPlan, WeekPlan, CourseType } from '@pantry-pilot/core';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const MOCK_MEALS: Meal[] = [
  { id: '11111111-0001-0001-0001-000000000001', name: 'Chicken Stir Fry', description: 'Quick weeknight stir fry', yieldServings: 4, prepTimeMins: 25, mealType: 'dinner', isUserCreated: false, usageCount: 5, isFavorite: false, cardState: 'most_used' },
  { id: '11111111-0002-0002-0002-000000000002', name: 'Spaghetti Bolognese', description: 'Classic Italian meat sauce', yieldServings: 6, prepTimeMins: 45, mealType: 'dinner', isUserCreated: false, usageCount: 2, isFavorite: true, cardState: 'favorite' },
  { id: '11111111-0003-0003-0003-000000000003', name: 'Garlic Butter Salmon', description: 'Pan-seared salmon', yieldServings: 2, prepTimeMins: 20, mealType: 'dinner', isUserCreated: false, usageCount: 0, isFavorite: false, cardState: 'standard' },
  { id: '11111111-0004-0004-0004-000000000004', name: 'Sheet Pan Chicken', description: 'One-pan roasted chicken', yieldServings: 4, prepTimeMins: 40, mealType: 'dinner', isUserCreated: false, usageCount: 1, isFavorite: false, cardState: 'standard' },
  { id: '11111111-0005-0005-0005-000000000005', name: 'Beef Tacos', description: 'Seasoned ground beef tacos', yieldServings: 4, prepTimeMins: 20, mealType: 'dinner', isUserCreated: false, usageCount: 4, isFavorite: true, cardState: 'most_used' },
  { id: '11111111-0009-0009-0009-000000000009', name: 'Roasted Broccoli', description: 'Simple oven-roasted broccoli', yieldServings: 4, prepTimeMins: 20, mealType: 'dinner', isUserCreated: false, usageCount: 3, isFavorite: false, cardState: 'most_used' },
  { id: '11111111-0010-0010-0010-000000000010', name: 'Garlic Bread', description: 'Buttery garlic bread', yieldServings: 4, prepTimeMins: 10, mealType: 'dinner', isUserCreated: false, usageCount: 2, isFavorite: false, cardState: 'standard' },
  { id: '11111111-0012-0012-0012-000000000012', name: 'Chocolate Lava Cake', description: 'Molten chocolate cakes', yieldServings: 4, prepTimeMins: 25, mealType: 'dessert', isUserCreated: false, usageCount: 1, isFavorite: true, cardState: 'favorite' },
];

const MAIN_MEALS = MOCK_MEALS.filter(m => m.mealType === 'dinner' && !['Roasted Broccoli', 'Garlic Bread', 'Chocolate Lava Cake'].includes(m.name));
const SIDE_MEALS = MOCK_MEALS.filter(m => ['Roasted Broccoli', 'Garlic Bread'].includes(m.name));
const DESSERT_MEALS = MOCK_MEALS.filter(m => m.mealType === 'dessert');

type Step = 'select-day' | 'build-meal' | 'diner-count' | 'review';

export default function PlannerPage() {
  const [step, setStep] = useState<Step>('select-day');
  const [activeDayIdx, setActiveDayIdx] = useState<number | null>(null);
  const [days, setDays] = useState<DayPlan[]>(
    DAYS.map((_, i) => ({ dayOfWeek: i + 1, sides: [] }))
  );
  const [nDiners, setNDiners] = useState(2);

  const openDayBuilder = (idx: number) => {
    setActiveDayIdx(idx);
    setStep('build-meal');
  };

  const setMain = (meal: Meal) => {
    if (activeDayIdx === null) return;
    setDays(prev => prev.map((d, i) => i === activeDayIdx ? { ...d, main: meal } : d));
  };

  const toggleSide = (meal: Meal) => {
    if (activeDayIdx === null) return;
    setDays(prev => prev.map((d, i) => {
      if (i !== activeDayIdx) return d;
      const hasSide = d.sides.some(s => s.id === meal.id);
      return { ...d, sides: hasSide ? d.sides.filter(s => s.id !== meal.id) : [...d.sides, meal].slice(0, 3) };
    }));
  };

  const setDessert = (meal: Meal) => {
    if (activeDayIdx === null) return;
    setDays(prev => prev.map((d, i) => i === activeDayIdx ? { ...d, dessert: meal } : d));
  };

  const activeDay = activeDayIdx !== null ? days[activeDayIdx] : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4">
        <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">←</Link>
        <span className="font-bold text-brand-500">Weekly Planner</span>
        <div className="ml-auto flex gap-2">
          {(['select-day', 'diner-count', 'review'] as Step[]).map((s, i) => (
            <div key={s} className={`text-xs px-2 py-1 rounded-full ${step === s ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
              {i + 1}. {s === 'select-day' ? 'Meals' : s === 'diner-count' ? 'Servings' : 'Review'}
            </div>
          ))}
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* STEP 1: Week grid */}
        {step === 'select-day' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Build Your Week</h2>
              <p className="text-gray-500 mt-1">Tap a day to add meals. Or <Link href="/plans" className="text-brand-500 underline">load a saved plan</Link>.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {days.map((day, idx) => (
                <button key={idx} onClick={() => openDayBuilder(idx)}
                  className="card hover:shadow-md transition-shadow text-left space-y-2 border-2 hover:border-brand-500">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">{DAYS[idx]}</span>
                    {day.main && <span className="text-green-500 text-sm">✓</span>}
                  </div>
                  {day.main ? (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-brand-500">🍽️ {day.main.name}</p>
                      {day.sides.map(s => <p key={s.id} className="text-xs text-gray-500">+ {s.name}</p>)}
                      {day.dessert && <p className="text-xs text-gray-500">🍰 {day.dessert.name}</p>}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">Tap to add meals</p>
                  )}
                </button>
              ))}
            </div>
            {days.some(d => d.main) && (
              <div className="flex justify-end">
                <button onClick={() => setStep('diner-count')} className="btn-primary">
                  Next: Set Servings →
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 1b: Takeout meal builder */}
        {step === 'build-meal' && activeDayIdx !== null && (
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <button onClick={() => setStep('select-day')} className="text-gray-400 hover:text-gray-600">←</button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{DAYS[activeDayIdx]}</h2>
                <p className="text-gray-500">Build your meal like a menu order</p>
              </div>
            </div>

            {/* Main Course */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900">🍽️ Main Course</h3>
                <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Required</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MAIN_MEALS.map(meal => (
                  <MealCard key={meal.id} meal={meal}
                    isSelected={activeDay?.main?.id === meal.id}
                    onSelect={() => setMain(meal)} />
                ))}
              </div>
            </section>

            {/* Sides */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900">🥦 Add Sides</h3>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Optional • up to 3</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SIDE_MEALS.map(meal => (
                  <MealCard key={meal.id} meal={meal}
                    isSelected={activeDay?.sides.some(s => s.id === meal.id) ?? false}
                    onSelect={() => toggleSide(meal)} />
                ))}
              </div>
            </section>

            {/* Dessert */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900">🍰 Add Dessert</h3>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Optional</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DESSERT_MEALS.map(meal => (
                  <MealCard key={meal.id} meal={meal}
                    isSelected={activeDay?.dessert?.id === meal.id}
                    onSelect={() => setDessert(meal)} />
                ))}
              </div>
            </section>

            <div className="flex justify-end">
              <button onClick={() => setStep('select-day')}
                disabled={!activeDay?.main}
                className="btn-primary disabled:opacity-50">
                Done with {DAYS[activeDayIdx]} ✓
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Diner count */}
        {step === 'diner-count' && (
          <DinerCountInput
            nDiners={nDiners}
            onChange={setNDiners}
            onNext={() => setStep('review')}
            onBack={() => setStep('select-day')}
          />
        )}

        {/* STEP 3: Review */}
        {step === 'review' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Week</h2>
              <p className="text-gray-500">Cooking for {nDiners} {nDiners === 1 ? 'person' : 'people'}</p>
            </div>
            <div className="space-y-3">
              {days.filter(d => d.main).map((day, idx) => (
                <div key={idx} className="card flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-500">{DAYS[day.dayOfWeek - 1]}</p>
                    <p className="font-semibold text-gray-900">{day.main?.name}</p>
                    {day.sides.map(s => <p key={s.id} className="text-sm text-gray-500">+ {s.name}</p>)}
                    {day.dessert && <p className="text-sm text-gray-500">🍰 {day.dessert.name}</p>}
                  </div>
                </div>
              ))}
            </div>
            <Link href="/pantry-check" className="btn-primary block text-center">
              Next: Check Pantry →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
