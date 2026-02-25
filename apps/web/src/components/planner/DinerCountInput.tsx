'use client';

interface DinerCountInputProps {
  nDiners: number;
  onChange: (n: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export function DinerCountInput({ nDiners, onChange, onNext, onBack }: DinerCountInputProps) {
  return (
    <div className="space-y-8 max-w-md mx-auto text-center">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">How many people are you cooking for?</h2>
        <p className="text-gray-500 mt-1">Ingredients will scale automatically.</p>
      </div>

      {/* Big number display */}
      <div className="card flex items-center justify-center gap-8 py-10">
        <button
          onClick={() => onChange(Math.max(1, nDiners - 1))}
          className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 text-2xl font-bold transition-colors">
          −
        </button>
        <div className="text-center">
          <span className="text-6xl font-bold text-brand-500">{nDiners}</span>
          <p className="text-gray-500 text-sm mt-1">{nDiners === 1 ? 'person' : 'people'}</p>
        </div>
        <button
          onClick={() => onChange(Math.min(20, nDiners + 1))}
          className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 text-2xl font-bold transition-colors">
          +
        </button>
      </div>

      {/* Quick pick */}
      <div className="flex justify-center gap-3 flex-wrap">
        {[1, 2, 3, 4, 5, 6, 8].map(n => (
          <button key={n} onClick={() => onChange(n)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              nDiners === n ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            {n}
          </button>
        ))}
      </div>

      <div className="flex gap-4 justify-center">
        <button onClick={onBack} className="btn-secondary">← Back</button>
        <button onClick={onNext} className="btn-primary">Build My List →</button>
      </div>
    </div>
  );
}
