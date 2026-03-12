import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const CONFIGS = {
  success: { icon: CheckCircle, bg: 'bg-white', border: 'border-green-200',  text: 'text-green-700',  iconColor: 'text-green-500'  },
  error:   { icon: XCircle,     bg: 'bg-white', border: 'border-rose-200',   text: 'text-rose-700',   iconColor: 'text-rose-500'   },
  warning: { icon: AlertCircle, bg: 'bg-white', border: 'border-amber-200',  text: 'text-amber-700',  iconColor: 'text-amber-500'  },
  info:    { icon: Info,        bg: 'bg-white', border: 'border-sky-200',    text: 'text-sky-700',    iconColor: 'text-sky-500'    },
};

export default function Toast({ message, type = 'success' }) {
  const [visible, setVisible] = useState(false);
  const cfg = CONFIGS[type] || CONFIGS.info;
  const Icon = cfg.icon;

  useEffect(() => {
    setVisible(true);
    return () => setVisible(false);
  }, [message]);

  return (
    <div
      className={`
        fixed top-5 left-1/2 -translate-x-1/2 z-[9999]
        flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-soft
        max-w-[90vw] min-w-[260px]
        ${cfg.bg} ${cfg.border}
        transition-all duration-300
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
      `}
    >
      <Icon size={20} className={`shrink-0 ${cfg.iconColor}`} />
      <p className={`text-sm font-semibold flex-1 ${cfg.text}`}>{message}</p>
    </div>
  );
}
