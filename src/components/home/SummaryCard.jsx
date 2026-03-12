import React from 'react';

export default function SummaryCard({ label, value, emoji, bg, text, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center
        ${bg} rounded-2xl p-3 border border-white/60
        active:scale-95 transition-all duration-200 shadow-sm
        min-w-0 w-full
      `}
    >
      <span className="text-2xl mb-1">{emoji}</span>
      <span className={`text-2xl font-black ${text}`}>{value}</span>
      <span className="text-[11px] font-semibold text-gray-500 text-center leading-tight mt-0.5">{label}</span>
    </button>
  );
}
