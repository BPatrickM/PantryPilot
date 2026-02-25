import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-brand-50 to-white flex flex-col items-center justify-center px-6 py-20">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Logo */}
        <div className="space-y-2">
          <h1 className="text-5xl font-bold text-brand-500">🛒 PantryPilot</h1>
          <p className="text-xl text-gray-500 font-medium">From meal idea to checkout — automatically.</p>
        </div>

        {/* Value props */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          {[
            { icon: '🍽️', title: 'Pick Your Meals', desc: 'Browse curated recipes or paste your own. Build your week like a takeout menu.' },
            { icon: '🧮', title: 'Smart Scaling', desc: 'Enter your headcount. Ingredients auto-scale and your pantry stock is subtracted.' },
            { icon: '🚀', title: 'Cart in Seconds', desc: 'One tap pushes everything to your ShopRite or Walmart cart. Done.' },
          ].map((card) => (
            <div key={card.title} className="card space-y-2">
              <span className="text-3xl">{card.icon}</span>
              <h3 className="font-semibold text-gray-900">{card.title}</h3>
              <p className="text-sm text-gray-500">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup" className="btn-primary text-center text-lg">
            Get Started — It&apos;s Free
          </Link>
          <Link href="/login" className="btn-secondary text-center text-lg">
            Sign In
          </Link>
        </div>

        <p className="text-xs text-gray-400">Works with ShopRite and Walmart. More retailers coming soon.</p>
      </div>
    </main>
  );
}
