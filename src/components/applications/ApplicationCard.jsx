import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Send, Heart } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatDateShort, truncate } from '../../utils/helpers';
import { useApplications } from '../../hooks/useApplications';

export default function ApplicationCard({ application }) {
  const navigate = useNavigate();
  const { toggleFavorite } = useApplications();

  const {
    id, perusahaan, posisi, kota, tanggal_lamar,
    metode_kirim, status, catatan, is_favorit
  } = application;

  const isFav = is_favorit === 'true';

  const handleFav = (e) => {
    e.stopPropagation();
    toggleFavorite(id);
  };

  return (
    <div
      onClick={() => navigate(`/detail/${id}`)}
      className="card active:scale-[0.98] transition-all duration-200 cursor-pointer hover:shadow-soft"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-extrabold text-gray-800 text-base leading-tight truncate">
            {perusahaan}
          </h3>
          <p className="text-sm text-primary-500 font-semibold truncate">{posisi}</p>
        </div>
        <button onClick={handleFav} className="p-1 shrink-0">
          <Heart
            size={18}
            className={isFav ? 'fill-rose-400 text-rose-400' : 'text-gray-300'}
          />
        </button>
      </div>

      {/* Info row */}
      <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-3">
        <span className="flex items-center gap-1">
          <MapPin size={12} className="text-peach-400" />
          {kota || '-'}
        </span>
        <span className="flex items-center gap-1">
          <Calendar size={12} className="text-lavender-400" />
          {formatDateShort(tanggal_lamar)}
        </span>
        <span className="flex items-center gap-1">
          <Send size={12} className="text-primary-300" />
          {truncate(metode_kirim, 20)}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <StatusBadge status={status} size="sm" />
        {catatan && (
          <p className="text-[11px] text-gray-400 italic truncate max-w-[130px]">
            "{truncate(catatan, 25)}"
          </p>
        )}
      </div>
    </div>
  );
}
