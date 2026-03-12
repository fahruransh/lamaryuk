import React from 'react';
import { getStatusConfig } from '../../utils/helpers';

export default function StatusBadge({ status, size = 'md' }) {
  const cfg = getStatusConfig(status);

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-3 py-1',
    lg: 'text-sm px-4 py-1.5',
  };

  return (
    <span className={`
      inline-flex items-center gap-1.5 rounded-full font-bold
      border ${cfg.bg} ${cfg.text} ${cfg.border} ${sizes[size]}
    `}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.emoji} {cfg.label}
    </span>
  );
}
