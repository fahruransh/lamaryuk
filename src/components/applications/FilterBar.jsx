import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { STATUS_OPTIONS } from '../../utils/constants';

export default function FilterBar({ search, onSearch, activeStatus, onStatusChange, sortOrder, onSortChange }) {
  const statuses = [{ value: '', label: 'Semua', emoji: '🌸' }, ...STATUS_OPTIONS];

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder="Cari perusahaan atau posisi…"
          className="input-field pl-10 pr-10 py-3"
        />
        {search && (
          <button onClick={() => onSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X size={16} className="text-gray-400" />
          </button>
        )}
      </div>

      {/* Status filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {statuses.map(s => (
          <button
            key={s.value}
            onClick={() => onStatusChange(s.value)}
            className={`
              shrink-0 text-xs font-bold px-3 py-1.5 rounded-full border transition-all duration-200
              ${activeStatus === s.value
                ? 'bg-primary-400 text-white border-primary-400 shadow-soft'
                : 'bg-white text-gray-500 border-gray-200 active:bg-primary-50'
              }
            `}
          >
            {s.emoji} {s.label}
          </button>
        ))}
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2">
        <SlidersHorizontal size={14} className="text-gray-400" />
        <span className="text-xs text-gray-500 font-medium">Urutkan:</span>
        <button
          onClick={() => onSortChange(sortOrder === 'newest' ? 'oldest' : 'newest')}
          className="text-xs font-bold text-primary-500 bg-primary-50 px-3 py-1 rounded-full"
        >
          {sortOrder === 'newest' ? '🔽 Terbaru' : '🔼 Terlama'}
        </button>
      </div>
    </div>
  );
}
