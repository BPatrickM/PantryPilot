import Link from 'next/link';

const CURATED_PLANS = [
  { id: '1', name: 'Week A — Quick & Easy', desc: 'Fast weeknight meals under 30 minutes each.', tag: '⚡ Curated', meals: ['Chicken Stir Fry', 'Beef Tacos', 'Garlic Butter Salmon', 'Shrimp Fried Rice'], color: 'bg-brand-50 border-brand-100' },
  { id: '2', name: 'Week B — Family Favorites', desc: 'Kid-approved crowd-pleasers the whole family will love.', tag: '👨‍👩‍👧 Curated', meals: ['Spaghetti Bolognese', 'Sheet Pan Chicken', 'Classic Cheeseburger', 'Chicken Tikka Masala'], color: 'bg-purple-50 border-purple-100' },
  { id: '3', name: 'Holiday Week', desc: 'Festive seasonal meals for a special week of cooking.', tag: '🎄 Holiday', meals: ['Roast Chicken', 'Glazed Ham', 'Sweet Potato Casserole', 'Chocolate Lava Cake'], color: 'bg-red-50 border-red-100' },
];

export default function PlansPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">←</Link>
          <span className="font-bold text-brand-500">Plan Library</span>
        </div>
        <Link href="/plans/new" className="btn-secondary text-sm py-2">+ New Plan</Link>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-10">

        {/* Curated plans */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">🌟 Curated by PantryPilot</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {CURATED_PLANS.map(plan => (
              <div key={plan.id} className={`card border ${plan.color} space-y-3 hover:shadow-md transition-shadow`}>
                <div>
                  <span className="text-xs font-semibold text-brand-500">{plan.tag}</span>
                  <h3 className="font-bold text-gray-900 mt-1">{plan.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{plan.desc}</p>
                </div>
                <ul className="space-y-0.5">
                  {plan.meals.map(m => (
                    <li key={m} className="text-xs text-gray-600">• {m}</li>
                  ))}
                </ul>
                <Link href="/planner" className="btn-primary block text-center text-sm py-2">
                  Use This Plan →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Favorites week */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">⭐ Your Favorite Meals Week</h2>
          <div className="card border border-orange-100 bg-orange-50 space-y-3">
            <p className="text-sm text-gray-700">Auto-generated from your most cooked meals. Use your week with one tap.</p>
            <p className="text-xs text-gray-400 italic">Start cooking a few weeks to unlock this — we track your top 7 meals automatically.</p>
            <button disabled className="btn-secondary text-sm py-2 opacity-50 cursor-not-allowed w-full">
              Not enough data yet
            </button>
          </div>
        </section>

        {/* User custom plans */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">📋 My Custom Plans</h2>
          <div className="card border-dashed border-2 border-gray-200 text-center py-12 space-y-3">
            <p className="text-4xl">📋</p>
            <p className="text-gray-500 text-sm">No saved plans yet.</p>
            <p className="text-xs text-gray-400">After building a week, tap &ldquo;Save as Plan&rdquo; to reuse it anytime.</p>
            <Link href="/planner" className="btn-primary inline-block text-sm">Build Your First Week</Link>
          </div>
        </section>

      </div>
    </div>
  );
}
