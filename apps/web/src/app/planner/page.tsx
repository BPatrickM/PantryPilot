'use client';
import { useState } from 'react';

export default function PlannerPage() {
  const [diners, setDiners] = useState(4);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <span className="text-2xl font-bold text-blue-700">🛒 PantryPilot</span>
        <button className="bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
          Build My List →
        </button>
      </header>
      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Weekly Planner</h1>
        <div className="grid grid-cols-7 gap-3">
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(day => (
            <div key={day} className="bg-white rounded-xl border-2 border-dashed border-gray-200 min-h-40 p-3 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400">
              <span className="text-xs font-semibold text-gray-400 uppercase">{day}</span>
              <span className="text-2xl text-gray-300 mt-2">+</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
