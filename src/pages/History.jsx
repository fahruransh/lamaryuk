import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterBar from '../components/applications/FilterBar';
import ApplicationCard from '../components/applications/ApplicationCard';
import EmptyStateCute from '../components/common/EmptyStateCute';
import useStore from '../store/useStore';

export default function History() {
  const [searchParams] = useSearchParams();
  const { applications, loading } = useStore();

  const [search,       setSearch]       = useState('');
  const [activeStatus, setActiveStatus] = useState(searchParams.get('status') || '');
  const [sortOrder,    setSortOrder]    = useState('newest');

  const filtered = useMemo(() => {
    let list = [...applications];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(a =>
        a.perusahaan?.toLowerCase().includes(q) ||
        a.posisi?.toLowerCase().includes(q) ||
        a.kota?.toLowerCase().includes(q)
      );
    }

    if (activeStatus) {
      list = list.filter(a => a.status === activeStatus);
    }

    list.sort((a, b) => {
      const da = new Date(a.tanggal_lamar);
      const db2 = new Date(b.tanggal_lamar);
      return sortOrder === 'newest' ? db2 - da : da - db2;
    });

    return list;
  }, [applications, search, activeStatus, sortOrder]);

  return (
    <div className="animate-fade-in pb-28">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-primary-100 px-4 py-4">
        <h1 className="font-extrabold text-gray-800 text-xl mb-1">Riwayat Lamaran 📋</h1>
        <p className="text-xs text-gray-400 font-medium">
          {applications.length} total lamaran tersimpan
        </p>
      </div>

      <div className="px-4 pt-4 space-y-4">
        <FilterBar
          search={search} onSearch={setSearch}
          activeStatus={activeStatus} onStatusChange={setActiveStatus}
          sortOrder={sortOrder} onSortChange={setSortOrder}
        />

        {loading ? (
          <div className="space-y-3 mt-2">
            {[1,2,3].map(i => (
              <div key={i} className="card animate-pulse">
                <div className="h-4 bg-primary-100 rounded-full w-3/4 mb-2" />
                <div className="h-3 bg-primary-50 rounded-full w-1/2 mb-3" />
                <div className="h-6 bg-primary-100 rounded-full w-24" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyStateCute
            title={search || activeStatus ? 'Tidak ada hasil 🔍' : 'Belum ada lamaran nih 🌸'}
            subtitle={search || activeStatus
              ? 'Coba ganti kata kunci atau filter lainnya ya'
              : 'Yuk mulai catat lamaran pertamamu! 💌'
            }
            showButton={!search && !activeStatus}
          />
        ) : (
          <>
            <p className="text-xs text-gray-400 font-medium">
              Menampilkan {filtered.length} lamaran
            </p>
            <div className="space-y-3">
              {filtered.map(app => (
                <ApplicationCard key={app.id} application={app} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
