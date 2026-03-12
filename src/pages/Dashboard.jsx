import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, TrendingUp, MapPin, Building2, RefreshCw } from 'lucide-react';
import DashboardCharts from '../components/dashboard/DashboardCharts';
import EmptyStateCute from '../components/common/EmptyStateCute';
import StatusBadge from '../components/applications/StatusBadge';
import { groupByStatus, getThisMonthApplications } from '../utils/helpers';
import { STATUS_OPTIONS } from '../utils/constants';
import { useApplications } from '../hooks/useApplications';
import useStore from '../store/useStore';

export default function Dashboard() {
  const navigate = useNavigate();
  const { fetchApplications, loading } = useApplications();
  const { applications } = useStore();

  const stats = useMemo(() => {
    const byStatus = groupByStatus(applications);
    const thisMonth = getThisMonthApplications(applications);

    // Top cities
    const cityCount = {};
    applications.forEach(a => {
      if (a.kota) cityCount[a.kota] = (cityCount[a.kota] || 0) + 1;
    });
    const topCities = Object.entries(cityCount)
      .sort((a, b) => b[1] - a[1]).slice(0, 5);

    // Top companies
    const companyCount = {};
    applications.forEach(a => {
      if (a.perusahaan) companyCount[a.perusahaan] = (companyCount[a.perusahaan] || 0) + 1;
    });
    const topCompanies = Object.entries(companyCount)
      .sort((a, b) => b[1] - a[1]).slice(0, 5);

    const successRate = applications.length > 0
      ? Math.round(((byStatus['Diterima'] || 0) / applications.length) * 100)
      : 0;

    return { byStatus, thisMonth, topCities, topCompanies, successRate };
  }, [applications]);

  const highlightStats = [
    { label: 'Total Lamaran',   value: applications.length,                emoji: '📋', color: 'text-primary-600',  bg: 'bg-primary-50'  },
    { label: 'Bulan Ini',       value: stats.thisMonth.length,             emoji: '📅', color: 'text-peach-500',    bg: 'bg-peach-50'    },
    { label: 'Interview',       value: stats.byStatus['Interview'] || 0,   emoji: '🎤', color: 'text-violet-600',   bg: 'bg-violet-50'   },
    { label: 'Offer Diterima',  value: stats.byStatus['Offer'] || 0,       emoji: '🎉', color: 'text-emerald-600',  bg: 'bg-emerald-50'  },
    { label: 'Sudah Diterima',  value: stats.byStatus['Diterima'] || 0,    emoji: '🌟', color: 'text-green-600',    bg: 'bg-green-50'    },
    { label: 'Success Rate',    value: stats.successRate + '%',             emoji: '💫', color: 'text-primary-600',  bg: 'bg-primary-50'  },
  ];

  return (
    <div className="animate-fade-in pb-28">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-primary-100 px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-extrabold text-gray-800 text-xl">Statistik 📊</h1>
            <p className="text-xs text-gray-400 font-medium">Pantau progres perjalananmu</p>
          </div>
          <button onClick={fetchApplications}
            className="w-9 h-9 bg-primary-50 rounded-xl flex items-center justify-center active:scale-90">
            <RefreshCw size={16} className={loading ? 'animate-spin text-primary-400' : 'text-primary-400'} />
          </button>
        </div>
      </div>

      {applications.length === 0 ? (
        <EmptyStateCute
          title="Belum ada data statistik 📊"
          subtitle="Tambahkan lamaran dulu untuk melihat statistiknya ya! 🌸"
        />
      ) : (
        <div className="px-4 py-5 space-y-5">
          {/* Highlight stats */}
          <div>
            <h2 className="section-title mb-3 flex items-center gap-2">
              <Trophy size={18} className="text-peach-400" /> Ringkasan
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {highlightStats.map(s => (
                <div key={s.label} className={`${s.bg} rounded-2xl p-3 text-center border border-white/60`}>
                  <div className="text-xl mb-0.5">{s.emoji}</div>
                  <div className={`text-xl font-black ${s.color}`}>{s.value}</div>
                  <div className="text-[10px] text-gray-500 font-semibold leading-tight mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Status breakdown */}
          <div className="card">
            <h3 className="section-title mb-3 flex items-center gap-2">
              <TrendingUp size={18} className="text-primary-400" /> Status Lamaran
            </h3>
            <div className="space-y-2">
              {STATUS_OPTIONS.map(s => {
                const count = stats.byStatus[s.value] || 0;
                const pct = applications.length > 0 ? (count / applications.length) * 100 : 0;
                return (
                  <div key={s.value} className="flex items-center gap-3">
                    <StatusBadge status={s.value} size="sm" />
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${s.dot} transition-all duration-500`}
                        style={{ width: pct + '%' }} />
                    </div>
                    <span className="text-xs font-bold text-gray-600 w-5 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Charts */}
          <DashboardCharts applications={applications} />

          {/* Top cities */}
          {stats.topCities.length > 0 && (
            <div className="card">
              <h3 className="section-title mb-3 flex items-center gap-2">
                <MapPin size={18} className="text-peach-400" /> Kota Terbanyak
              </h3>
              <div className="space-y-2">
                {stats.topCities.map(([city, count], i) => (
                  <div key={city} className="flex items-center gap-3">
                    <span className="text-sm font-black text-primary-300 w-5">{i + 1}</span>
                    <span className="flex-1 text-sm font-semibold text-gray-700">{city}</span>
                    <span className="text-xs font-bold text-gray-500 bg-primary-50 px-2 py-0.5 rounded-full">
                      {count} lamaran
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top companies */}
          {stats.topCompanies.length > 0 && (
            <div className="card">
              <h3 className="section-title mb-3 flex items-center gap-2">
                <Building2 size={18} className="text-lavender-400" /> Perusahaan Terlamar
              </h3>
              <div className="space-y-2">
                {stats.topCompanies.map(([company, count], i) => (
                  <div key={company} className="flex items-center gap-3">
                    <span className="text-sm font-black text-lavender-300 w-5">{i + 1}</span>
                    <span className="flex-1 text-sm font-semibold text-gray-700 truncate">{company}</span>
                    <span className="text-xs font-bold text-gray-500 bg-lavender-50 px-2 py-0.5 rounded-full">
                      {count}x
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
