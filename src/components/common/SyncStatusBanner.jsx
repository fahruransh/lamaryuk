import React from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle } from 'lucide-react';
import { useOfflineSync } from '../../hooks/useOfflineSync';

export default function SyncStatusBanner() {
  const { isOnline, hasPending, syncNow, pendingSyncs } = useOfflineSync();

  if (isOnline && !hasPending) return null;

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 mx-4 rounded-2xl text-sm font-semibold
        animate-slide-up
        ${!isOnline
          ? 'bg-amber-50 border border-amber-200 text-amber-700'
          : 'bg-sky-50 border border-sky-200 text-sky-700'
        }
      `}
    >
      {!isOnline ? (
        <>
          <WifiOff size={18} className="shrink-0 text-amber-500" />
          <span className="flex-1">Offline mode aktif 📡</span>
        </>
      ) : (
        <>
          <RefreshCw size={18} className="shrink-0 text-sky-500 animate-spin" />
          <span className="flex-1">
            {pendingSyncs.length} data menunggu sinkronisasi…
          </span>
          <button onClick={syncNow} className="underline text-sky-600 font-bold text-xs">
            Sync Sekarang
          </button>
        </>
      )}
    </div>
  );
}
