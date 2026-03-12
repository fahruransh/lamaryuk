import { create } from 'zustand';

const useStore = create((set, get) => ({
  // ── State ────────────────────────────────────────────────────────────────
  applications:  [],
  loading:       false,
  error:         null,
  isOnline:      typeof navigator !== 'undefined' ? navigator.onLine : true,
  pendingSyncs:  [],
  toast:         null,         // { message, type: 'success'|'error'|'info'|'warning' }
  draftForm:     null,         // autosaved form draft

  // ── Setters ──────────────────────────────────────────────────────────────
  setApplications: (applications) => set({ applications }),
  setLoading:      (loading)       => set({ loading }),
  setError:        (error)         => set({ error }),
  setIsOnline:     (isOnline)      => set({ isOnline }),
  setPendingSyncs: (pendingSyncs)  => set({ pendingSyncs }),
  setDraftForm:    (draft)         => set({ draftForm: draft }),

  // ── Toast ────────────────────────────────────────────────────────────────
  showToast: (message, type = 'success', duration = 3500) => {
    set({ toast: { message, type } });
    setTimeout(() => set({ toast: null }), duration);
  },
  clearToast: () => set({ toast: null }),

  // ── Applications CRUD (local state only) ─────────────────────────────────
  addApplicationLocally: (app) =>
    set(s => ({ applications: [app, ...s.applications] })),

  updateApplicationLocally: (id, updates) =>
    set(s => ({
      applications: s.applications.map(a => a.id === id ? { ...a, ...updates } : a),
    })),

  removeApplicationLocally: (id) =>
    set(s => ({ applications: s.applications.filter(a => a.id !== id) })),

  // ── Pending syncs ─────────────────────────────────────────────────────────
  addPendingSync:    (item) => set(s => ({ pendingSyncs: [...s.pendingSyncs, item] })),
  removePendingSync: (id)   => set(s => ({ pendingSyncs: s.pendingSyncs.filter(p => p.id !== id) })),
}));

export default useStore;
