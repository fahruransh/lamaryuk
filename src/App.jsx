import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import AppLayout      from './components/layout/AppLayout';
import Home           from './pages/Home';
import AddApplication from './pages/AddApplication';
import History        from './pages/History';
import Detail         from './pages/Detail';
import Dashboard      from './pages/Dashboard';
import Settings       from './pages/Settings';
import Toast          from './components/common/Toast';

import { useOfflineSync } from './hooks/useOfflineSync';
import { useApplications } from './hooks/useApplications';
import useStore from './store/useStore';

export default function App() {
  const { fetchApplications } = useApplications();
  const { toast } = useStore();

  // Initialize offline sync listener
  useOfflineSync();

  // Load applications on startup
  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <>
      <AppLayout>
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/add"       element={<AddApplication />} />
          <Route path="/edit/:id"  element={<AddApplication />} />
          <Route path="/history"   element={<History />} />
          <Route path="/detail/:id" element={<Detail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings"  element={<Settings />} />
        </Routes>
      </AppLayout>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </>
  );
}
