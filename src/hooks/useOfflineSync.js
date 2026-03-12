import { useEffect, useCallback } from 'react';
import useStore from '../store/useStore';
import { syncPendingData } from '../services/sync';
import { getAllPendingSyncs } from '../services/db';

export function useOfflineSync() {
  const { isOnline, setIsOnline, pendingSyncs, setPendingSyncs, showToast } = useStore();

  // Track online/offline status
  useEffect(() => {
    const handleOnline  = () => { setIsOnline(true);  };
    const handleOffline = () => { setIsOnline(false); showToast('Kamu sedang offline 📡', 'warning'); };

    window.addEventListener('online',  handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online',  handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setIsOnline, showToast]);

  // Load pending syncs from DB on mount
  useEffect(() => {
    getAllPendingSyncs().then(setPendingSyncs).catch(() => {});
  }, [setPendingSyncs]);

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline && pendingSyncs.length > 0) {
      syncNow();
    }
  }, [isOnline]);

  const syncNow = useCallback(async () => {
    if (!isOnline) {
      showToast('Tidak bisa sync, masih offline 📡', 'error');
      return;
    }
    try {
      showToast('Sedang sinkronisasi data… 🔄', 'info');
      const { synced, failed } = await syncPendingData();
      const remaining = await getAllPendingSyncs();
      setPendingSyncs(remaining);
      if (synced > 0) {
        showToast(`Sinkronisasi selesai! ${synced} data berhasil 💖`, 'success');
      }
      if (failed > 0) {
        showToast(`${failed} data gagal disinkronkan 😢`, 'error');
      }
    } catch (err) {
      showToast('Sinkronisasi gagal, coba lagi nanti', 'error');
    }
  }, [isOnline, setPendingSyncs, showToast]);

  return { isOnline, pendingSyncs, syncNow, hasPending: pendingSyncs.length > 0 };
}
