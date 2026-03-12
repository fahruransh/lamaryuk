import React, { useState } from 'react';
import { RefreshCw, Trash2, Download, Wifi, Info, Heart, Database, Bell } from 'lucide-react';
import { useApplications } from '../hooks/useApplications';
import { useOfflineSync } from '../hooks/useOfflineSync';
import { clearApplicationsDB, clearPendingSyncs } from '../services/db';
import useStore from '../store/useStore';

export default function Settings() {
  const { fetchApplications, applications } = useApplications();
  const { isOnline, syncNow, hasPending, pendingSyncs } = useOfflineSync();
  const { showToast, setApplications } = useStore();
  const [clearing, setClearing] = useState(false);

  async function handleClearCache() {
    setClearing(true);
    try {
      await clearApplicationsDB();
      await clearPendingSyncs();
      setApplications([]);
      showToast('Cache berhasil dibersihkan ✨', 'success');
    } catch (err) {
      showToast('Gagal membersihkan cache 😢', 'error');
    } finally {
      setClearing(false);
    }
  }

  function handleExport() {
    const json = JSON.stringify(applications, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lamaryuk-export-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data berhasil diekspor! 💾', 'success');
  }

  const menuSections = [
    {
      title: '🔄 Sinkronisasi',
      items: [
        {
          icon: RefreshCw,
          label: 'Refresh Data',
          desc: 'Ambil data terbaru dari server',
          action: fetchApplications,
          color: 'text-primary-500',
          bg: 'bg-primary-50',
        },
        {
          icon: Wifi,
          label: hasPending ? `Sync ${pendingSyncs.length} Data Pending` : 'Sinkronisasi Sekarang',
          desc: isOnline ? 'Kirim data offline ke server' : 'Tidak bisa sync, sedang offline',
          action: syncNow,
          color: 'text-sky-500',
          bg: 'bg-sky-50',
          badge: hasPending ? pendingSyncs.length : null,
        },
      ],
    },
    {
      title: '💾 Data',
      items: [
        {
          icon: Download,
          label: 'Export Data',
          desc: `Export ${applications.length} lamaran ke file JSON`,
          action: handleExport,
          color: 'text-emerald-500',
          bg: 'bg-emerald-50',
        },
        {
          icon: Database,
          label: 'Bersihkan Cache',
          desc: 'Hapus data cache lokal (tidak menghapus Google Sheets)',
          action: handleClearCache,
          color: 'text-amber-500',
          bg: 'bg-amber-50',
          loading: clearing,
        },
      ],
    },
  ];

  return (
    <div className="animate-fade-in pb-28">
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-primary-100 px-4 py-4">
        <h1 className="font-extrabold text-gray-800 text-xl">Pengaturan ⚙️</h1>
        <p className="text-xs text-gray-400 font-medium">Kelola aplikasi LamarYuk-mu</p>
      </div>

      <div className="px-4 py-5 space-y-5">
        {/* Status banner */}
        <div className={`card flex items-center gap-3 ${isOnline ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'}`}>
          <div className={`w-3 h-3 rounded-full animate-pulse ${isOnline ? 'bg-emerald-400' : 'bg-amber-400'}`} />
          <div>
            <p className={`text-sm font-bold ${isOnline ? 'text-emerald-700' : 'text-amber-700'}`}>
              {isOnline ? 'Terhubung ke Internet ✅' : 'Mode Offline 📡'}
            </p>
            <p className="text-xs text-gray-500">
              {hasPending ? `${pendingSyncs.length} data menunggu sync` : 'Semua data tersinkronisasi'}
            </p>
          </div>
        </div>

        {/* Menu sections */}
        {menuSections.map(section => (
          <div key={section.title}>
            <h2 className="section-title mb-3">{section.title}</h2>
            <div className="card space-y-0 p-0 overflow-hidden">
              {section.items.map((item, i) => (
                <button key={i} onClick={item.action} disabled={item.loading}
                  className="flex items-center gap-3 p-4 w-full active:bg-primary-50 transition-all border-b border-gray-50 last:border-0">
                  <div className={`w-10 h-10 ${item.bg} rounded-2xl flex items-center justify-center shrink-0`}>
                    <item.icon size={18} className={item.color} />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-bold text-gray-800">{item.label}</p>
                    <p className="text-xs text-gray-400 truncate">{item.desc}</p>
                  </div>
                  {item.badge && (
                    <span className="bg-rose-400 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {item.loading && <RefreshCw size={16} className="animate-spin text-gray-400" />}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* About */}
        <div className="card bg-gradient-to-br from-primary-50 to-lavender-50 border-primary-100 text-center py-6 space-y-2">
          <div className="text-4xl mb-1">💼</div>
          <h3 className="font-extrabold text-gray-800">LamarYuk</h3>
          <p className="text-xs text-gray-500">Versi 1.0.0</p>
          <p className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto">
            Dibuat dengan <span className="text-rose-400">💖</span> untuk menemanimu dalam
            perjalanan mencari pekerjaan impian
          </p>
          <p className="text-xs text-primary-400 font-semibold">
            Semangat terus ya! Kamu pasti bisa 🌟
          </p>
        </div>
      </div>
    </div>
  );
}
