import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, PlusCircle, List, BarChart2, Settings } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/',          icon: Home,       label: 'Beranda' },
  { to: '/history',   icon: List,       label: 'Riwayat' },
  { to: '/add',       icon: PlusCircle, label: 'Tambah',  special: true },
  { to: '/dashboard', icon: BarChart2,  label: 'Statistik' },
  { to: '/settings',  icon: Settings,   label: 'Lainnya' },
];

export default function BottomNavigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 safe-bottom">
      <div className="bg-white/90 backdrop-blur-md border-t border-primary-100 px-2 pt-2 pb-3">
        <div className="flex items-end justify-around">
          {NAV_ITEMS.map(({ to, icon: Icon, label, special }) => {
            const active = location.pathname === to ||
              (to === '/history' && location.pathname.startsWith('/detail'));

            if (special) {
              return (
                <NavLink key={to} to={to} className="flex flex-col items-center -mt-5">
                  <div className={`
                    w-14 h-14 rounded-full flex items-center justify-center shadow-glow
                    transition-all duration-200
                    ${active
                      ? 'bg-gradient-to-br from-primary-400 to-primary-600 scale-110'
                      : 'bg-gradient-to-br from-primary-400 to-peach-400'
                    }
                  `}>
                    <Icon size={26} className="text-white" />
                  </div>
                  <span className={`text-[10px] mt-1 font-bold ${active ? 'text-primary-500' : 'text-gray-400'}`}>
                    {label}
                  </span>
                </NavLink>
              );
            }

            return (
              <NavLink key={to} to={to} className="flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all duration-200">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${active ? 'bg-primary-100 scale-110' : ''}`}>
                  <Icon size={20} className={active ? 'text-primary-500' : 'text-gray-400'} />
                </div>
                <span className={`text-[10px] font-bold transition-colors duration-200 ${active ? 'text-primary-500' : 'text-gray-400'}`}>
                  {label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
