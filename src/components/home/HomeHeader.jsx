import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { getRandomQuote } from '../../utils/helpers';
import { useApplications } from '../../hooks/useApplications';

export default function HomeHeader() {
  const { fetchApplications, loading } = useApplications();
  const [quote, setQuote] = useState(getRandomQuote());

  useEffect(() => {
    const interval = setInterval(() => setQuote(getRandomQuote()), 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-b-[2.5rem] bg-gradient-to-br from-primary-300 via-primary-400 to-peach-300 px-5 pt-12 pb-8 mx-0">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/3" />

      {/* Top row */}
      <div className="flex items-start justify-between relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl animate-float">💼</span>
            <h1 className="text-2xl font-black text-white tracking-tight">LamarYuk</h1>
          </div>
          <p className="text-white/80 text-xs font-medium">Semangat cari kerja! 🌸</p>
        </div>

        <button
          onClick={() => { fetchApplications(); setQuote(getRandomQuote()); }}
          className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center active:scale-90 transition-all"
        >
          <RefreshCw size={16} className={`text-white ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Quote */}
      <div className="relative z-10 mt-4 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-3">
        <p className="text-white text-sm font-semibold leading-relaxed text-center">
          {quote}
        </p>
      </div>
    </div>
  );
}
