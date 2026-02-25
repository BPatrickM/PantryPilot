import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-bold text-brand-500">🛒 PantryPilot</span>
        <div className="flex items-center gap-4">
          <Link href="/pantry" className="text-sm text-gray-600 hover:text-brand-500">Pantry</Link>
          <Link href="/recipes" className="text-sm text-gray-600 hover:text-brand-500">Recipes</Link>
          <Link href="/plans" className="text-sm text-gray-600 hover:text-brand-500">Plans</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* Hero CTA */}
        <div className="card bg-brand-500 text-white space-y-3">
          <h2 className="text-2xl font-bold">Ready to plan your week?</h2>
          <p className="text-brand-100">Select meals, set diner count, push to cart. Takes under 3 minutes.</p>
          <Link href="/planner" className="inline-block bg-white text-brand-500 font-semibold px-6 py-3 rounded-xl hover:bg-brand-50 transition-colors">
            Start Weekly Planner →
          </Link>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Pantry Items', value: '—', icon: '🫙' },
            { label: 'Saved Plans', value: '—', icon: '📋' },
            { label: 'Recipes', value: '14', icon: '🍽️' },
            { label: 'Cart Pushes', value: '—', icon: '🚀' },
          ].map((stat) => (
            <div key={stat.label} className="card text-center space-y-1">
              <span className="text-2xl">{stat.icon}</span>
              <p className="text-2xl font-bold text-brand-500">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Plan library teaser */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Plan Library</h3>
            <Link href="/plans" className="text-sm text-brand-500 hover:underline">View all</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { name: 'Week A — Quick & Easy', desc: 'Fast weeknight meals under 30 min', tag: 'Curated', color: 'bg-brand-50 border-brand-100' },
              { name: 'Week B — Family Favorites', desc: 'Kid-approved crowd-pleasers', tag: 'Curated', color: 'bg-brand-50 border-brand-100' },
              { name: 'Holiday Week', desc: 'Festive seasonal meals', tag: '🎄 Holiday', color: 'bg-red-50 border-red-100' },
            ].map((plan) => (
              <Link key={plan.name} href="/plans" className={`card border ${plan.color} hover:shadow-md transition-shadow space-y-2`}>
                <span className="text-xs font-semibold text-brand-500">{plan.tag}</span>
                <h4 className="font-semibold text-gray-900 text-sm">{plan.name}</h4>
                <p className="text-xs text-gray-500">{plan.desc}</p>
                <span className="text-brand-500 text-xs font-semibold">Use this plan →</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
