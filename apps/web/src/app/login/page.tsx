'use client';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 space-y-5">
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-700">🛒 PantryPilot</div>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>
        <div className="space-y-3">
          <input type="email" placeholder="Email" value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400" />
          <input type="password" placeholder="Password" value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400" />
        </div>
        <button className="w-full bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors">
          Sign In
        </button>
        <p className="text-center text-sm text-gray-500">
          Don&apos;t have an account? <a href="/signup" className="text-blue-700 font-medium">Sign up</a>
        </p>
      </div>
    </div>
  );
}
