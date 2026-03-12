import { useCallback } from 'react';
import useStore from '../store/useStore';
import * as apiService from '../services/api';
import * as db from '../services/db';
import { queueForSync } from '../services/sync';
import { generateId } from '../utils/helpers';

export function useApplications() {
  const {
    applications, loading, error, isOnline,
    setApplications, setLoading, setError,
    addApplicationLocally, updateApplicationLocally, removeApplicationLocally,
    showToast,
  } = useStore();

  // Fetch from API → cache locally
  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (isOnline) {
        const res = await apiService.getApplications();
        const data = res.data || [];
        setApplications(data);
        await db.saveAllToDB(data);
      } else {
        const cached = await db.getAllFromDB();
        setApplications(cached);
      }
    } catch (err) {
      setError(err.message);
      // Fallback to cache
      try {
        const cached = await db.getAllFromDB();
        setApplications(cached);
      } catch (_) {}
    } finally {
      setLoading(false);
    }
  }, [isOnline, setApplications, setLoading, setError]);

  // Add new application
  const addApplication = useCallback(async (formData) => {
    const appData = { ...formData, id: formData.id || generateId() };
    // Optimistic update
    addApplicationLocally(appData);
    await db.saveOneToDB(appData);

    if (isOnline) {
      try {
        const res = await apiService.createApplication(appData);
        updateApplicationLocally(appData.id, res.data || appData);
        await db.saveOneToDB(res.data || appData);
        showToast('Yeay, lamaran berhasil disimpan! 💌', 'success');
      } catch (err) {
        await queueForSync('create', appData);
        showToast('Disimpan offline, akan sync saat online 📶', 'warning');
      }
    } else {
      await queueForSync('create', appData);
      showToast('Disimpan offline, akan sync saat online 📶', 'warning');
    }
    return appData;
  }, [isOnline, addApplicationLocally, updateApplicationLocally, showToast]);

  // Update application
  const updateApplication = useCallback(async (id, updates) => {
    updateApplicationLocally(id, updates);
    const existing = applications.find(a => a.id === id);
    const updated = { ...existing, ...updates };
    await db.saveOneToDB(updated);

    if (isOnline) {
      try {
        await apiService.updateApplication(id, updates);
        showToast('Data berhasil diperbarui ✨', 'success');
      } catch (err) {
        await queueForSync('update', updated);
        showToast('Diperbarui offline, akan sync saat online 📶', 'warning');
      }
    } else {
      await queueForSync('update', updated);
      showToast('Diperbarui offline, akan sync saat online 📶', 'warning');
    }
  }, [isOnline, applications, updateApplicationLocally, showToast]);

  // Delete application
  const deleteApplication = useCallback(async (id) => {
    removeApplicationLocally(id);
    await db.deleteOneFromDB(id);

    if (isOnline) {
      try {
        await apiService.deleteApplication(id);
        showToast('Lamaran berhasil dihapus', 'success');
      } catch (err) {
        await queueForSync('delete', { id });
      }
    } else {
      await queueForSync('delete', { id });
    }
  }, [isOnline, removeApplicationLocally, showToast]);

  // Toggle favorite
  const toggleFavorite = useCallback(async (id) => {
    const app = applications.find(a => a.id === id);
    if (!app) return;
    const isFav = app.is_favorit === 'true';
    await updateApplication(id, { is_favorit: isFav ? 'false' : 'true' });
  }, [applications, updateApplication]);

  return { applications, loading, error, fetchApplications, addApplication, updateApplication, deleteApplication, toggleFavorite };
}
