import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, BarChart2, Heart, Trophy, Send, Clock } from 'lucide-react';
import HomeHeader from '../components/home/HomeHeader';
import SummaryCard from '../components/home/SummaryCard';
import ApplicationCard from '../components/applications/ApplicationCard';
import EmptyStateCute from '../components/common/EmptyStateCute';
import useStore from '../store/useStore';
import { getThisMonthApplications, groupByStatus } from '../utils/helpers';

export default function Home() {
  const navigate = useNavigate();
  const { applications, loading } = useStore();

  const stats = useMemo(() => {
    const byStatus = groupByStatus(applications);
    const thisMonth = getThisMonthApplications(applications);
    return {
      total:     applications.length,
      bulanIni:  thisMonth.length,
      diproses:  byStatus['Diproses'] || 0,
      interview: byStatus['Interview'] || 0,
      offer:     byStatus['Offer'] || 0,
      diterima:  byStatus['Diterima'] || 0,
      ditolak:   byStatus['Ditolak'] || 0,
    };
  }, [applications]);

  const recentApps = useMemo(() =>
    [...applications]
      .sort((a, b) => new Date(b.tanggal_lamar) - new Date(a.tanggal_lamar))
      .slice(0, 3)
  , [applications]);

  return (
    <div className="animate-fade-in pb-28">
      <HomeHeader />

      <div className="px-4 py-5 space-y-5">
        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => navigate('/add')}
            className="btn-primary flex items-center justify-center gap-2 py-4">
            <Send size={18} /> Tambah Lamaran
          </button>
          <button onClick={() => navigate('/history')}
            className="btn-secondary flex items-center justify-center gap-2 py-4">
            <List size={18} /> Lihat Riwayat
          </button>
        </div>

        {/* Stats grid */}
        <div>
          <h2 className="section-title mb-3 flex items-center gap-2">
            <Trophy size={18} className="text-peach-400" /> Ringkasan
          </h2>
          <div className="grid grid-cols-3 gap-2">
            <SummaryCard label="Total" value={stats.total}
              emoji="📋" bg="bg-primary-50" text="text-primary-600"
              onClick={() => navigate('/history')} />
            <SummaryCard label="Bulan Ini" value={stats.bulanIni}
              emoji="📅" bg="bg-peach-50" text="text-peach-500"
              onClick={() => navigate('/history')} />
            <SummaryCard label="Interview" value={stats.interview}
              emoji="🎤" bg="bg-violet-50" text="text-violet-600"
              onClick={() => navigate('/history?status=Interview')} />
            <SummaryCard label="Diproses" value={stats.diproses}
              emoji="⏳" bg="bg-amber-50" text="text-amber-600"
              onClick={() => navigate('/history?status=Diproses')} />
            <SummaryCard label="Offer" value={stats.offer}
              emoji="🎉" bg="bg-emerald-50" text="text-emerald-600"
              onClick={() => navigate('/history?status=Offer')} />
            <SummaryCard label="Diterima" value={stats.diterima}
              emoji="🌟" bg="bg-green-50" text="text-green-600"
              onClick={() => navigate('/history?status=Diterima')} />
          </div>
        </div>

        {/* Recent applications */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-title flex items-center gap-2">
              <Clock size={18} className="text-lavender-400" /> Terbaru
            </h2>
            {applications.length > 3 && (
              <button onClick={() => navigate('/history')}
                className="text-xs text-primary-500 font-bold">
                Lihat semua →
              </button>
            )}
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1,2].map(i => (
                <div key={i} className="card animate-pulse">
                  <div className="h-4 bg-primary-100 rounded-full w-3/4 mb-2" />
                  <div className="h-3 bg-primary-50 rounded-full w-1/2" />
                </div>
              ))}
            </div>
          ) : recentApps.length === 0 ? (
            <EmptyStateCute
              title="Belum ada lamaran nih 🌸"
              subtitle="Yuk mulai catat perjalanan kariermu! Satu lamaran pertama adalah langkah terbesar 💖"
            />
          ) : (
            <div className="space-y-3">
              {recentApps.map(app => (
                <ApplicationCard key={app.id} application={app} />
              ))}
            </div>
          )}
        </div>

        {/* Motivasi */}
        <div className="card bg-gradient-to-r from-lavender-50 to-primary-50 border-lavender-100 text-center py-5">
          <div className="text-3xl mb-2">🌷</div>
          <p className="text-sm font-semibold text-gray-600 leading-relaxed">
            "Setiap lamaran yang kamu kirim adalah bukti<br />
            keberanian dan usahamu yang luar biasa 💖"
          </p>
        </div>
      </div>
    </div>
  );
}
